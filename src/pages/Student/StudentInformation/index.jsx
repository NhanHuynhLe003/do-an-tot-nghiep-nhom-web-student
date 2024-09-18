import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Avatar,
  Container,
  Box,
  Grid,
  MenuItem,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useUpdateStudentInformation } from "../../../hooks/apis/students/useUpdateStudentInformation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axiosInstance from "../../../apis/axiosConfig";
import { toast } from "react-toastify";
import { useGetStudentInformationByUserId } from "../../../hooks/apis/students/useGetStudentInformationByUserId";
import { createSlug } from "../../../utils";

const schema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  name: yup.string().required("Tên là bắt buộc"),
  password: yup.string().required("Mật khẩu là bắt buộc"),
  booksRead: yup
    .number()
    .required("Số sách đã đọc là bắt buộc")
    .min(0, "Số sách không thể âm"),
  classStudent: yup.string().required("Lớp học là bắt buộc"),
  dateOfBirth: yup.date(),
  phoneNumber: yup.string().trim(),
  profileImg: yup.string(),
});

export default function StudentInformation() {
  const studentId = JSON.parse(localStorage.getItem("studentData"))._id;
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [imgUploaded, setImgUploaded] = useState("/imgs/avatar-user.jpg");
  const [isLoadingToast, setIsLoadingToast] = useState(false);
  const toastRefLoading = useRef(null);
  const { data: userData } = useGetStudentInformationByUserId({
    userId: studentId,
  });
  const { mutate: updateStudentInformation } = useUpdateStudentInformation();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      email: "student@example.com",
      name: "Student Name",
      password: "******",
      booksRead: 10,
      classStudent: "DTTT21MT",
      dateOfBirth: dayjs("2003-10-16"),
      phoneNumber: "091234578",
      profileImg: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (userData && userData.data && userData.data.metadata) {
      const studentData = userData?.data.metadata;
      setValue("email", studentData?.email);
      setValue("name", studentData?.name);
      setValue("password", "**********");
      setValue("booksRead", studentData?.books_readed?.length);
      setValue("classStudent", studentData?.classStudent);
      setValue("dateOfBirth", dayjs(studentData?.date_of_birth));
      setValue("phoneNumber", studentData?.phone);
      setValue("profileImg", studentData?.profileImage);
      setImgUploaded(studentData?.profileImage);
    }
  }, [userData, setValue]);

  const handleChangeImg = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      const extension = file?.name.split(".").pop();
      const fileName = file?.name.split(".").shift();
      const fileNameSlug = createSlug(fileName);

      const newFileName = `${fileNameSlug}.${extension}`;
      const renamedFile = new File([file], newFileName, {
        type: file.type,
      });

      setIsLoadingToast(true);
      formData.append("uploadFileKey", renamedFile);

      const imageUpload = await axiosInstance.post(
        "/v1/api/upload/static/img?nameStorage=students",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsLoadingToast(false);

      toast.success("Upload ảnh thành công", {
        position: "top-center",
      });
      const response = imageUpload?.data?.metadata;
      setImgUploaded(response.url || "/imgs/avatar-user.jpg");
    }
  };

  const handleDialogClose = (confirmed) => {
    setOpenDialog(false);
    if (confirmed && dialogAction) {
      dialogAction();
    }
  };

  const onSubmit = (data) => {
    setValue("profileImg", imgUploaded);
    const valueUpload = getValues();
    valueUpload.dateOfBirth = valueUpload.dateOfBirth.format();
    const payload = {
      userId: studentId,
      date_of_birth: valueUpload.dateOfBirth,
      phone: valueUpload.phoneNumber,
      profileImage: valueUpload.profileImg,
    };
    setIsLoadingToast(true);
    updateStudentInformation(payload);

    setIsLoadingToast(false);

    toast.success("Cập nhật thông tin thành công", {
      position: "top-center",
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    setDialogAction(() => handleSubmit(onSubmit));
    setOpenDialog(true);
  };

  const handleCancel = () => {
    setDialogAction(() => () => setIsEditing(false));
    setOpenDialog(true);
  };

  const handleBeforeUnload = (e) => {
    if (isDirty && isEditing) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  useEffect(() => {
    if (isDirty || isEditing) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isEditing, isDirty]);

  useEffect(() => {
    if (isLoadingToast) {
      toastRefLoading.current = toast.loading("Đang xử lý....", {
        position: "top-center",
      });
    } else {
      toast.dismiss(toastRefLoading.current);
      toastRefLoading.current = null;
    }
  }, [isLoadingToast]);

  return (
    <Container>
      <Typography
        alignSelf={"flex-start"}
        component={"h1"}
        variant="h4"
        mb={8}
        fontWeight={600}
        color={"var(--color-primary2)"}
        sx={{
          opacity: 0.7,
          textTransform: "capitalize",
          textAlign: "center",
          mt: 4,
        }}
      >
        Thông tin sinh viên
      </Typography>
      <Box
        width={"90%"}
        mx="auto"
        sx={{
          background: "#fff",
          padding: 8,
          borderRadius: 4,
          my: 8,

          "@media (max-width: 600px)": {
            padding: 2,
          },
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <Stack position="relative" mb={6}>
            <Avatar
              alt="Student Avatar"
              src={imgUploaded}
              sx={{ width: 100, height: 100 }}
            />
            {isEditing && (
              <IconButton
                title="Nhấn vào để thay đổi ảnh đại diện"
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "background.paper",
                  p: 0.5,
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <input
                  onChange={handleChangeImg}
                  hidden
                  accept="image/*"
                  type="file"
                />
                <PhotoCamera />
              </IconButton>
            )}
          </Stack>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      fullWidth
                      disabled
                      margin="normal"
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Họ và Tên"
                      fullWidth
                      disabled
                      margin="normal"
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      error={!!errors.name}
                      helperText={errors.name ? errors.name.message : ""}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider
                      sx={{
                        width: "100%",
                      }}
                      dateAdapter={AdapterDayjs}
                    >
                      <DatePicker
                        disabled={!isEditing}
                        {...field}
                        label="Ngày sinh"
                        sx={{
                          width: "100%",
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={8}
                sx={{
                  "@media (min-width: 600px)": {
                    pt: "0 !important",
                  },
                }}
              >
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Invalid phone number",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Số điện thoại"
                      fullWidth
                      disabled={!isEditing}
                      margin="normal"
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      error={!!errors.phoneNumber}
                      helperText={
                        errors.phoneNumber ? errors.phoneNumber.message : ""
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="booksRead"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled
                      label="Số sách đã đọc"
                      type="number"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      error={!!errors.booksRead}
                      helperText={
                        errors.booksRead ? errors.booksRead.message : ""
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="classStudent"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Lớp học"
                      select
                      fullWidth
                      margin="normal"
                      InputProps={{
                        disabled: true,
                      }}
                      error={!!errors.class}
                      helperText={errors.class ? errors.class.message : ""}
                    >
                      <MenuItem value={getValues("classStudent")}>
                        {getValues("classStudent")}
                      </MenuItem>
                      <MenuItem value="DTTT21MT">DTTT21MT</MenuItem>
                      <MenuItem value="DTTT21VT">DTTT21VT</MenuItem>
                      <MenuItem value="DTTT22A">DTTT22A</MenuItem>
                      <MenuItem value="DTTT22B">DTTT22B</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      title="Không thể xem hay chỉnh sửa"
                      label="Mật khẩu"
                      disabled
                      type="password"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      error={!!errors.password}
                      helperText={
                        errors.password ? errors.password.message : ""
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={2} display={"flex"} alignItems={"center"}>
                <Button
                  title="Nhấn vào để thay đổi mật khẩu"
                  disabled={!isEditing}
                  component={Link}
                  to="/change-password"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Đổi mật khẩu
                </Button>
              </Grid>
            </Grid>
            {isEditing ? (
              <Box display="flex" justifyContent="center" gap={2} mt={6}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Stack justifyContent={"center"} alignItems={"center"} mt={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </Button>
              </Stack>
            )}
          </form>
        </Box>

        <Dialog
          open={openDialog}
          onClose={() => handleDialogClose(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Xác nhận"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn lưu thay đổi này chứ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleDialogClose(true)}
              color="primary"
              autoFocus
            >
              Đồng ý
            </Button>

            <Button onClick={() => handleDialogClose(false)} color="error">
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
