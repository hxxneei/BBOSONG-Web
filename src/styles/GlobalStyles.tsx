import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* 기본 리셋 */
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  html, body { margin: 0; padding: 0; }
  img, video { max-width: 100%; height: auto; display: block; } /* 인라인 갭 방지 */

  :root {
    --z-bottom-bar: 60;
    --bottom-nav-height: 80px;
    --bottom-nav-fab-size: 71px;
  }

  /* 바디: 모바일처럼 보이게 폭 제한 + 가운데 정렬 */
  body {
    min-width: 320px;
    max-width: 430px;
    margin-inline: auto;

    background: #ffffff;
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

`;

export default GlobalStyle;
