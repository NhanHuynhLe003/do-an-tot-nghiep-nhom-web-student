import "../src/styles/app.css";
<<<<<<< HEAD
import "./styles/swiper-slider.css";
import "./styles/blocknote-ghi-chu-chi-tiet.css"
=======
>>>>>>> 1762c0b039834e9ba9ccea6d5b53b5554661bc3b
import EmptyLayout from "./components/layouts/EmptyLayout";
import { routes } from "./routes";
import "./styles/swiper-slider.css";

import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import MobileMainLayout from "./components/layouts/MobileMainLayout";
import { useWindowSize } from "./hooks";
//CSS ANIMATE
import "animate.css";
import { BREAK_POINTS } from "./constants";
import { useEffect, useState } from "react";

function App() {
  const { width, height } = useWindowSize();
  const [routesConvert, setRoutes] = useState({
    nonAuthRoutes: [],
    authRoutes: [],
    adminRoutes: [],
  });

  const ProtectedRoute = () => {
    const userAuth = JSON.parse(localStorage.getItem("studentData"));

    //Nếu chưa đăng nhập thì chuyển hướng về trang login, replace = true để không cho back lại trang trước đó
    if (!userAuth) return <Navigate to="/login" replace={true}></Navigate>;

    //Nếu đã đăng nhập thì cho phép truy cập các Route con bên trong
    return <Outlet></Outlet>;
  };

  const AdminRoute = () => {
    const userAuth = JSON.parse(localStorage.getItem("studentData"));

    //Nếu chưa đăng nhập thì chuyển hướng về trang login, replace = true để không cho back lại trang trước đó
    if (!userAuth) return <Navigate to="/login" replace={true}></Navigate>;

    //Nếu đã đăng nhập thì cho phép truy cập các Route con bên trong
    return <Outlet></Outlet>;
  };

  useEffect(() => {
    if (routes) {
      routes.forEach((route, index) => {
        if (route.isAuth) {
          setRoutes((prev) => ({
            ...prev,
            authRoutes: [...prev.authRoutes, route],
          }));
        } else if (route.isAdmin) {
          setRoutes((prev) => ({
            ...prev,
            adminRoutes: [...prev.adminRoutes, route],
          }));
        } else {
          setRoutes((prev) => ({
            ...prev,
            nonAuthRoutes: [...prev.nonAuthRoutes, route],
          }));
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <Router>
        {/* Trong tương lai còn phải check xem đã auth chưa và trang nào cần bảo vệ */}
        <Routes>
          {routesConvert.nonAuthRoutes &&
            routesConvert.nonAuthRoutes.length > 0 &&
            routesConvert.nonAuthRoutes.map((route, index) => {
              let Layout = route.layout || EmptyLayout;

              //Nếu màn hình nhỏ hơn 960px thì sử dụng layout mobile
              if (width < BREAK_POINTS.md) {
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
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            {routesConvert.authRoutes &&
              routesConvert.authRoutes.length > 0 &&
              routesConvert.authRoutes.map((route, index) => {
                let Layout = route.layout || EmptyLayout;

                //Nếu màn hình nhỏ hơn 960px thì sử dụng layout mobile
                if (width < BREAK_POINTS.md) {
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
          </Route>

          <Route element={<AdminRoute></AdminRoute>}>
            {routesConvert.adminRoutes &&
              routesConvert.adminRoutes.length > 0 &&
              routesConvert.adminRoutes.map((route, index) => {
                let Layout = route.layout || EmptyLayout;

                //Nếu màn hình nhỏ hơn 960px thì sử dụng layout mobile
                if (width < BREAK_POINTS.md) {
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
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
