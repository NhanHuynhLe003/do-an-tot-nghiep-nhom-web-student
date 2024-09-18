import { Avatar, Stack } from "@mui/material";
import React from "react";
import avatarImg from "../../../../assets/images/avatar-student.jpg";
import style from "./account-info.module.css";
import { ArrowDropDown } from "@mui/icons-material";
import theme from "../../../../theme";

export default function AccountInfo({
  nameUser = "Nguyen Van A",
  img = avatarImg,
}) {
  return (
    <Stack
      className={style.accountContainer}
      direction={"row"}
      gap={"0.25rem"}
      alignItems={"center"}
    >
      <Avatar className={style.img} alt={nameUser} src={img || "/imgs/avatar-user.jpg"} />
      <p className={style.nameUser}>{nameUser}</p>
      <ArrowDropDown
        style={{
          color: theme.colors.primary2,
        }}
      ></ArrowDropDown>
    </Stack>
  );
}
