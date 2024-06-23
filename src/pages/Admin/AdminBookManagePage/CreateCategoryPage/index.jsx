import { yupResolver } from "@hookform/resolvers/yup";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Grid as MUIGrid,
  Stack,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { InputArea } from "../../../../components/form-support/input-area";
import IPagination from "../../../../components/IPagination";
import { listCategory } from "../../../../data/arrays";
import { useGetAllCategories } from "../../../../hooks/apis/category/useGetAllCategories";
import styles from "./CreateCategoryPage.module.css";
import { SwitchButton } from "../../../../components/form-support/switch-btn";

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
  //GET LIST CATEGORIES
  const { data, isLoading, isError } = useGetAllCategories();
  const [allCategoriesData, setAllCategoriesData] = React.useState([]);
  //==============FORM CONTROL================
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
            isShowCategory: true,
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

  useEffect(() => {
    setAllCategoriesData(data?.data?.metadata || []);
  }, [data]);

  if (isLoading)
    return (
      <Stack width={"100%"} minHeight={"80vh"}>
        <CircularProgress></CircularProgress>
      </Stack>
    );

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
        <MUIGrid xs={12} sm={12}>
          <SwitchButton
            sx={{ mx: 2 }}
            size={"medium"}
            name={"isShowCategory"}
            id={"isShowCategory"}
            control={control}
            label={
              <p>
                <b>Hiển thị Danh Mục</b>
              </p>
            }
            errors={errors.isPublicBook}
          />
        </MUIGrid>
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
          <MUIGrid item xs={2} className={styles.colHeaderItem}>
            ID
          </MUIGrid>
          <MUIGrid item xs={4} className={styles.colHeaderItem}>
            Danh mục
          </MUIGrid>
          <MUIGrid
            item
            xs={2}
            className={styles.colHeaderItem}
            alignContent={"center"}
          >
            Trạng thái
          </MUIGrid>

          <MUIGrid item xs={3} className={styles.colHeaderItem}>
            Hành động
          </MUIGrid>
        </MUIGrid>

        {/* =======================CONTENT TABLE========================= */}
        {allCategoriesData &&
          allCategoriesData.map((category) => (
            <MUIGrid
              container
              className={styles.row}
              item
              xs={12}
              key={category._id}
              my={1}
            >
              {/* ====Checkbox==== */}
              <MUIGrid item xs={1}>
                <Checkbox />
              </MUIGrid>

              {/* =====id========== */}

              <MUIGrid item xs={2} title={`ID-${category._id}`}>
                {category._id.toString().length > 10
                  ? `${category._id.toString().substring(0, 10)}...`
                  : category._id.toString()}
              </MUIGrid>

              {/* ======= Ten danh muc======== */}
              <MUIGrid item xs={4} title="Tên danh mục">
                {category.name.length > 35
                  ? `${category.name.substring(0, 35)}...`
                  : category.name}
              </MUIGrid>
              {/* ========Trạng thái==========*/}
              <MUIGrid item xs={2}>
                {category.isPublished ? (
                  <Chip
                    title="Hiển thị danh mục"
                    label={"Show"}
                    color="primary"
                    sx={{
                      width: "5rem",
                    }}
                  ></Chip>
                ) : (
                  <Chip
                    title="Ẩn danh mục"
                    label={"Hide"}
                    color="error"
                    sx={{
                      width: "5rem",
                    }}
                  ></Chip>
                )}
              </MUIGrid>

              <MUIGrid item xs={3}>
                <Stack direction={"row"} gap={"0.5rem"} alignItems={"center"}>
                  <Button
                    title="Chỉnh sửa danh mục"
                    onClick={() => onEdit(category._id)}
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
                    title="Xóa danh mục"
                    onClick={() => onDelete(category._id)}
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
