import { Box } from "@mui/material";
import React from "react";
import BgImg from "../../../assets/images/main-bg.png";
export default function AccessLayout({ children }) {
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
          top: "-12rem",
          left: "-5rem",
          zIndex: 0,
          transform: "rotate(9deg)",
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
            filter: "drop-shadow(3px 3px 30px #6154FA)",
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          "@media (max-width: 600px)": {
            background: `linear-gradient(to bottom right, #6154FA 40%, #5fd2eb 100%)`,
          },
          "@media (max-width: 1200px)": {
            background: `linear-gradient(to bottom right, #6154FA 40%, #5fd2eb 100%)`,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
