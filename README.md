# 1020 Survey — Final Polished Version

최종 배포 전 UI/타이포를 정리한 버전입니다.

## Typography system
- Display headline: SUIT Semibold 600
- Question labels / body / input / buttons: SUIT
- Green micro labels: Helvetica, letter-spacing -2%
- Fallback: Pretendard → system sans

## Mobile improvements
- Hero title uses controlled two-line structure
- Smaller mobile headline scale and tighter max-width
- Balanced section-title wrapping
- iOS input zoom prevention (16px minimum)
- Larger touch targets for checkbox/radio options
- Safe-area padding for sticky bottom actions
- Extra-narrow layout tuning under 380px

## UI QA refinements
- Focus-visible states added
- Input hover/focus contrast refined
- Sticky footer shadow reduced
- Reflection cards softened
- Tap targets increased
- Sidebar active state strengthened
- Input caret uses green accent
- Text rendering smoothing added

## Recommended final QA before public sharing
1. iPhone Safari
2. Android Chrome
3. Desktop Chrome/Safari
4. Check 320–390px widths
5. Test text overflow with long answers
6. Test file upload
7. Test refresh → draft restore
8. Test final submission + CSV/JSON download
