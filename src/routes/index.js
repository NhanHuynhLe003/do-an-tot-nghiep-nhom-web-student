import AccessLayout from "../components/layouts/AccessLayout";
import EmptyLayout from "../components/layouts/EmptyLayout";
import MainLayout from "../components/layouts/MainLayout";
import AdminMainPage from "../pages/Admin/AdminMainPage";
import AdminBookManagePage from "../pages/Admin/AdminBookManagePage";
import Book from "../pages/BookPage/Book";
import BookDetailPage from "../pages/BookPage/BookDetail";
import BookSearchPage from "../pages/BookPage/BookSearch";
import Home from "../pages/Home";
import Login from "../pages/login";
import TrangChinh from "../pages/GhiChu/TrangChinh";
import TrangGhiChuChiTiet from "../pages/GhiChu/TrangGhiChuChiTiet";
import CreateAndEditBookPage from "../pages/Admin/AdminBookManagePage/CreateAndEditBookPage";
import TrangOnTapChiTiet from "../pages/GhiChu/TrangOnTapChiTiet";
import BookTrashPage from "../pages/Admin/AdminBookManagePage/BookTrashPage";
import CreateCategoryPage from "../pages/Admin/AdminBookManagePage/CreateCategoryPage";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/admin",
    component: AdminMainPage, // là các page
    layout: MainLayout, // là các layout
    isAdmin: true,
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

  //===========================GHI CHU===========================
  {
    path: "/ghi-chu",
    component: TrangChinh, // là các page
    layout: MainLayout, //
  },
  {
    path: "/chi-tiet-ghi-chu",
    component: TrangGhiChuChiTiet, // là các page
    layout: MainLayout, //
  },
  {
    path: "/on-tap-chi-tiet",
    component: TrangOnTapChiTiet,
    layout: MainLayout,
  },
];
export { routes };
