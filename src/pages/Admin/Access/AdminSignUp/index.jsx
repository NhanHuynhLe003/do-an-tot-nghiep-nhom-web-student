// src/pages/Login.js
import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import clsx from "clsx";
import React, { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { InputArea } from "../../../../components/form-support/input-area";
import LogoTitleAccess from "../../../../components/login/logo-title-access";
import { useStudentSignUp } from "../../../../hooks/apis/access/useStudentSignUp";
import theme from "../../../../theme";
import { v4 as uuidv4 } from "uuid";
import css from "./signUp.module.css";
import { toast } from "react-toastify";

const listStudentClass = [
  {
    _id: "001",
    name: "DTTT21A",
  },
  {
    _id: "002",
    name: "DTTT21B",
  },
  {
    _id: "003",
    name: "DTTT21C",
  },
  {
    _id: "004",
    name: "DTTT21D",
  },
  {
    _id: "005",
    name: "DTTT21E",
  },
  {
    _id: "006",
    name: "DTTT21F",
  },
  {
    _id: "007",
    name: "DTTT21G",
  },
  {
    _id: "008",
    name: "DTTT21H",
  },
  {
    _id: "009",
    name: "DTTT21I",
  },
  {
    _id: "010",
    name: "DTTT21K",
  },
];

export default function AdminSignUp() {
  const toastLoadingRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const [dataReceived, setDataReceived] = useState(null);
  const navigate = useNavigate();

  const {
    mutate: signUp, // Hàm này sẽ gọi API login, send request lên server
    data: responseData,
    isLoading,
  } = useStudentSignUp();

  const handleLoginGuest = useCallback(() => {
    navigate("/");
  }, []);

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
    name: yup.string().required("Tên không được để trống"),
    studentId: yup.string().default(uuidv4()),
    classStudent: yup.string().required("Lớp học không được để trống"),
    rePassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu không trùng khớp"),
    role: yup.string().required("Vai trò không được để trống"),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      studentId: "",
      name: "",
      email: "",
      password: "",
      classStudent: "",
      role: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const dataUser = { ...data, mode: data.role };
    delete dataUser.role;
    delete dataUser.rePassword;

    signUp(dataUser);

    toast.success("Đăng ký tài khoản thành công", {
      autoClose: 2000,
      position: "top-center",
    });
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
      <form className={css.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <Stack
          className={css.fieldcontainer}
          direction="row"
          flexWrap={"wrap"}
          justifyContent={"space-around"}
          sx={{
            "@media (max-width: 1200px)": {
              flexDirection: "column",
              gap: "1rem",
              padding: "1rem",
            },
          }}
        >
          <Box sx={{ width: "70%", margin: "0 auto" }}>
            <LogoTitleAccess title="Đăng Ký Sinh Viên Hoặc Admin" desc="" />
          </Box>
          <Box className={clsx(css.fieldInput, css.emailField)}>
            <label htmlFor="studentId">Mã số sinh viên(nếu có)</label>
            <InputArea
              sx={{ marginTop: 1 }}
              size="small"
              name="studentId"
              id="studentId"
              placeholder="Mã số sinh viên"
              control={control}
            />
          </Box>
          <Box className={clsx(css.fieldInput, css.emailField)}>
            <label htmlFor="fullName">Họ và Tên</label>
            <InputArea
              sx={{ marginTop: 1 }}
              size="small"
              name="name"
              id="fullName"
              placeholder="Họ và Tên"
              control={control}
            />
          </Box>
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

          <Box className={clsx(css.fieldInput, css.passwordField)}>
            <label htmlFor="password-login">Mật khẩu</label>
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
          <Box className={clsx(css.fieldInput, css.passwordField)}>
            <label htmlFor="rePassword">Nhập lại mật khẩu</label>
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
              name="rePassword"
              id="rePassword"
              placeholder="Nhập mật khẩu"
              control={control}
            />
          </Box>
          <Box className={clsx(css.fieldInput, css.passwordField)}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                mt: 4,
              }}
            >
              <InputLabel id="role-label">Vai trò</InputLabel>
              <Controller
                name="role"
                control={control}
                defaultValue={process.env.REACT_APP_USER_ROLE}
                render={({ field }) => (
                  <Select
                    labelId="role-label"
                    id="role"
                    label="Role"
                    {...field}
                  >
                    <MenuItem value={process.env.REACT_APP_USER_ROLE}>
                      User
                    </MenuItem>
                    <MenuItem value={process.env.REACT_APP_ADMIN_ROLE}>
                      Admin
                    </MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Box>

          <Box className={clsx(css.fieldInput, css.passwordField)}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                mt: 4,
                ml: 0.5,
              }}
            >
              <InputLabel id="classStudent-label">Lớp học</InputLabel>
              <Controller
                name="classStudent"
                control={control}
                defaultValue={listStudentClass[0]?.name}
                render={({ field }) => (
                  <Select
                    labelId="classStudent-label"
                    id="classStudent"
                    label="classStudent"
                    {...field}
                  >
                    {listStudentClass &&
                      listStudentClass.map((item) => (
                        <MenuItem value={item.name}>{item.name}</MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
          </Box>
          <br />
          <Box className={css.fieldInput} mt={3}>
            <Button
              type="submit"
              sx={{ bgcolor: theme.colors.primary1 }}
              variant="contained"
              fullWidth
            >
              Đăng Ký
            </Button>
            <Stack direction="row" justifyContent="right" mt={4}>
              <Button
                className={css.ButtonGuestLogin}
                variant="text"
                onClick={handleLoginGuest}
              >
                Tài Khoản Khách
              </Button>
            </Stack>
          </Box>
        </Stack>
      </form>
    </>
  );
}
