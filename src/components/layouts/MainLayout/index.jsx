import React, { useEffect, useRef, useState } from "react";

import { Box, Stack } from "@mui/material";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import BgImg from "../../../assets/images/main-bg.png";
import { useWindowSizeDepParent } from "../../../hooks";
import theme from "../../../theme";
import HeaderBook from "../../common/header/header-book";
import SideBar from "../../common/sidebar";
import style from "./mainlayout.module.css";

export default function MainLayout({ children, typePage = "" }) {
  const sideBarWidth = useRef(248);

  const refSlideContent = useRef(null);
  const { left, top } = useWindowSizeDepParent(refSlideContent);
  const [widthToolBarDrawer, setWidthToolBarDrawer] = React.useState(0);
  // const [scrollProperty, setScrollProperty] = useState({
  //   scrollTopPage: 0,
  //   scrollHeightPage: 0,
  //   clientHeightPage: 0,
  // });

  function handleSetWidthToolBarDrawer(width) {
    setWidthToolBarDrawer(width);
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-35%",
          width: "120%",
          left: "-3%",
          zIndex: 0,
          transform: "rotate(1deg)",
          "@media (max-width: 600px)": {
            top: "-30rem",
            width: "150%",
            left: "-30rem",
          },
        }}
      >
        <img
          src={BgImg}
          alt="bg"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <Stack
        direction={"row"}
        sx={{
          width: "94%",
          height: "90vh",
          position: "absolute",
          top: "3rem",
          borderRadius: "0.75rem",
          left: "3rem",

          zIndex: 100,
          backgroundColor: theme.colors.white1,
        }}
      >
        {/* Sidebar */}
        <Box
          width={sideBarWidth.current}
          padding={"2rem 0 0 0"}
          className={clsx(style.sidebarContainer)}
        >
          <SideBar></SideBar>
        </Box>
        <Box
          width={"82%"}
          className={style.contentContainer}
          position={"relative"}
          ref={refSlideContent}
        >
          {/* Header */}
          <HeaderBook topPositon={top}></HeaderBook>

          {/* Content */}
          {children}
        </Box>
      </Stack>
    </Box>
  );
}
