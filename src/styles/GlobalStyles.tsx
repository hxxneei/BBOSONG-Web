import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* 기본 리셋 */
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  html, body { margin: 0; padding: 0; }
  img, video { max-width: 100%; height: auto; display: block; } /* 인라인 갭 방지 */

  /* 레이어 토큰 (z-index 통일) */
  :root {
    --bg: #FFFFFF;            /* 전체 배경 */
    --surface: #FFFFFF;       /* 카드/바탕 */
    --border: rgba(15, 23, 42, .06); /* 아주 얕은 선 */
    --shadow: 0 1px 2px rgba(0,0,0,.04); /* 약한 그림자 */
    --z-sticky-top: 50;      /* 상단 고정 바(필터) */
    --z-content: 0;
    --z-bottom-bar: 60;      /* 하단 네비바 */
    --bottom-nav-height: 80px;
    --bottom-nav-fab-size: 71px;
    --vh: 1vh;               /* iOS 폴백용 사용자 정의 vh  <-- 근데 꼭 필연적인걸까? */
  }

  /* 바디: 모바일처럼 보이게 폭 제한 + 가운데 정렬 */
  body {
    min-width: 320px;
    max-width: 430px;
    margin-inline: auto;

    background: var(--bg); 
    color: #111827;

    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Helvetica Neue', Arial, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    overflow-x: hidden;
  }

  a { color: inherit; text-decoration: none; }
  button { border: 0; background: transparent; padding: 0; cursor: pointer; }
  * { -webkit-tap-highlight-color: transparent; }

  /* 안전영역 유틸 */
  .safe-top    { padding-top: env(safe-area-inset-top); }
  .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }

  /* 앱 셸 레이아웃 유틸 (원하는 페이지에서 그대로 사용) */
  .app {
    /* 구형 브라우저 폴백 뒤에 동적 뷰포트 높이를 선언 */
    min-height: 100vh;
    min-height: 100dvh;

    display: flex;
    flex-direction: column;
    position: relative;
  }

  .app-content {
    flex: 1;
    position: relative;
    z-index: var(--z-content);
  }

  /* 상단 고정 바(필터 영역 등)에 쓰는 클래스 */
  .sticky-top {
    position: sticky;
    top: 0; /* safe-top은 필요 시 부모에 */
    z-index: var(--z-sticky-top);
    background: #f3f5f7; /* 뒤 스크롤시 비쳐보이지 않게 배경 지정 */
  }

  /* 하단 네비 영역 바닥 여백 (콘텐츠가 바에 가리는 것 방지) */
  .bottom-gap {
    height: calc(
      var(--bottom-nav-height) + 12px + env(safe-area-inset-bottom, 0px)
    );
  }
`;

export default GlobalStyle;
