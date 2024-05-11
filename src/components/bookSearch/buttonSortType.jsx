import { ArrowDropDown } from "@mui/icons-material";
import { Stack } from "@mui/material";
import React from "react";

export default function ButtonSortType({ content }) {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        color: "var(--color-primary2)",
        borderRadius: { sm: "10rem", xs: "4px" },
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        padding: { sm: "0.5rem 1rem", xs: "0.2rem 0.5rem" },
        width: { sm: "10rem", xs: "6rem" },
        fontSize: { sm: "0.8rem", xs: "0.6em" },
      }}
    >
      <span>{content}</span>
      <ArrowDropDown></ArrowDropDown>
    </Stack>
  );
}
