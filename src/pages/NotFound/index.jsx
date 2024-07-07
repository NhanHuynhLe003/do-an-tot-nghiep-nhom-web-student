import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import Lottie from "react-lottie";
import notfoundAnimation from "../../assets/animations/404-animation.json";
import styles from "./Notfound.module.css";
import { IoMdReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";
export default function NotFoundPage() {
  const navigate = useNavigate();

  //==================Lottie: Hiển thị ảnh dạng animation json
  const lottieJsonOptions = (imgFile) => ({
    loop: true,
    autoplay: true,
    animationData: imgFile,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });
  return (
    <Stack
      sx={{
        width: "100%",
        minHeight: "80vh",
      }}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
    >
      <Button
        sx={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          fontSize: "1.25rem",
        }}
        type="button"
        variant="text"
        size="large"
        startIcon={<IoMdReturnLeft></IoMdReturnLeft>}
        onClick={() => navigate("/")}
      >
        Quay Về Trang Chủ
      </Button>
      <div className={styles.iconContainer}>
        <Lottie
          title="Không tìm thất trang"
          options={lottieJsonOptions(notfoundAnimation)}
          height={"100%"}
          width={"100%"}
        />
      </div>
      <Typography
        component={"h1"}
        variant="h3"
        sx={{
          color: "var(--color-primary1)",
          fontWeight: "bold",
          textAlign: "center",
          textTransform: "capitalize",
          mt: 2,
          "@media (max-width: 560px)": {
            fontSize: "2.5rem",
          },
        }}
      >
        Không tìm thấy trang
      </Typography>
    </Stack>
  );
}
