import { Box } from "@mui/material";
import React, { useState } from "react";
import style from "./CircleNav.module.css";
import { AddCircle } from "@mui/icons-material";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { RiBarChartFill } from "react-icons/ri";
import { PiNotePencilBold } from "react-icons/pi";
import cvIcon from "../../assets/icons/cv-icon.png";
import Lottie from "react-lottie";
import animationBookShelf from "../../assets/animations/animation-bookshelf.json";
import animationUserLogin from "../../assets/animations/animation-user-login-jump.json";
import animationBarChart from "../../assets/animations/animation-bar-chart.json";
import animationNotePen from "../../assets/animations/animation-note-pen.json";
import animationCvTemplate from "../../assets/animations/animation-cv-template.json";
import PageLoader from "../pageLoader";

export default function CircleNav({ isOpenToggle = false }) {
  //Dieu huong
  const navigate = useNavigate();

  //=====================PAGE LOADING
  const [loaderActive, setLoaderActive] = useState(false);

  // Xử lý hiển thị loader
  const toggleLoader = (pageUrl = "/") => {
    setLoaderActive(true);
    setTimeout(() => {
      setLoaderActive(false); //Loading sau 5s tắt
      navigate(pageUrl);
    }, 3000);
  };

  //==================Lottie: Hiển thị ảnh dạng animation json
  const lottieJsonOptions = (imgFile = animationUserLogin) => ({
    loop: true,
    autoplay: true,
    animationData: imgFile,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });

  //==================Button: xử lý nhấn nút và hover
  const [btnSelected, setBtnSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(isOpenToggle);
  const handleClickToggleButton = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectNode = (index) => {
    setBtnSelected(index);
  };

  return (
    <div className={style.containerNav}>
      <PageLoader active={loaderActive} />
      <ul className={clsx(style.menu, { [style.active]: isOpen })}>
        {/* <div className={clsx(style.circleOverlay)}></div> */}
        <button
          className={clsx(style.toggle, { [style.active]: isOpen })}
          onClick={handleClickToggleButton}
        >
          <AddCircle></AddCircle>
        </button>
        <li
          onMouseOver={() => handleSelectNode(0)}
          style={{ "--i": 0 }}
          className={clsx({ [style.activeBtn]: btnSelected === 0 })}
        >
          <Link to={"#"} onClick={() => toggleLoader("/login")}>
            {btnSelected === 0 ? (
              <Lottie
                title="Trang đăng nhập"
                options={lottieJsonOptions(animationUserLogin)}
                height={70}
                width={70}
              />
            ) : (
              <FaUser></FaUser>
            )}
          </Link>
        </li>
        <li
          onMouseOver={() => handleSelectNode(1)}
          style={{ "--i": 1 }}
          className={clsx({ [style.activeBtn]: btnSelected === 1 })}
        >
          <Link to={"#"} onClick={() => toggleLoader("/book")}>
            {btnSelected === 1 ? (
              <Lottie
                options={lottieJsonOptions(animationBookShelf)}
                title="Trang thư viện sách"
                height={100}
                width={100}
              />
            ) : (
              <GiBookshelf fontSize={"3.75em"}></GiBookshelf>
            )}
          </Link>
        </li>
        <li
          onMouseOver={() => handleSelectNode(2)}
          style={{ "--i": 2 }}
          className={clsx({ [style.activeBtn]: btnSelected === 2 })}
        >
          <Link to={"#"} onClick={() => toggleLoader("/xep-hang")}>
            {btnSelected === 2 ? (
              <Lottie
                options={lottieJsonOptions(animationBarChart)}
                height={80}
                width={80}
                title="Trang bảng xếp hạng"
              />
            ) : (
              <RiBarChartFill></RiBarChartFill>
            )}
          </Link>
        </li>
        <li
          onMouseOver={() => handleSelectNode(3)}
          style={{ "--i": 3 }}
          className={clsx({ [style.activeBtn]: btnSelected === 3 })}
        >
          <Link to={"#"} onClick={() => toggleLoader("/ghi-chu")}>
            {btnSelected === 3 ? (
              <Lottie
                options={lottieJsonOptions(animationNotePen)}
                height={90}
                width={90}
                title="Trang ghi chú ôn tập"
              />
            ) : (
              <PiNotePencilBold></PiNotePencilBold>
            )}
          </Link>
        </li>
        <li
          onMouseOver={() => handleSelectNode(4)}
          style={{ "--i": 4 }}
          className={clsx({ [style.activeBtn]: btnSelected === 4 })}
        >
          <Link to={"#"} onClick={() => toggleLoader("/cv")}>
            {btnSelected === 4 ? (
              <Lottie
                options={lottieJsonOptions(animationCvTemplate)}
                height={70}
                width={70}
                title="Trang viết CV"
              />
            ) : (
              <img width={70} height={70} alt="cv-icon" src={cvIcon}></img>
            )}
          </Link>
        </li>
        <div className={style.indicator}></div>
        <div
          className={clsx(style.overlayCircle, {
            [style.activeOverlay]: isOpen,
          })}
        ></div>
      </ul>
    </div>
  );
}
