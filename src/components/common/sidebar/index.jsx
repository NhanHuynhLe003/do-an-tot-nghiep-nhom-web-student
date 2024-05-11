import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import style from "./sidebar.module.css";
import clsx from "clsx";
import { navList } from "../../../routes/navigation";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LogoPage from "../../../assets/images/logo-dtvt.png";

export default function SideBar({ listNavigation = [...navList] }) {
  const location = useLocation();

  const pathName = location.pathname;
  return (
    <Box className={style.sideBar}>
      <Stack direction={"column"} alignItems={"center"} gap={"1rem"}>
        <Box className={style.imgContainer}>
          <img
            width={"100%"}
            height={"auto"}
            alt="logo-page"
            src={LogoPage}
          ></img>
        </Box>

        <Stack
          className={clsx(style.navlistbar)}
          direction={"column"}
          gap={"1rem"}
        >
          {/* Lọc và hiển thị các tab trên thanh nav */}
          {listNavigation.map((item, index) => {
            return (
              <Link
                key={item.id}
                to={item.path}
                className={clsx(style.linkNav, {
                  [style.activeLinkNav]: pathName === item.path,
                })} // Add class active when pathName === item.path
              >
                <Stack
                  direction={"row"}
                  gap={"0.25rem"}
                  alignItems={"center"}
                  className={clsx(style.navItem, {
                    [style.active]: pathName === item.path,
                  })}
                >
                  <Box width={"20px"}>{item.icon}</Box>
                  <Typography className={clsx(style.navName)}>
                    {item.name}
                  </Typography>
                </Stack>
              </Link>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
