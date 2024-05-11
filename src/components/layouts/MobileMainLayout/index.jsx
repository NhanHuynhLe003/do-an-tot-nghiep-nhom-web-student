import React from "react";
import style from "./mobileMainLayout.module.css";
import { Box, Stack } from "@mui/material";
import MobileMainHeader from "../../common/header/mobile-main-header";

export default function MobileMainLayout({ children }) {
  return (
    <Box>
      <MobileMainHeader></MobileMainHeader>
      <Stack direction={"column"} gap={2}>
        {children}
      </Stack>
    </Box>
  );
}
