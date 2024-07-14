import "../src/styles/app.css";

import "./styles/swiper-slider.css";
import "./styles/blocknote-ghi-chu-chi-tiet.css"
import "./styles/swiper-slider.css";
import "./styles/blocknote-ghi-chu-chi-tiet.css";

import EmptyLayout from "./components/layouts/EmptyLayout";
import { routes } from "./routes";
import "./styles/blocknote-ghi-chu-chi-tiet.css";
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
import { useEffect, useRef, useState } from "react";
import { BREAK_POINTS } from "./constants";
import { useCreateEmptyCart } from "./hooks/apis/cart";
import { toast } from "react-toastify";

const ADMINROLE = process.env.REACT_APP_ADMIN_ROLE;
function App() {
  const dataStudent = JSON.parse(localStorage.getItem("studentData"));

  const { width, height } = useWindowSize();
  const [routesConvert, setRoutes] = useState({
    nonAuthRoutes: [],
    authRoutes: [],
    adminRoutes: [],
  });

  // Trigger API tạo giỏ hàng khi vừa vào tránh user vừa vào không có giỏ hàng sẽ báo lỗi
  const {
    mutate: createEmptyCart,
    data: dataCreateEmptyCartData,
    isLoading: isCreateEmptyCartLoading,
    error: CreateEmptyCartError,
  } = useCreateEmptyCart();

  useEffect(() => {
    //Khoi tao gio hang khi chưa có, tránh trường hợp user vào trang web mà không có giỏ hàng => lỗi
    dataStudent &&
      dataStudent._id &&
      createEmptyCart({ userId: dataStudent?._id });
  }, []);

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

    if (!userAuth?.roles?.includes(ADMINROLE)) {
      toast.error("Admin mới được phép truy cập trang này", {
        position: "top-center",
        autoClose: 1500,
      });

      return <Navigate to="/admin/login" replace={true}></Navigate>;
    }

    //Nếu đã đăng nhập thì cho phép truy cập các Route con bên trong
    return <Outlet></Outlet>;
  };

  useEffect(() => {
    if (routes) {
      const routesAuth = [];
      const routesAdmin = [];
      const routesNonAuth = [];
      routes.forEach((route, index) => {
        if (route.isAuth) {
          routesAuth.push(route);
        } else if (route.isAdmin) {
          routesAdmin.push(route);
        } else {
          !route.isNotFound && routesNonAuth.push(route);
        }
      });

      routesNonAuth.push(routes[routes.length - 1]);

      setRoutes({
        nonAuthRoutes: routesNonAuth,
        authRoutes: routesAuth,
        adminRoutes: routesAdmin,
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
