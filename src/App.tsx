import GlobalStyle from "./styles/GlobalStyles";
import MyPage from "./pages/MyPage";
// import FabricScanner from "./pages/FabricScanner";
//import Loading from "./pages/Loading";
//import ResultPage from "./pages/ResultPage";
// import ClosetPage from "./pages/ClosetPage";
//import CategoryPage from "./pages/CategoryPage";
// import ClosetDetailPage from "./pages/ClosetDetailPage";
// import DeleteModal from "./pages/DeleteModal";
import BottomNav from "./common/BottomNav";
import AppLayout from "./common/AppLayout";

// function App() {
//   return (
//     <>
//       <GlobalStyle />

//       <MyPage />
//       <BottomNav />
//       {/* <FabricScanner /> */}
//       {/* <Loading /> */}
//       {/* <ResultPage /> */}
//       {/* <ClosetPage /> */}
//       {/* <CategoryPage /> */}
//       {/* <ClosetDetailPage /> */}
//       {/* <DeleteModal /> */}
//     </>
//   );
// }

function App() {
  return (
    <>
      <GlobalStyle />
      <AppLayout>
        <MyPage />
      </AppLayout>
      <BottomNav />
    </>
  );
}

export default App;
