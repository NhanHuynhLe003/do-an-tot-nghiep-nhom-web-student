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

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/admin",
    component: AdminMainPage, // là các page
    layout: MainLayout, // là các layout
  },
  {
    path: "/admin/book-manage",
    component: AdminBookManagePage,
    layout: MainLayout,
  },
  {
    path: "/login",
    component: Login,
    layout: AccessLayout,
  },
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
    path: "/ghi-chu",
    component: TrangChinh, // là các page
    layout: MainLayout, //
  },
];
export { routes };
