import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { listCategory } from "../../../../data/arrays";
import * as yup from "yup";
import {
  Button,
  Stack,
  Typography,
  Grid as MUIGrid,
  Checkbox,
} from "@mui/material";
import styles from "./CreateCategoryPage.module.css";
import { InputArea } from "../../../../components/form-support/input-area";
import clsx from "clsx";
import { Delete, Edit } from "@mui/icons-material";
import { FaCheck, FaAngleUp, FaAngleDown } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import IPagination from "../../../../components/IPagination";

// Validation schema using yup
const validationSchema = yup.object().shape({
  categoryName: yup
    .string()
    .required("Tên danh mục không được bỏ trống")
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  categoryDescription: yup
    .string()
    .min(5, "Mô tả danh mục phải có ít nhất 5 ký tự")
    .default("Không có mô tả"),
});

const CreateCategoryPage = ({
  mode = "create",
  defaultValueEdit = {},
  categories = [...listCategory],
  onDelete,
  onEdit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:
      mode === "create"
        ? {
            categoryName: "",
            categoryDescription: "",
          }
        : defaultValueEdit,
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    switch (mode) {
      case "create":
        console.log("Creating category:", data);
        break;
      case "update":
        console.log("Updating category:", data);
        break;
      default:
        console.error("Invalid mode");
    }
  };

  function onDisplayItemUp() {}

  function onDisplayItemDown() {}

  return (
    <Stack
      className={clsx("CategoryPage")}
      direction={"column"}
      px={{ xs: 2, sm: 8 }}
    >
      <Typography component={"h1"} variant="h4" mt={2} mb={6}>
        {mode === "create" ? "Thêm Danh Mục Mới" : "Cập Nhật Danh Mục"}
      </Typography>
      <MUIGrid
        container
        spacing={4}
        px={{ xs: 2, sm: 8 }}
        py={2}
        bgcolor={"var(--color-white1);"}
        borderRadius={"2rem"}
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Category Name */}
        <MUIGrid item xs={12} sm={6}>
          <label htmlFor="categoryName" className={styles.label}>
            Tên danh mục
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"categoryName"}
            id={"categoryName"}
            placeholder={"Nhập tên danh mục"}
            control={control}
            errors={errors.categoryName}
          />
        </MUIGrid>

        {/* Category Description */}
        <MUIGrid item xs={12} sm={6}>
          <label htmlFor="categoryDescription" className={styles.label}>
            Mô tả danh mục
          </label>
          <InputArea
            sx={{ marginTop: 1 }}
            size={"small"}
            name={"categoryDescription"}
            id={"categoryDescription"}
            placeholder={"Nhập mô tả danh mục"}
            control={control}
            errors={errors.categoryDescription}
            multiline
            rows={4}
          />
        </MUIGrid>

        {/* Submit Button */}
        <MUIGrid item xs={12} sm={12} textAlign={"center"}>
          <Button sx={{ width: "50%" }} variant="contained" type="submit">
            {mode === "create" ? "Thêm Danh Mục" : "Cập Nhật Danh Mục"}
          </Button>
        </MUIGrid>
      </MUIGrid>

      {/*====================== Categories Management============================== */}

      <Typography component={"h2"} variant="h5" mt={6} mb={6}>
        Quản lý Danh Mục
      </Typography>

      <MUIGrid container>
        {/* ==============HEADER TABLE ====================*/}
        <MUIGrid
          container
          className={clsx(styles.row, styles.rowHeader)}
          item
          xs={12}
          //   spacing={2}
        >
          <MUIGrid item xs={1} className={styles.colHeaderItem}>
            <Checkbox />
          </MUIGrid>
          <MUIGrid item xs={1} className={styles.colHeaderItem}>
            ID
          </MUIGrid>
          <MUIGrid item xs={3} className={styles.colHeaderItem}>
            Danh mục
          </MUIGrid>
          <MUIGrid item xs={2} className={styles.colHeaderItem}>
            Published
          </MUIGrid>
          <MUIGrid item xs={2} className={styles.colHeaderItem}>
            Thứ tự hiển thị
          </MUIGrid>
          <MUIGrid item xs={3} className={styles.colHeaderItem}>
            Hành động
          </MUIGrid>
        </MUIGrid>

        {/* =======================CONTENT TABLE========================= */}
        {categories.map((category) => (
          <MUIGrid
            container
            className={styles.row}
            item
            xs={12}
            key={category.id}
            // spacing={2}
            my={1}
          >
            {/* ====Checkbox==== */}
            <MUIGrid item xs={1}>
              <Checkbox />
            </MUIGrid>

            {/* =====id========== */}

            <MUIGrid item xs={1}>
              {category.id.toString().length > 10
                ? `${category.id.toString().substring(0, 10)}...`
                : category.id.toString()}
            </MUIGrid>

            {/* ======= Ten danh muc======== */}
            <MUIGrid item xs={3}>
              {category.value.length > 20
                ? `${category.value.substring(0, 20)}...`
                : category.value}
            </MUIGrid>
            {/* ========Trạng thái==========*/}
            <MUIGrid item xs={2}>
              {category.isPublic ? (
                <FaCheck color="var(--color-primary1)"></FaCheck>
              ) : (
                <ImCross color="red"></ImCross>
              )}
            </MUIGrid>
            <MUIGrid item xs={2}>
              {category.displayOrder}
            </MUIGrid>
            <MUIGrid item xs={3}>
              <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                <Stack direction={"column"} gap={"0.25rem"}>
                  <Button
                    onClick={() => onDisplayItemUp(category.id)}
                    variant="contained"
                    color="inherit"
                    size="small"
                    title="Tăng thứ tự hiển thị lên 1"
                    sx={{
                      height: "1rem",
                    }}
                  >
                    <FaAngleUp fontSize={"14px"}></FaAngleUp>
                  </Button>
                  <Button
                    onClick={() => onDisplayItemDown(category.id)}
                    variant="contained"
                    color="inherit"
                    size="small"
                    title="Giảm thứ tự hiển thị xuống 1"
                    sx={{
                      height: "1rem",
                    }}
                  >
                    <FaAngleDown fontSize={"14px"}></FaAngleDown>
                  </Button>
                </Stack>
                <Button
                  onClick={() => onEdit(category.id)}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    height: "1.5rem",
                  }}
                >
                  <Edit fontSize="small"></Edit>
                </Button>
                <Button
                  onClick={() => onDelete(category.id)}
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{
                    height: "1.5rem",
                  }}
                >
                  <Delete fontSize="small"></Delete>
                </Button>
              </Stack>
            </MUIGrid>
          </MUIGrid>
        ))}

        <MUIGrid
          item
          xs={12}
          sm={12}
          display={"flex"}
          justifyContent={"center"}
          my={2}
        >
          <IPagination></IPagination>
        </MUIGrid>
      </MUIGrid>
    </Stack>
  );
};

export default CreateCategoryPage;
