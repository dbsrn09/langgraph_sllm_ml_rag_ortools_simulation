import { Search, X } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const HistorySearchInput = ({ value, onChange }: Props) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);


  const clearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className="
        group w-full max-w-7xl relative z-10 flex items-center
        mt-6 bg-white p-3 rounded-xl shadow gap-3
        focus-within:ring-2 focus-within:ring-gray-300
      "
      onClick={() => inputRef.current?.focus()}
    >
      <Search
        size={18}
        className="
          transition-colors
          group-focus-within:text-orange-500  text-gray-400 group-focus-within:text-orange-500 transition-colors
        "
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none border-none focus:outline-none flex-1"
        placeholder={t("placeholder.searchConver")}
      />


      {value && (
        <X
          size={18}
          onClick={clearInput}
          className="
            cursor-pointer text-gray-400
            hover:text-gray-700
            transition-colors
          "
        />
      )}
    </div>
  );
};

export default HistorySearchInput;
