RAG 문서 세트

이 폴더는 벡터 임베딩용 문서를 모아둔 위치다.
문서는 질문 응답 시 근거 컨텍스트로 검색되어 사용된다.

구성 파일
- 01_schema_reference.md: 테이블 목적, 조인 키, 주요 컬럼
- 02_metric_definitions.md: 지표 정의/계산 기준
- 03_note_codebook.md: 비고/진행사유 라벨 규칙
- 04_query_patterns.md: 질문 유형별 SQL 패턴
- 05_table_column_index.csv: 테이블별 핵심 컬럼 인덱스

운영 규칙
1) 문서 변경 시 파일 내 version/date를 갱신한다.
2) 지표 정의가 바뀌면 02 파일을 먼저 수정한다.
3) 라벨 규칙이 바뀌면 03 파일을 먼저 수정한다.
4) 새 질문 유형이 생기면 04 파일에 패턴을 추가한다.

