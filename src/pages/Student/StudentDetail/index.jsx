import React, { useState } from "react";
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
import { Link } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const schema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  name: yup.string().required("Tên là bắt buộc"),
  password: yup.string().required("Mật khẩu là bắt buộc"),
  booksRead: yup
    .number()
    .required("Số sách đã đọc là bắt buộc")
    .min(0, "Số sách không thể âm"),
  class: yup.string().required("Lớp học là bắt buộc"),
});

const StudentDetailForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "student@example.com",
      name: "Student Name",
      password: "******",
      booksRead: 10,
      class: "A",
    },
    resolver: yupResolver(schema),
  });

  const handleDialogClose = (confirmed) => {
    setOpenDialog(false);
    if (confirmed && dialogAction) {
      dialogAction();
    }
  };

  const onSubmit = (data) => {
    console.log(data);
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

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
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
          }}
        >
          Thông tin sinh viên
        </Typography>
        <Stack position="relative" mb={6}>
          <Avatar
            alt="Student Avatar"
            src="/path/to/avatar.jpg"
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
              }}
            >
              <input hidden accept="image/*" type="file" />
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
                    disabled={!isEditing}
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
                    label="Tên sinh viên"
                    fullWidth
                    disabled={!isEditing}
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
                name="class"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Lớp học"
                    select
                    fullWidth
                    margin="normal"
                    InputProps={{
                      disabled: !isEditing,
                    }}
                    error={!!errors.class}
                    helperText={errors.class ? errors.class.message : ""}
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
                    helperText={errors.password ? errors.password.message : ""}
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
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
              <Button variant="contained" color="error" onClick={handleCancel}>
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
            Bạn có chắc chắn muốn thực hiện hành động này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Hủy
          </Button>
          <Button
            onClick={() => handleDialogClose(true)}
            color="primary"
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentDetailForm;
