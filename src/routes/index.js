import AccessLayout from "../components/layouts/AccessLayout";
import EmptyLayout from "../components/layouts/EmptyLayout";
import MainLayout from "../components/layouts/MainLayout";
import AdminBookManagePage from "../pages/Admin/AdminBookManagePage";
import CreateAndEditBookPage from "../pages/Admin/AdminBookManagePage/CreateAndEditBookPage";
import AdminMainPage from "../pages/Admin/AdminMainPage";
import Book from "../pages/BookPage/Book";
import BookDetailPage from "../pages/BookPage/BookDetail";
import BookSearchPage from "../pages/BookPage/BookSearch";
import TrangChinh from "../pages/GhiChu/TrangChinh";
import TrangGhiChuChiTiet from "../pages/GhiChu/TrangGhiChuChiTiet";
import TrangOnTapChiTiet from "../pages/GhiChu/TrangOnTapChiTiet";
import Home from "../pages/Home";
import Login from "../pages/login";

import CvLayout from "../components/layouts/CvLayout";
import BookTrashPage from "../pages/Admin/AdminBookManagePage/BookTrashPage";
import CreateCategoryPage from "../pages/Admin/AdminBookManagePage/CreateCategoryPage";
import AdminBookOrderPage from "../pages/Admin/AdminBookOrderPage";
import AdminCvManagePage from "../pages/Admin/AdminCvManagePage";
import CvAdminPageDetail from "../pages/Admin/AdminCvManagePage/CvAdminPageDetail";
import MyBookShelf from "../pages/BookPage/MyBookShelf";
import BookCheckout from "../pages/BookPage/BookCheckout";
import TrangChart from "../pages/GhiChu/TrangChart";
import NotFoundPage from "../pages/NotFound";
import StudentInformation from "../pages/Student/StudentInformation";
import CvPage from "../pages/CvPage";
import CvUserDetail from "../pages/CvPage/CvUserDetail";
import AdminLogin from "../pages/Admin/Access/AdminLogin";
import AdminUserManagePage from "../pages/Admin/AdminUserManagePage";
import AdminSignUp from "../pages/Admin/Access/AdminSignUp";
import AdminNoteManagePage from "../pages/Admin/AdminNoteManagePage";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/cv/manage",
    component: CvPage,
    layout: MainLayout,
    isAuth: true,
  },
  {
    path: "/cv/manage/:id",
    component: CvUserDetail,
    layout: CvLayout,
    isAuth: true,
  },

  //==============================ADMIN==============================
  {
    path: "/admin",
    component: AdminMainPage, // là các page
    layout: MainLayout, // là các layout
    isAdmin: true,
  },
  {
    path: "/admin/login",
    component: AdminLogin, // là các page
    layout: AccessLayout, // là các layout
  },
  {
    path: "/admin/book-manage",
    component: AdminBookManagePage,
    layout: MainLayout,
    isAdmin: true,
  },
  {
    path: "/admin/book-manage/create-book",
    component: CreateAndEditBookPage,
    layout: MainLayout,
    isAdmin: true,
  },

  {
    path: "/admin/book-manage/trash",
    component: BookTrashPage,
    layout: MainLayout,
    isAdmin: true,
  },

  {
    path: "/admin/book-manage/category",
    component: CreateCategoryPage,
    layout: MainLayout,
    isAdmin: true,
  },

  {
    path: "/admin/order-manage",
    component: AdminBookOrderPage,
    layout: MainLayout,
    isAdmin: true,
  },

  {
    path: "/admin/cv-manage",
    component: AdminCvManagePage,
    layout: MainLayout,
    isAdmin: true,
  },

  {
    path: "/admin/cv-manage/:id",
    component: CvAdminPageDetail,
    layout: CvLayout,
    isAdmin: true,
  },
  {
    path: "/admin/user-manage",
    component: AdminUserManagePage,
    layout: MainLayout,
    isAdmin: true,
  },
  {
    path: "/admin/user/sign-up",
    component: AdminSignUp,
    layout: AccessLayout,
    isAdmin: true,
  },
  {
    path: "/admin/note-manage",
    component: AdminNoteManagePage,
    layout: MainLayout,
    isAdmin: true,
  },
  //===========================LOGIN===========================
  {
    path: "/login",
    component: Login,
    layout: AccessLayout,
  },
  //===========================BOOK===========================
  {
    path: "/book",
    component: Book,
    layout: MainLayout,
  },
  {
    path: "/book/search",
    component: BookSearchPage,
    layout: MainLayout,
  },
  {
    path: "/book/:bookId",
    component: BookDetailPage,
    layout: MainLayout,
  },
  {
    path: "/book/my-bookshelf",
    component: MyBookShelf,
    layout: MainLayout,
    isAuth: true,
  },

  //==============================Checkout==============================
  {
    path: "/checkout/:userId",
    component: BookCheckout,
    layout: MainLayout,
    isAuth: true,
  },

  //===========================GHI CHU===========================
  {
    path: "/ghi-chu",
    component: TrangChinh, // là các page
    layout: MainLayout, //
    isAuth: true,
  },
  {
    path: "/chi-tiet-ghi-chu",
    component: TrangGhiChuChiTiet, // là các page
    layout: MainLayout, //
    // isAuth: true,
  },
  {
    path: "/on-tap-chi-tiet",
    component: TrangOnTapChiTiet,
    layout: MainLayout,
    // isAuth: true,
  },
  {
    path: "/trang-chart",
    component: TrangChart,
    layout: MainLayout,
    // isAuth: true,
  },

  //==================TRANG CHINH===================
  {
    path: "/trang-chinh",
    component: TrangChinh,
    layout: EmptyLayout,
  },

  //===========================Student Information===========================
  {
    path: "/student/information",
    component: StudentInformation,
    layout: MainLayout,
  },
  //========================404========================
  {
    path: "*",
    component: NotFoundPage,
    layout: EmptyLayout,
    isNotFound: true,
  },
];
export { routes };
