from __future__ import annotations

import re


def normalize(sql: str) -> str:
    s = sql.strip()
    s = _remove_markdown_fence(s)
    s = _replace_brackets(s)
    s = _remove_n_prefix(s)
    s = _normalize_replace_input(s)
    s = _convert_top_to_limit(s)
    s = _convert_try_convert(s)
    s = _convert_convert(s)
    s = _convert_isnull(s)
    s = _convert_getdate(s)
    s = _convert_dateadd(s)
    s = _convert_datediff(s)
    return s.strip()


def _remove_markdown_fence(s: str) -> str:
    s = re.sub(r"```[a-zA-Z]*\n?", "", s)
    return s.replace("```", "")


def _replace_brackets(s: str) -> str:
    return re.sub(r"\[([^\]]+)\]", r'"\1"', s)


def _remove_n_prefix(s: str) -> str:
    return re.sub(r"\bN'", "'", s)


def _convert_top_to_limit(s: str) -> str:
    match = re.search(r"(?i)\bSELECT\s+TOP\s*\(?\s*(\d+)\s*\)?", s)
    if not match:
        return s
    n = match.group(1)
    s = re.sub(r"(?i)\bTOP\s*\(?\s*\d+\s*\)?", "", s, count=1)
    s = re.sub(r"(?i)\s*;\s*$", "", s).rstrip()
    s = s + f"\nLIMIT {n};"
    return s


def _split_type_and_value(args: str) -> tuple[str, str]:
    depth = 0
    for i, ch in enumerate(args):
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        elif ch == "," and depth == 0:
            return args[:i].strip(), args[i + 1:].strip()
    return args.strip(), ""


def _split_top_level_args(args: str) -> list[str]:
    parts: list[str] = []
    depth = 0
    in_single_quote = False
    start = 0
    i = 0
    while i < len(args):
        ch = args[i]
        if ch == "'":
            if in_single_quote and i + 1 < len(args) and args[i + 1] == "'":
                i += 2
                continue
            in_single_quote = not in_single_quote
        elif not in_single_quote:
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
            elif ch == "," and depth == 0:
                parts.append(args[start:i].strip())
                start = i + 1
        i += 1
    parts.append(args[start:].strip())
    return parts


def _extract_func_args(s: str, start: int) -> tuple[str, int]:
    assert s[start] == "("
    depth = 0
    for i in range(start, len(s)):
        if s[i] == "(":
            depth += 1
        elif s[i] == ")":
            depth -= 1
            if depth == 0:
                return s[start + 1: i], i
    return s[start + 1:], len(s) - 1


def _replace_func(s: str, func_name: str, builder) -> str:
    result = []
    i = 0
    pattern = re.compile(rf"(?i)\b{re.escape(func_name)}\s*\(")
    while i < len(s):
        m = pattern.search(s, i)
        if not m:
            result.append(s[i:])
            break
        result.append(s[i: m.start()])
        paren_start = m.end() - 1
        inner, paren_end = _extract_func_args(s, paren_start)
        replacement = builder(inner)
        result.append(replacement)
        i = paren_end + 1
    return "".join(result)


def _convert_try_convert(s: str) -> str:
    def _builder(inner: str) -> str:
        type_, value = _split_type_and_value(inner)
        if not value:
            return f"TRY_CONVERT({inner})"
        return f"TRY_CAST({value} AS {type_})"
    return _replace_func(s, "TRY_CONVERT", _builder)


def _normalize_replace_input(s: str) -> str:
    def _builder(inner: str) -> str:
        args = _split_top_level_args(inner)
        if len(args) != 3:
            return f"REPLACE({inner})"
        target, old, new = args
        if target.strip().lower().startswith("cast("):
            return f"REPLACE({target}, {old}, {new})"
        return f"REPLACE(CAST({target} AS VARCHAR), {old}, {new})"

    return _replace_func(s, "REPLACE", _builder)


def _convert_convert(s: str) -> str:
    def _builder(inner: str) -> str:
        type_, value = _split_type_and_value(inner)
        if not value:
            return f"CONVERT({inner})"
        return f"CAST({value} AS {type_})"
    return _replace_func(s, "CONVERT", _builder)


def _convert_isnull(s: str) -> str:
    return re.sub(r"(?i)\bISNULL\s*\(", "COALESCE(", s)


def _convert_getdate(s: str) -> str:
    return re.sub(r"(?i)\bGETDATE\s*\(\s*\)", "current_date", s)


def _convert_dateadd(s: str) -> str:
    unit_map = {
        "dd": "DAY", "d": "DAY", "day": "DAY",
        "mm": "MONTH", "m": "MONTH", "month": "MONTH",
        "yy": "YEAR", "yyyy": "YEAR", "year": "YEAR",
        "hh": "HOUR", "hour": "HOUR",
        "mi": "MINUTE", "n": "MINUTE", "minute": "MINUTE",
    }

    def _repl(m: re.Match) -> str:
        unit  = m.group(1).strip().lower()
        n     = int(m.group(2).strip())
        base  = m.group(3).strip()
        dunit = unit_map.get(unit, unit.upper())
        op    = "-" if n < 0 else "+"
        return f"({base} {op} INTERVAL '{abs(n)}' {dunit})"

    for _ in range(5):
        new_s = re.sub(
            r"(?i)\bDATEADD\s*\(\s*(\w+)\s*,\s*(-?\d+)\s*,\s*([^)]+)\)",
            _repl,
            s,
        )
        if new_s == s:
            break
        s = new_s
    return s


def _convert_datediff(s: str) -> str:
    unit_map = {
        "dd": "day", "d": "day", "day": "day",
        "mm": "month", "m": "month", "month": "month",
        "yy": "year", "yyyy": "year", "year": "year",
    }

    def _repl(m: re.Match) -> str:
        unit  = m.group(1).strip().lower()
        start = m.group(2).strip()
        end   = m.group(3).strip()
        dunit = unit_map.get(unit, unit.lower())
        return f"date_diff('{dunit}', {start}, {end})"

    return re.sub(
        r"(?i)\bDATEDIFF\s*\(\s*(\w+)\s*,\s*([^,]+?)\s*,\s*([^)]+)\)",
        _repl,
        s,
    )


if __name__ == "__main__":
    samples = [
        """SELECT TOP (10)
       "거래처",
       SUM(TRY_CONVERT(decimal(18,2), REPLACE([매출금액], ',', ''))) AS [매출합계]
FROM "SALES_ORDER_ITEMS"
GROUP BY "거래처"
ORDER BY [매출합계] DESC;""",

        "SELECT * FROM [SALES_ORDER_ITEMS] WHERE [수주일] >= DATEADD(dd, -90, GETDATE());",

        "SELECT ISNULL([비고], N'없음') FROM [INVOICE_ITEMS];",

        "SELECT DATEDIFF(dd, [수주일], GETDATE()) AS 경과일 FROM [SALES_ORDER_ITEMS];",
    ]

    for i, sql in enumerate(samples, 1):
        print(f"─── 샘플 {i} ───────────────────────────────")
        print("[원본]")
        print(sql)
        print("[변환]")
        print(normalize(sql))
        print()
