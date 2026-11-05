# 🚀 2026학년도 책만세 최종 보고서: 하늘에서 우주로 (Sky to Cosmos)

> 항공과 천문 분야의 도서를 바탕으로 한 1학년 융합 독서 탐구 보고서 반응형 웹 프로젝트

![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-blue)
![Three.js](https://img.shields.io/badge/WebGL-Three.js%20r128-black)
![Anime.js](https://img.shields.io/badge/Animation-Anime.js%203.2-orange)
![Express](https://img.shields.io/badge/Backend-Node%20Express-green)

---

## 📖 프로젝트 개요
- **주제**: 하늘을 나는 지혜(항공), 우주를 읽는 시선(천문)
- **탐구 도서**:
  - ✈️ **항공**: 《조종사가 들려주는 비행이야기》 (노명환 저 / 북랩)
  - 🔭 **천문**: 《천문학자는 별을 보지 않는다》 (심채경 저 / 문학동네)
- **모둠원**: 10507 박지오, 10711 이시우, 10712 이시헌
- **지도교사**: 이광민 선생님

---

## ✨ 주요 기능
- **Three.js WebGL 3D 엔진 (CDN)**: 3,500+ 별무리, 은하 성운 와류, 초음속 제트 기류, 홀로그램 지구 3D 뷰어
- **Anime.js 시네마틱 모션 & 3D 틸트 (CDN)**: HUD 텔레메트리 오프닝, 마그네틱 카드 틸트 물리 효과
- **실시간 찬반 투표 시뮬레이션**: 1·2·3회차 및 융합 심층 토론 인터랙티브 투표
- **항성 분광형(O-B-A-F-G-K-M) 탐색기**: 표면 온도와 색깔에 따른 항성 진화 시각화
- **Web Audio API 절차적 앰비언트 사운드**: 무음원 실시간 사운드 신시사이저
- **GitHub Pages & Cloudflare Pages 100% 호환**: 번들러 없이 브라우저에서 즉시 실행

---

## 💻 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행 (Nodemon 감시 모드)
npm run dev

# 3. 브라우저에서 접속
# http://localhost (또는 http://localhost:80)
```

---

## 🌐 GitHub Pages 배포 설정
1. GitHub에 새 Repository를 생성하고 본 코드를 push합니다.
2. 저장소의 **Settings → Pages** 메뉴로 이동합니다.
3. **Build and deployment** 항목에서:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)` 선택 후 **Save**
4. 1~2분 후 생성되는 URL(예: `https://<username>.github.io/<repo-name>/`)로 접속하면 배포 완료!
