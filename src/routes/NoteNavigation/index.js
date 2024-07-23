import { FaNoteSticky } from "react-icons/fa6";
import { FaBrain } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import HomeIcon from "@mui/icons-material/Home";
const NoteNavigate = [
  {
    id: "000",
    name: "Trang Chủ",
    path: "/",
    icon: <HomeIcon></HomeIcon>,
  },
  {
    id: 1,
    name: "Ghi Chú",
    path: "/ghi-chu",
    icon: <FaNoteSticky></FaNoteSticky>,
  },
  {
    id: 2,
    name: "Tạo Ghi Chú",
    path: "/chi-tiet-ghi-chu",
    icon: <FaEdit></FaEdit>,
  },
  {
    id: 3,
    name: "Ôn Tập",
    path: "/on-tap-chi-tiet",
    icon: <FaBrain></FaBrain>,
  },
];

export { NoteNavigate };
