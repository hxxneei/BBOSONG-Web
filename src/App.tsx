import styled from "styled-components";
import GlobalStyle from "./styles/GlobalStyles";
// import MyPage from "./pages/MyPage";
import FabricScanner from "./pages/FabricScanner";

function App() {
  return (
    <>
      <GlobalStyle />
      {/* <MyPage /> */}
      <FabricScanner />
    </>
  );
}

export default App;
