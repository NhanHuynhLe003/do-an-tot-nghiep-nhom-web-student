import { Box } from "@mui/material";
import React from "react";
import CircleNav from "../../components/HomeComponent/CircleNav";

// import anh2 from "/imgs/avatar-user.jpg";
export default function Home() {
  return (
    <div>
      <Box
        sx={{
          width: "100%",
          // margin: "15rem auto",
          backgroundColor: "var(--color-primary1)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <CircleNav />
      </Box>
    </div>
  );
}
