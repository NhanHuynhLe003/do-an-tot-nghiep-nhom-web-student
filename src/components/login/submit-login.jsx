import { Box, Button, Checkbox, FormControlLabel, Stack } from "@mui/material";
import React from "react";
import css from "./submit-login.module.css";
import theme from "../../theme";

export default function SubmitLogin() {
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
