import { Grid, Stack, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import DragAndDropFile from "../../../../components/DragDropFile";
import { InputArea } from "../../../../components/form-support/input-area";
import { SelectInputField } from "../../../../components/form-support/select-input-field";
import { listCategory } from "../../../../data/arrays";

export default function CreateBookPage() {
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
    // resolver: yupResolver(schema),
  });

  async function handleUploadImage(imgFile) {
    if (!imgFile) console.error("Vui lòng chọn ảnh trước khi upload");

    const formData = new FormData();
    formData.append("fileImg", imgFile);

    try {
      // Gửi ảnh lên server
      const response = await axios.post("/api/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Xử lý kết quả trả về, lấy URL ảnh đã upload để sau khi save toàn page sẽ lưu vào database
      console.log("Upload thành công:", response.data);
    } catch (error) {
      console.error("Upload thất bại:", error);
    }
  }
  return (
    <Stack id="Create-Book-Page" direction={"column"} px={{ xs: 2, sm: 8 }}>
      <Typography component={"h1"} variant="h4" mt={2} mb={6}>
        Thêm Sách Mới
      </Typography>
      <Grid
        container
        spacing={4}
        px={{ xs: 2, sm: 8 }}
        py={4}
        bgcolor={"var(--color-white1);"}
        borderRadius={"2rem"}
      >
        <Grid item xs={12} sm={12}>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <DragAndDropFile></DragAndDropFile>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <label
            htmlFor="name-book-input"
            style={{ color: "var(--color-primary2)" }}
          >
            Tên Sách
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"name-book-input"}
            id={"name-book-input"}
            placeHolder={"Nhập tên quyển sách"}
            control={control}
          ></InputArea>
        </Grid>
        <Grid item xs={12} sm={6}>
          <label
            htmlFor="name-author-input"
            style={{ color: "var(--color-primary2)" }}
          >
            Tên Tác Giả
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"name-author-input"}
            id={"name-author-input"}
            placeHolder={"Nhập tên tác giả"}
            control={control}
          ></InputArea>
        </Grid>
        <Grid item xs={12} sm={6}>
          <label
            htmlFor="name-publisher-input"
            style={{ color: "var(--color-primary2)" }}
          >
            Nhà Xuất Bản
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"name-publisher-input"}
            id={"name-publisher-input"}
            placeHolder={"Nhập tên nhà xuất bản"}
            control={control}
          ></InputArea>
        </Grid>
        <Grid item xs={12} sm={6}>
          <label
            htmlFor="name-category-book-input"
            style={{ color: "var(--color-primary2)" }}
          >
            Thể loại sách
          </label>
          <SelectInputField
            defaultValue={listCategory[0].value}
            options={listCategory}
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"name-category-book-input"}
            id={"name-category-book-input"}
            control={control}
          ></SelectInputField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <label
            htmlFor="name-date-publish-book"
            style={{ color: "var(--color-primary2)" }}
          >
            Ngày xuất bản sách (nếu không điền thì mặc định lấy ngày hiện tại)
          </label>
          <SelectInputField
            type="date"
            defaultValue={listCategory[0].value}
            options={listCategory}
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"name-date-publish-book"}
            id={"name-date-publish-book"}
            control={control}
          ></SelectInputField>
        </Grid>
      </Grid>
    </Stack>
  );
}
