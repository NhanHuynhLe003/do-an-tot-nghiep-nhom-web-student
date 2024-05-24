import React, { useEffect, useRef } from "react";

import { Box, Stack } from "@mui/material";
import SideBar from "../../common/sidebar";
import Footer from "../../common/footer";
import BgImg from "../../../assets/images/main-bg.png";
import theme from "../../../theme";
import style from "./mainlayout.module.css";

import HeaderBook from "../../common/header/header-book";
import { useWindowSizeDepParent } from "../../../hooks";
import clsx from "clsx";

export default function MainLayout({ children, typePage = "" }) {
  const refSlideContent = useRef(null);
  const { left, top } = useWindowSizeDepParent(refSlideContent);
  // console.log("TOP:", top);
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
            // filter: "drop-shadow(3px 3px 30px #6154FA)",
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
          width={"18%"}
          padding={"2rem 0 0 0"}
          className={clsx(style.sidebarContainer)}
        >
          <SideBar></SideBar>
          <Footer></Footer>
        </Box>
        <Box
          width={"82%"}
          className={style.contentContainer}
          position={"relative"}
          ref={refSlideContent}
        >
          <HeaderBook topPositon={top}></HeaderBook>

          {children}
        </Box>
      </Stack>
    </Box>
  );
}
