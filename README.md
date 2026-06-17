# 캐리마텍 레진 물성 가이드

영업2팀에서 고객에게 공유하는 **캐리마텍 3D 프린팅 레진 물성 비교 자료**입니다.
HTML 한 묶음으로 동작하며, GitHub Pages 링크로 공유합니다.

🔗 **배포 주소:** https://carimatec-bsm.github.io/Carimatec-Resin-Guide/

---

## 1. 파일 구조

```
index.html        ← 고객이 보는 화면 (로고는 파일 안에 내장됨)
admin.html        ← 관리자 전용 데이터 편집기 (고객용 아님)
assets/
  ├─ data.js      ← ★ 레진 물성 데이터 (수정은 여기서)
  ├─ app.js       ← 화면 동작 로직 (건드릴 필요 없음)
  ├─ styles.css   ← 디자인 (건드릴 필요 없음)
  ├─ og-image.png ← 카톡/이메일 링크 미리보기 이미지
  └─ logo.png     ← 로고 원본 (보관용)
README.md         ← 이 문서
.gitignore        ← 업로드 제외 목록
```

> 외부 라이브러리(Tailwind, Chart.js, 폰트)는 인터넷(CDN)에서 불러옵니다.
> 즉 **보는 사람은 인터넷 연결이 필요**합니다 (링크로 여는 방식이라 정상).

---

## 2. 데이터 수정 방법

### ✅ 권장: 관리자 편집기(admin.html) 사용

코드 문법을 몰라도 안전하게 수정할 수 있습니다.

> 🔑 admin.html 진입 시 **관리자 비밀번호**가 필요합니다. (비밀번호는 담당자가 별도 보관)

1. `admin.html`을 브라우저로 엽니다.
   - 온라인: https://carimatec-bsm.github.io/Carimatec-Resin-Guide/admin.html
   - 또는 내 PC의 `admin.html` 더블클릭
2. 비밀번호 입력 → 잠금 해제
2. 수치·설명을 고치거나, 소재를 **추가/삭제**합니다.
3. 아래쪽 **`⬇️ data.js 내려받기`** 버튼을 누릅니다 → 새 `data.js` 파일이 다운로드됩니다.
4. GitHub 저장소의 `assets/data.js`를 **방금 받은 파일로 교체**합니다 (아래 3번 참고).

> ⚠️ admin.html에서 수정만 하면 **고객 화면에 반영되지 않습니다.**
> 반드시 `data.js`를 내려받아 GitHub에 올려야 적용됩니다.

### (참고) data.js 직접 편집
`assets/data.js`의 숫자/문구를 직접 고쳐도 됩니다. 단, **쉼표·따옴표·중괄호**를 하나라도 빠뜨리면 화면이 깨지므로, 가급적 admin.html을 쓰세요.

---

## 3. GitHub에 올리는 방법

GitHub 저장소 → **`Add file` → `Upload files`** 에서 파일을 끌어다 놓고 `Commit` 합니다.

### 올려야 하는 것
- ✅ `index.html`
- ✅ `admin.html`
- ✅ `assets/` 폴더 전체 (`data.js`, `app.js`, `styles.css`, `og-image.png`, `logo.png`)
- ✅ `README.md` (선택)

### 올리지 않아도 되는 것
- ❌ `.claude/` 폴더 — 로컬 작업용 (웹사이트와 무관)

> 데이터만 바꿨다면 `assets/data.js` **한 파일만** 다시 올리면 됩니다.

---

## 4. 주요 기능 (사용법)

- **카테고리 탭** — Engineering / Functional / General 전환
- **소재 클릭** — 상세 특징·추천 용도 표시
- **소재 2개 클릭** — 두 소재를 **나란히 비교** (차트·표 동시 강조)
- **검색창** — 소재 이름·특징·용도로 검색 (예: "힌지", "내열")

---

## 5. 링크 미리보기(카카오톡·이메일)

링크를 공유하면 **로고·제목·설명 미리보기 카드**가 표시됩니다.

- 관련 설정은 `index.html` 상단 `<meta property="og:...">` 부분에 있습니다.
- **배포 주소가 바뀌면** 그 부분의 3줄(og:url, og:image, twitter:image) 주소를 새 주소로 수정하세요.
- 카카오톡은 미리보기를 저장(캐시)하므로, 바꿔도 바로 안 보이면
  👉 **카카오 OG 디버거**에서 주소를 넣고 초기화: https://developers.kakao.com/tool/clear/og

---

## 6. 자주 묻는 질문 (문제 해결)

**Q. 화면이 안 뜨거나 깨져요.**
- `assets/` 폴더가 같이 올라갔는지 확인하세요 (`data.js`/`app.js`/`styles.css` 필수).
- `data.js`를 직접 편집했다면 쉼표/따옴표 오류일 수 있습니다 → admin.html로 다시 만들어 교체.

**Q. 데이터를 바꿨는데 고객 화면이 그대로예요.**
- GitHub 업로드까지 마쳤는지 확인 (admin.html 편집만으로는 반영 안 됨).
- 브라우저 캐시일 수 있으니 새로고침(Ctrl+F5).

**Q. 카톡 미리보기 이미지가 안 떠요.**
- `assets/og-image.png`가 저장소에 올라가 있는지 확인.
- 위 5번의 카카오 OG 디버거로 초기화.

**Q. admin.html은 아무나 볼 수 있나요?**
- 캐리마텍 관리자 접근 가능(비밀번호 영업팀 문의). 외부에 admin 주소를 공유하지 마세요.

---

*문의: 캐리마텍 영업2팀 sales@carima.co.kr*
