import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  /* 기본 리셋 */
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  html, body { margin: 0; padding: 0; }
  img, video { max-width: 100%; height: auto; display: block; } /* 인라인 갭 방지 */

  /* 토큰 */
  :root {
    --bg: #F3F5F7;
    --surface: #FFFFFF;
    --border: rgba(15, 23, 42, .06);
    --shadow: 0 1px 2px rgba(0,0,0,.04);

    --text-primary: #111827;
    --text-secondary: #6B7280;

    --radius-lg: 16px;
    --radius-md: 10px;

    --space-page-x: 16px;

    --z-sticky-top: 50;
    --z-content: 0;
    --z-bottom-bar: 60;

    --vh: 1vh;
  }

  body,
  button,
  input,
  textarea {
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, 'Helvetica Neue', Arial, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  }

  /* 바디: 모바일처럼 보이게 폭 제한 + 가운데 정렬 */
  body {
    min-width: 320px;
    max-width: 430px;
    margin-inline: auto;

    background: var(--bg);
    color: var(--text-primary);

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    overflow-x: hidden;
    line-height: 1.5;
    overscroll-behavior: none;
  }

  a { color: inherit; text-decoration: none; }
  button { border: 0; background: transparent; padding: 0; cursor: pointer; }
  * { -webkit-tap-highlight-color: transparent; }

  /* 안전영역 유틸 */
  .safe-top    { padding-top: env(safe-area-inset-top); }
  .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }

  /* 앱 셸 레이아웃 유틸 */
  .app {
    min-height: 100dvh;
    min-height: calc(var(--vh) * 100);

    display: flex;
    flex-direction: column;
    position: relative;
  }

  .app-content {
    flex: 1;
    position: relative;
    z-index: var(--z-content);
  }

  /* 상단 고정 바 (예: 필터 영역) */
  .sticky-top {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky-top);
    background: var(--bg);
  }

  /* 하단 네비 영역이 가리지 않게 빈공간 확보 */
  .bottom-gap {
    height: calc(76px + max(env(safe-area-inset-bottom), 0px));
  }

  /* 재사용 가능한 카드 표면 */
  .card-surface {
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    border-radius: var(--radius-lg);
  }
`

export default GlobalStyle
