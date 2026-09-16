# Google Sheets 자동 수집 연결

응답 수집용 Google Sheet는 이미 생성되어 있습니다.

Sheet:
https://docs.google.com/spreadsheets/d/12LDbvDu2y-5K-WJ05gnq9XZZ-vXdiTgjigImTz9BczM/edit

## 1. Apps Script 만들기
1. 위 Google Sheet를 엽니다.
2. 상단 메뉴에서 `확장 프로그램 → Apps Script`를 선택합니다.
3. 기본 `Code.gs` 내용을 전부 지웁니다.
4. 이 ZIP 안의 `Code.gs` 내용을 복사해 붙여넣습니다.
5. 저장합니다.

## 2. Web App으로 배포
1. Apps Script 오른쪽 위 `배포 → 새 배포`
2. 유형 선택에서 `웹 앱`
3. 실행 사용자: `나`
4. 액세스 권한: `모든 사용자`
5. `배포`
6. 권한 승인
7. 생성된 Web App URL 중 `/exec`로 끝나는 URL을 복사

## 3. 웹사이트에 URL 넣기
`script.js` 파일에서 다음 줄을 찾습니다.

const GOOGLE_APPS_SCRIPT_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

따옴표 안을 복사한 `/exec` URL로 교체합니다.

예:
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/ABC123.../exec";

## 4. GitHub / Vercel 업데이트
수정된 파일들을 GitHub 저장소에 업로드하고 Commit합니다.
Vercel이 연결되어 있으면 자동으로 재배포됩니다.

## 5. 테스트
설문 하나를 직접 제출한 뒤 Google Sheet의 `응답` 탭 2행부터 데이터가 추가되는지 확인합니다.

## 참고
현재 파일 첨부 질문은 실제 파일 자체를 Google Drive에 업로드하지 않고,
파일명/형식/크기 메타데이터만 Sheet에 저장합니다.
실제 이미지 파일 업로드까지 필요하면 별도 Drive 업로드 기능을 추가해야 합니다.
