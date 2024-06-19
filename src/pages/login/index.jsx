// src/pages/Login.js
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import clsx from "clsx";
import { InputArea } from "../../components/form-support/input-area";
import LogoTitleAccess from "../../components/login/logo-title-access";
import { useStudentLogin } from "../../hooks/apis/access";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import css from "./login.module.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [dataReceived, setDataReceived] = useState(null);
  const navigate = useNavigate();

  function setDataIntoLocalStorage(data) {
    localStorage.setItem(
      "studentData",
      JSON.stringify(data?.metadata?.student)
    );
    localStorage.setItem("accessToken", data?.metadata?.tokens?.accessToken);
    localStorage.setItem("refreshToken", data?.metadata?.tokens?.refreshToken);
  }

  const {
    mutate: login, // Hàm này sẽ gọi API login, send request lên server
    data: responseData,
    isLoading,
    error,
  } = useStudentLogin();

  useEffect(() => {
    if (responseData) {
      console.log("RESPONSE DATA", responseData);
      setDataIntoLocalStorage(responseData);
      setDataReceived(responseData);
      navigate("/"); // Điều hướng đến trang dashboard
    }
  }, [responseData, navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống"),
    password: yup
      .string()
      .required("Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có tối thiểu 8 ký tự"),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    login(data);
  };

  if (isLoading) {
    return (
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      {dataReceived ? (
        <Stack direction="column" justifyContent="center" alignItems="center">
          <Paper>Xin Chào</Paper>
        </Stack>
      ) : (
        <form className={css.formContainer} onSubmit={handleSubmit(onSubmit)}>
          <Stack className={css.fieldcontainer} direction="column">
            <LogoTitleAccess />
            <Box className={clsx(css.fieldInput, css.emailField)}>
              <label htmlFor="email-login">Email</label>
              <InputArea
                sx={{ marginTop: 1 }}
                size="small"
                name="email"
                id="email-login"
                placeholder="Nhập email"
                control={control}
              />
            </Box>
            <br />
            <Box className={clsx(css.fieldInput, css.passwordField)}>
              <label htmlFor="password-login">Password</label>
              <InputArea
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                type={showPassword ? "text" : "password"}
                sx={{ marginTop: 1 }}
                size="small"
                name="password"
                id="password-login"
                placeholder="Nhập mật khẩu"
                control={control}
              />
            </Box>
            <br />
            <Box className={css.formFieldContainer}>
              <Stack direction="row" justifyContent="space-between">
                <FormControlLabel
                  control={
                    <Checkbox className={css.rememberCheckbox} defaultChecked />
                  }
                  label="Remember me"
                />
                <Button className={css.forgotPassword} variant="text">
                  Quên mật khẩu?
                </Button>
              </Stack>
              <Button
                type="submit"
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
          </Stack>
        </form>
      )}
    </>
  );
}
