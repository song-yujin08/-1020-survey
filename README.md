# 1020 Survey — SUIT Webfont Connected

SUIT 공식 저장소에서 안내하는 jsDelivr 웹폰트 CSS를 연결한 버전입니다.

## 연결 방식
```html
<link
  href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/static/woff2/SUIT.css"
  rel="stylesheet">
```

## 적용
- 대형 헤드라인: SUIT Semibold (600)
- 초록색 소형 마이크로 타이포: 기존 Helvetica / -2% 자간 유지
- SUIT 로드 실패 시 Pretendard → 시스템 폰트 순서로 fallback

## 배포
기존 GitHub 저장소에서 이 버전의 파일들로 교체 후 Commit하면,
Vercel 연결 상태에서는 자동 재배포됩니다.
