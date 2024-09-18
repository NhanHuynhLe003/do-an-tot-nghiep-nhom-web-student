import React, { useRef } from "react";

import { Box, Stack } from "@mui/material";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import DesignTemplateIcon from "../../../assets/icons/CV/design-ic.png";
import ElementsIcon from "../../../assets/icons/CV/elements-shape-ic.png";
import ImageUploadIcon from "../../../assets/icons/CV/image-upload.png";
import TextIcon from "../../../assets/icons/CV/text-type-ic.png";
import BgImg from "../../../assets/images/main-bg.png";
import { useWindowSizeDepParent } from "../../../hooks";
import theme from "../../../theme";
import IMiniVariantDrawer from "../../IDrawer/IMiniVariantDrawer";
import CvFooterToolbar from "../../common/footer/CvFooterToolbar";
import HeaderCvToolBar from "../../common/header/header-cv-toolbar";
import SideBar from "../../common/sidebar";

import style from "./mainlayout.module.css";
import TextCvContainer from "../../ICvComponents/textCvContainer";
import ShapeElementCvContainer from "../../ICvComponents/shapeElementCvContainer";
import ImageCvContainer from "../../ICvComponents/ImageCvContainer";

export default function CvLayout({ children, typePage = "" }) {
  const sideBarWidth = useRef(248);

  const location = useLocation();
  const urlPathName = useRef(location.pathname);
  const refSlideContent = useRef(null);
  const { left, top } = useWindowSizeDepParent(refSlideContent);
  const [widthToolBarDrawer, setWidthToolBarDrawer] = React.useState(0);

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

          <HeaderCvToolBar topPositon={top}></HeaderCvToolBar>

          {/* Content */}

          <Box className={style.drawtoolbarcontainer}>
            <IMiniVariantDrawer
              direction="right"
              drawerItems={[
                {
                  id: "FEATURE001",
                  title: "Template",
                  icon: DesignTemplateIcon,
                  isActive: false,
                  componentContent: (
                    <React.Fragment>Template Content</React.Fragment>
                  ),
                },
                {
                  id: "FEATURE002",
                  title: "Elements",
                  icon: ElementsIcon,
                  isActive: false,
                  componentContent: (
                    <React.Fragment>
                      <ShapeElementCvContainer></ShapeElementCvContainer>
                    </React.Fragment>
                  ),
                },
                {
                  id: "FEATURE003",
                  title: "Text",
                  icon: TextIcon,
                  isActive: true,
                  componentContent: (
                    <React.Fragment>
                      <TextCvContainer></TextCvContainer>
                    </React.Fragment>
                  ),
                },
                {
                  id: "FEATURE004",
                  title: "Image",
                  icon: ImageUploadIcon,
                  isActive: false,
                  componentContent: (
                    <React.Fragment>
                      <ImageCvContainer></ImageCvContainer>
                    </React.Fragment>
                  ),
                },
              ]}
              handleSetWidthToolBarDrawer={handleSetWidthToolBarDrawer}
            >
              {children}
            </IMiniVariantDrawer>
          </Box>

          {/* Footer */}

          <CvFooterToolbar
            // Lấy ra giá trị sidebarWidth và drawerToolbarPaperWidth để tính toán vị trí footer
            sideBarWidth={sideBarWidth.current}
            drawerToolbarPaperWidth={widthToolBarDrawer}
          ></CvFooterToolbar>
        </Box>
      </Stack>
    </Box>
  );
}
