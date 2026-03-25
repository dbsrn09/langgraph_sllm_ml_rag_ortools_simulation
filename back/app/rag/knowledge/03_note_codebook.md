# Note Codebook

version: 1.0
updated_at: 2026-03-23
source: data/raw/docs/codebook_notes.md

## STOCK_OUT
- 의미: 재고 부족/무재고로 인한 공급 지연/불가
- 패턴:
  - 재고 無
  - 재고 무
  - 재고없음
  - 국내 재고 無
  - 국내재고 무
  - 재고 무/평균
  - 재고무/평균
  - 재고 無, 4-6주

## LONG_LEADTIME
- 의미: 리드타임 장기화로 납기 지연 가능성 증가
- 패턴:
  - 4~6주 소요
  - 4-6주 소요
  - 리드타임 4~6주
  - 리드타임 4-6주
  - 납기:4~6주
  - 납기 : 4~6주
  - 평균3-4주
  - 1-3일 소요
  - 3-5일 소요

## CUSTOMER_CHANGE
- 의미: 고객 요청/변경으로 인한 일정/주문 변경
- 패턴:
  - 고객변심
  - 고객 분께서 그대로 주문 진행요청
  - 고객 요청으로
  - 고객요청에 의해

## DIRECT_SHIP
- 의미: 직납/직배송 관련 운영 포인트
- 패턴:
  - 직납
  - 직배송
  - 직배송요청
  - 직배송 요청
  - 직배송요청건
  - 배송요청

## DISCOUNT
- 의미: 특가/행사/할인 조건 적용
- 패턴:
  - 특가 적용
  - 특가적용
  - 할인률 적용
  - 거래 업체 할인률 적용
  - 이벤트 적용
  - WSP 행사
  - 행사, 추가할인

## QUALITY_ISSUE
- 의미: 품질 이슈 및 불량/리콜
- 패턴:
  - 오류
  - 불량
  - 리콜
  - 품질 문제

## INTERNAL_PROCESS
- 의미: 내부 결재/검토/사유입력 이슈
- 패턴:
  - DRF
  - 진행사유입력여부
  - 진행사유 입력
  - 결재 대기
  - 내부 검토

## SHIPPING_NOTE
- 의미: 포장/택배/운송 메모
- 패턴:
  - 택배
  - 우편물 비고참조
  - 택배(고객주소 성함, 연락처) 기재
  - 포장 유의

## OTHER
- 의미: 상기 규칙에 매칭되지 않는 텍스트

## 우선순위 규칙
1. `QUALITY_ISSUE`
2. `STOCK_OUT`
3. `LONG_LEADTIME`
4. `CUSTOMER_CHANGE`
5. `DIRECT_SHIP`
6. `DISCOUNT`
7. `INTERNAL_PROCESS`
8. `SHIPPING_NOTE`
9. `OTHER`

