import { Avatar, Stack } from "@mui/material";
import React from "react";
import style from "./cardUserRank.module.css";
export default function CardUserRank({
  userName = "User Name",
  userBookReaded = 10,
  img = "imgs/avatar-user.jpg",
}) {
  return (
    <Stack direction={"row"} className={style.cardUserRank} sx={{minWidth: '18rem'}}>
      <Avatar alt={`hinh-anh-${userName}`} src={img} />
      <Stack direction={"column"} pl={"0.75rem"}>
        <p className={style.userName}>{userName}</p>
        <p className={style.userBookReaded}>
          <span style={{ fontWeight: 500 }}>Sách đã đọc:</span> {userBookReaded}
        </p>
      </Stack>
    </Stack>
  );
}
