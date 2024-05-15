import { Box, Button, IconButton, Input, Stack } from "@mui/material";
import React from "react";
import SubmitLogin from "../../components/login/submit-login";
import {
  Label,
  Padding,
  Password,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputArea } from "../../components/form-support/input-area";
import css from "./login.module.css";
import clsx from "clsx";
import LogoTitleAccess from "../../components/login/logo-title-access";
export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //Tạo schema validation
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .min(8, "mật khẩu phải có tối thiểu 8 ký tự")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "Mật khẩu cần chứa tối thiểu 1 chữ cái in hoa, one lowercase letter, one number, and one special character"
      ),
  });

  const {
    getValues, // Lấy giá trị của form
    setValue, // Set giá trị cho form
    control, // Lấy ra các hàm của form
    handleSubmit, // Hàm xử lý form
    reset, // Reset form
  } = useForm({
    defaultValues: {
      email: "",
      Password: "",
    },
    resolver: yupResolver(schema),
  });
  return (
    <form className={css.formContainer}>
      <Stack className={css.fieldcontainer} direction={"column"}>
        <LogoTitleAccess />
        <Box className={clsx(css.fieldInput, css.emailField)}>
          <label htmlFor="email-login">Email</label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"email-login"}
            id={"email-login"}
            placeHolder={"Nhập email"}
            control={control}
          ></InputArea>
        </Box>
        <br />
        <Box className={clsx(css.fieldInput, css.passwordField)}>
          <label htmlFor="email-login">Password</label>
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
            size={"small"}
            name={"password-login"}
            id={"password-login"}
            placeHolder={"Nhập email"}
            control={control}
          ></InputArea>
        </Box>
        <br />
        <SubmitLogin></SubmitLogin>
      </Stack>
    </form>
  );
}
