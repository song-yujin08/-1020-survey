# 1020 Survey — Vercel 배포용

이 폴더는 Vercel에 그대로 업로드해서 정적 사이트로 배포할 수 있습니다.

## 가장 쉬운 배포 방법
1. https://vercel.com 에 로그인
2. Add New → Project
3. 이 폴더 전체를 GitHub 저장소에 올린 뒤 Import
4. Framework Preset은 `Other`
5. Build Command 비워두기
6. Output Directory 비워두기
7. Deploy

## GitHub 없이 배포
Vercel CLI 사용:
```bash
npm i -g vercel
cd 1020_survey_vercel
vercel
```

처음 배포 시 질문:
- Set up and deploy? → Y
- Which scope? → 본인 계정 선택
- Link to existing project? → N
- Project name → 원하는 이름
- In which directory is your code located? → ./
- Want to modify settings? → N

그 다음:
```bash
vercel --prod
```

완료되면 `https://프로젝트이름.vercel.app` 형태의 링크가 생성됩니다.

## 모바일
기존 코드가 반응형으로 구성되어 있어 iPhone/Android 브라우저에서 바로 사용 가능합니다.

## 현재 데이터 저장 방식
현재 응답 데이터는 브라우저 localStorage에 저장되며, 제출 후 JSON/CSV 다운로드가 가능합니다.
여러 사람의 응답을 중앙 수집하려면 Google Sheets / Supabase / Firebase 등을 추가 연결해야 합니다.
