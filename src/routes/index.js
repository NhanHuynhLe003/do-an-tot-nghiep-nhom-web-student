import AccessLayout from "../components/layouts/AccessLayout";
import EmptyLayout from "../components/layouts/EmptyLayout";
import MainLayout from "../components/layouts/MainLayout";
import AdminBookManagePage from "../pages/Admin/AdminBookManagePage";
import CreateAndEditBookPage from "../pages/Admin/AdminBookManagePage/CreateAndEditBookPage";
import AdminMainPage from "../pages/Admin/AdminMainPage";
import Book from "../pages/BookPage/Book";
import BookDetailPage from "../pages/BookPage/BookDetail";
import BookSearchPage from "../pages/BookPage/BookSearch";
import Home from "../pages/Home";
import Login from "../pages/login";

import CvLayout from "../components/layouts/CvLayout";
import AdminLogin from "../pages/Admin/Access/AdminLogin";
import AdminMultiSignUp from "../pages/Admin/Access/AdminMultiSignUp";
import AdminSignUp from "../pages/Admin/Access/AdminSignUp";
import BookTrashPage from "../pages/Admin/AdminBookManagePage/BookTrashPage";
import CreateCategoryPage from "../pages/Admin/AdminBookManagePage/CreateCategoryPage";
import AdminBookOrderPage from "../pages/Admin/AdminBookOrderPage";
import AdminCvManagePage from "../pages/Admin/AdminCvManagePage";
import CvAdminPageDetail from "../pages/Admin/AdminCvManagePage/CvAdminPageDetail";
import AdminUserManagePage from "../pages/Admin/AdminUserManagePage";
import BookCheckout from "../pages/BookPage/BookCheckout";
import MyBookShelf from "../pages/BookPage/MyBookShelf";
import CvPage from "../pages/CvPage";
import CvUserDetail from "../pages/CvPage/CvUserDetail";
import NotFoundPage from "../pages/NotFound";
import StudentInformation from "../pages/Student/StudentInformation";

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
    path: "/admin/book-manage/create-book/:id",
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
    path: "/admin/multi-sign-up",
    component: AdminMultiSignUp,
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
