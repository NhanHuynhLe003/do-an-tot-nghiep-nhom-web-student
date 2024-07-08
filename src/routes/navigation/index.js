import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import BookShelfIcon from "../../components/icons/BookShelfIcon";
import { FaBookOpenReader } from "react-icons/fa6";
import { GrUserAdmin } from "react-icons/gr";
const navList = [
  {
    id: 1,
    name: "Trang Chủ",
    path: "/",
    icon: <HomeIcon></HomeIcon>,
  },
  {
    id: 2,
    name: "Tủ Sách",
    path: "/book",
    icon: <BookShelfIcon></BookShelfIcon>,
  },
  {
    id: 3,
    name: "Tìm Kiếm",
    path: "/book/search",
    icon: <SearchIcon></SearchIcon>,
  },
  {
    id: 4,
    name: "Tủ Sách Của Tôi",
    path: "/book/my-bookshelf",
    icon: <FaBookOpenReader></FaBookOpenReader>,
    isLogin: true,
  },
  {
    id: 5,
    name: "Quản Trị",
    path: "/admin",
    icon: <GrUserAdmin></GrUserAdmin>,
    isLogin: true,
    isAdmin: true,
  },
];

export { navList };
