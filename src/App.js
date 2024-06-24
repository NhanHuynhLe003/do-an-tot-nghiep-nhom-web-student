import "../src/styles/app.css";
import "./styles/swiper-slider.css";
import EmptyLayout from "./components/layouts/EmptyLayout";
import { routes } from "./routes";

import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { useWindowSize } from "./hooks";
import MobileMainLayout from "./components/layouts/MobileMainLayout";
//CSS ANIMATE
import "animate.css";

function App() {
  const { width, height } = useWindowSize();
  /** Xử lý sách nháp tại đây, nếu kiểm tra thấy trong local storage đg có sách nháp thì update lên
   db sau đó xóa sách nháp trong local storage.
   */

  return (
    <div className="App">
      <Router>
        {/* Trong tương lai còn phải check xem đã auth chưa và trang nào cần bảo vệ */}
        <Routes>
          {routes &&
            routes.map((route, index) => {
              let Layout = route.layout || EmptyLayout;
              if (width < 920) {
                Layout = MobileMainLayout;
              }
              const Page = route.component;
              const pathRoute = route.path;

              return (
                <Route
                  key={pathRoute}
                  path={pathRoute}
                  element={
                    <Layout>
                      <Page></Page>
                    </Layout>
                  }
                ></Route>
              );
            })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
