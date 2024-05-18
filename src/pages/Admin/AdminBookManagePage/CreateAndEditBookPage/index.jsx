import { Button, Grid, Stack, Typography } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import DragAndDropFile from "../../../../components/DragDropFile";
import { InputArea } from "../../../../components/form-support/input-area";
import { SelectInputField } from "../../../../components/form-support/select-input-field";
import { listCategory } from "../../../../data/arrays";
import { format } from "date-fns";
import { SwitchButton } from "../../../../components/form-support/switch-btn";

/**
 * @description Trang tạo mới hoặc edit sách
 * @param {*} param
 * @param {string} param.mode - Chế độ tạo mới hoặc chỉnh sửa sách
 * @param {object} param.defaultValueEdit - Dữ liệu sách trả về từ server khi chỉnh sửa
 *
 * @returns
 */
export default function CreateBookPage({
  mode = "create",
  defaultValueEdit = {},
}) {
  // ============= Định nghĩa validate form =============
  const validationSchema = yup.object().shape({
    thumbnailUrl: yup
      .string()
      .url("Định dạng URL không hợp lệ")
      .required("Thumbnail sách là bắt buộc")
      .min(10, "thumbnail sách phải có ít nhất 10 ký tự"),
    bookQuantity: yup
      .number()
      .integer("Số lượng sách phải là số nguyên")
      .positive("Số lượng sách phải lớn hơn 0")
      .required("Số lượng sách là bắt buộc")
      .min(1, "Số lượng sách phải lớn hơn 0"),
    nameBook: yup
      .string()
      .required("Tên sách không được bỏ trống")
      .min(2, "Tên sách phải có ít nhất 2 ký tự"),
    nameAuthor: yup
      .string()
      .required("Tên tác giả không được bỏ trống")
      .min(3, "Tên tác giả phải có ít nhất 3 ký"),
    namePublisher: yup.string().default("Unknown Publisher"),
    nameCategory: yup
      .string()
      .required("Thể loại sách không được bỏ trống")
      .min(3, "Thể loại sách phải có ít nhất 3 ký tự")
      .notOneOf(["Lựa chọn thể loại sách"], "Vui lòng chọn thể loại sách"),
    datePublish: yup.date().required("Ngày xuất bản sách không được bỏ trống"),
    authorDescription: yup.string().default("Không có thông tin tác giả"),
    bookDescription: yup
      .string()
      .required("Mô tả sách không được bỏ trống")
      .min(5, "Mô tả sách phải có ít nhất 5 ký tự"),
    isPublicBook: yup
      .boolean()
      .required("Trạng thái công khai sách không được bỏ trống")
      .default(false),
  });

  //===================================== Xử lý form ================================
  const {
    // getValues, // Lấy giá trị của form
    // setValue, // Set giá trị cho form theo cú pháp: setValue("name", value)
    control,
    handleSubmit,
    // reset, // Reset form khi gọi hàm reset()
    formState: { errors },
  } = useForm({
    defaultValues:
      mode === "create"
        ? {
            thumbnailUrl: "https://placehold.co/96x134", //Ảnh mặc định tạm thời để vầy trước, sau này xử lý db rồi cho nó rỗng
            bookQuantity: 1,
            nameBook: "",
            nameAuthor: "",
            namePublisher: "",
            nameCategory: listCategory[0].value,
            datePublish: format(new Date(), "yyyy-MM-dd"),
            authorDescription: "Không có thông tin tác giả",
            bookDescription: "",
            isPublicBook: true, //Mặc định sách sẽ được công khai
          }
        : defaultValueEdit,
    resolver: yupResolver(validationSchema),
  });

  /**
   * @description Xử lý khi người dùng chọn ảnh và upload
   * @param {*} imgFile
   */
  async function handleUploadImage(imgFile) {
    if (!imgFile) console.error("Vui lòng chọn ảnh trước khi upload");

    const formData = new FormData();
    formData.append("fileImg", imgFile);

    try {
      const response = await axios.post("/api/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload thành công:", response.data);
    } catch (error) {
      console.error("Upload thất bại:", error);
    }
  }

  /**
   * @description Xử lý khi người dùng submit form
   * @param {*} data
   */
  const onSubmit = (data) => {
    switch (mode) {
      case "create":
        console.log("Handle Create submit:", data);
        break;
      case "update":
        console.log("Handle Update submit:", data);
        break;
      default:
        console.error("Chế độ không hợp lệ");
    }
  };

  return (
    <Stack id="Create-Book-Page" direction={"column"} px={{ xs: 2, sm: 8 }}>
      <Typography component={"h1"} variant="h4" mt={2} mb={6}>
        Thêm Sách Mới
      </Typography>

      {/* ==================== Upload Ảnh ========================== */}
      <Grid
        container
        spacing={4}
        px={{ xs: 2, sm: 8 }}
        py={4}
        bgcolor={"var(--color-white1);"}
        borderRadius={"2rem"}
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Grid item xs={12} sm={12}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <DragAndDropFile errors={errors.thumbnailUrl} />
          </Stack>
        </Grid>

        {/* ==============================Tên Sách======================= */}

        <Grid item xs={12} sm={6}>
          <label htmlFor="nameBook" style={{ color: "var(--color-primary2)" }}>
            Tên sách
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"nameBook"}
            id={"nameBook"}
            placeHolder={"Nhập tên quyển sách"}
            control={control}
            errors={errors.nameBook} //Lấy thông báo lỗi từ yup
          />
        </Grid>

        {/* ==================== Tên Tác Giả ========================= */}
        <Grid item xs={12} sm={6}>
          <label
            htmlFor="nameAuthor"
            style={{ color: "var(--color-primary2)" }}
          >
            Tên tác giả
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"nameAuthor"}
            id={"nameAuthor"}
            placeHolder={"Nhập tên tác giả"}
            control={control}
            errors={errors.nameAuthor} // Lấy thông báo lỗi từ yup
          />
        </Grid>

        {/* ============================ Nhà Xuất Bản ========================= */}

        <Grid item xs={12} sm={6}>
          <label
            htmlFor="namePublisher"
            style={{ color: "var(--color-primary2)" }}
          >
            Nhà xuất bản
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"namePublisher"}
            id={"namePublisher"}
            placeHolder={"Nhập tên nhà xuất bản"}
            control={control}
            errors={errors.namePublisher}
          />
        </Grid>

        {/* ======================== Thể Loại Sách ========================= */}

        <Grid item xs={12} sm={6}>
          <label
            htmlFor="nameCategory"
            style={{ color: "var(--color-primary2)" }}
          >
            Thể loại sách
          </label>
          <SelectInputField
            defaultValue={listCategory[0].value}
            options={listCategory}
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"nameCategory"}
            id={"nameCategory"}
            control={control}
            errors={errors.nameCategory}
          />
        </Grid>

        {/* ======================= Ngày Sản Xuất ========================== */}

        <Grid item xs={12} sm={6}>
          <label
            htmlFor="datePublish"
            style={{ color: "var(--color-primary2)" }}
          >
            Ngày xuất bản sách
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"datePublish"}
            id={"datePublish"}
            type="date"
            control={control}
            errors={errors.datePublish}
          />
        </Grid>

        {/* ======================= Số lượng sách ============================ */}
        <Grid item xs={12} sm={6}>
          <label
            htmlFor="bookQuantity"
            style={{ color: "var(--color-primary2)" }}
          >
            Số lượng sách thêm vào kho
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"bookQuantity"}
            id={"bookQuantity"}
            type="number"
            control={control}
            errors={errors.bookQuantity}
          />
        </Grid>
        {/* ======================== Thông tin tác giả ========================= */}
        <Grid item xs={12} sm={6}>
          <label
            htmlFor="authorDescription"
            style={{ color: "var(--color-primary2)" }}
          >
            Thông tin tác giả
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"authorDescription"}
            placeHolder={"Nhập thông tin tác giả"}
            id={"authorDescription"}
            multiline
            rows={6}
            control={control}
            errors={errors.authorDescription}
          />
        </Grid>
        {/* ================== Mô tả sách ================== */}
        <Grid item xs={12} sm={6}>
          <label
            htmlFor="bookDescription"
            style={{ color: "var(--color-primary2)" }}
          >
            Mô tả sách
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"bookDescription"}
            placeHolder={"Nhập mô tả sách"}
            id={"bookDescription"}
            multiline
            rows={6}
            control={control}
            errors={errors.bookDescription}
          />
        </Grid>

        {/* ================== Nút Chuyển Public hay bản nháp */}

        <Grid item xs={12} sm={6}>
          <SwitchButton
            sx={{ marginTop: 1 }}
            size={"medium"}
            name={"isPublicBook"}
            id={"isPublicBook"}
            control={control}
            label={"Công khai sách"}
            errors={errors.isPublicBook}
          />
        </Grid>

        <Grid item xs={12} sm={12} textAlign={"center"}>
          {mode === "create" ? (
            <Button sx={{ width: "50%" }} variant="contained" type="submit">
              Thêm sách
            </Button>
          ) : (
            <Button
              sx={{ width: "50%" }}
              variant="contained"
              color="success"
              type="submit"
            >
              Cập nhật sách
            </Button>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}
