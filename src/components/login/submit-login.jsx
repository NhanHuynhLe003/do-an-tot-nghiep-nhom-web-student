import { Box, Button, Checkbox, FormControlLabel, Stack } from "@mui/material";
import React from "react";
import css from "./submit-login.module.css";
import theme from "../../theme";
import axios from "axios";

const hostUrl = process.env.HOST_URL;
export default function SubmitLogin() {
  async function handleClickLogin() {
    const res = await axios.post(
      "http://localhost:2024/v1/api/student/login",
      {
        studentId: "0308211154",
        name: "Huynh Le Nhan",
        email: "0308211150@caothang.edu.com",
        password: "",
      },
      {
        headers: {
          "x-api-key":
            "640dec9df23fbf3255079f3f7d375a9ea119dd0779a60538bf81b18aff28512ad44b4a911a78a53ead753401ad7eabbc0864472e10d4ae55667ddc6a3bedcafd",
        },
      }
    );

    console.log(res);
  }
  return (
    <Box className={css.formFieldContainer}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <FormControlLabel
          control={<Checkbox className={css.rememberCheckbox} defaultChecked />}
          label="Remember me"
        />
        <Button className={css.forgotPassword} variant="text">
          Quên mật khẩu?
        </Button>
      </Stack>
      <Button
        onClick={handleClickLogin}
        sx={{ bgcolor: theme.colors.primary1 }}
        variant="contained"
        fullWidth
      >
        Đăng Nhập
      </Button>
      <Stack direction="row" justifyContent="right" mt={6}>
        <Button className={css.ButtonGuestLogin} variant="text">
          Tài Khoản Khách
        </Button>
      </Stack>
    </Box>
  );
}
