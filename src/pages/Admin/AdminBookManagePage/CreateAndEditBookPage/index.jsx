import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import axiosInstance from "../../../../apis/axiosConfig";
import DragAndDropFile from "../../../../components/DragDropFile";
import { InputArea } from "../../../../components/form-support/input-area";
import { SelectInputField } from "../../../../components/form-support/select-input-field";
import { SwitchButton } from "../../../../components/form-support/switch-btn";
import IBreadcrumbs from "../../../../components/IBreadcrumbs";
import { listCategory } from "../../../../data/arrays";
import useAdminCreateBook from "../../../../hooks/apis/books/useAdminCreateBook";
import { useGetCategoriesPublished } from "../../../../hooks/apis/category";
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
  const {
    mutate: createBook, // Hàm này sẽ gọi API createBook, send request lên server
    data: responseData,
    isLoading,
    error,
  } = useAdminCreateBook();

  const [categoriesConvert, setCategoriesConvert] = useState([]); //Chuyển đổi dữ liệu thể loại sách từ server về dạng [{label: "", value: ""}
  const [isUploadImg, setIsUploadImg] = useState(false); //Kiểm tra xem đã upload ảnh chưa

  const [loadingToast, setLoadingToast] = useState({
    status: false,
    message: "",
  });

  const {
    data: dataCategories,
    error: errCategories,
    isLoading: isLoadingCategories,
  } = useGetCategoriesPublished();

  const idLoadingRef = React.useRef(null);
  useEffect(() => {
    if (loadingToast.status) {
      idLoadingRef.current = toast.loading(loadingToast.message, {
        position: "top-center",
      });
    } else {
      toast.dismiss(idLoadingRef.current);
    }
  }, [loadingToast]);

  useEffect(() => {
    if (dataCategories) {
      const newDataConvert = dataCategories.data.metadata.map((cate) => ({
        ...cate,
        label: cate.name,
        value: cate._id,
      }));
      setCategoriesConvert(newDataConvert);
    }
  }, [dataCategories]);

  // ============= Định nghĩa validate form =============
  const validationSchema = yup.object().shape({
    thumbnailUrl: yup
      .string()
      .url("Định dạng URL không hợp lệ")
      .required("Vui lòng upload ảnh sách trước khi thêm")
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
    getValues, // Lấy giá trị của form
    setValue, // Set giá trị cho form theo cú pháp: setValue("name", value)
    control,
    handleSubmit,
    reset, // Reset form khi gọi hàm reset()
    formState: { errors },
  } = useForm({
    defaultValues:
      mode === "create"
        ? {
            thumbnailUrlId: null,
            thumbnailUrl: "", //Ảnh mặc định tạm thời để vầy trước, sau này xử lý db rồi cho nó rỗng
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
  const handleUploadImage = async (imgFile) => {
    if (!imgFile) {
      console.error("Vui lòng chọn ảnh trước khi upload");
      return;
    }

    const extension = imgFile?.name.split(".").pop();
    const newFileName = `${Date.now()}.${extension}`;
    const renamedFile = new File([imgFile], newFileName, {
      type: imgFile.type,
    });

    const formData = new FormData();
    formData.append("uploadFileKey", renamedFile);

    // Kiểm tra xem formData có dữ liệu không
    if (!formData.has("uploadFileKey")) {
      console.error("Ảnh không được để trống");
      return;
    }

    try {
      setLoadingToast({
        status: true,
        message: "Đang upload ảnh sách...",
      });
      const response = await axiosInstance.post(
        "/v1/api/upload/d-img?nameStorage=books",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoadingToast({
        status: false,
        message: "",
      });
      toast.success("Upload ảnh thành công", {
        position: "top-center",
      });

      if (response.data.metadata.url) {
        //Set giá trị cho form value thumbnailUrl
        setValue("thumbnailUrlId", response.data.metadata?.imageInfo?._id);
        setValue("thumbnailUrl", response.data.metadata.url);
        setIsUploadImg(true);
        //lưu ảnh vào local storage để lần sau khi reload trang vẫn hiển thị ảnh
        localStorage.setItem("thumbnailUrl", response.data.metadata.url);
      }
    } catch (error) {
      setIsUploadImg(false);
      toast.error("Upload ảnh thất bại", {
        position: "top-center",
      });
    }
  };

  const handleCreateBook = useCallback((data) => {
    const payloadCreateBook = {
      book_thumb_id: data.thumbnailUrlId,
      book_name: data.nameBook,
      book_author: data.nameAuthor,
      book_thumb: data.thumbnailUrl,
      book_desc: data.bookDescription,
      book_quantity: data.bookQuantity,
      book_genre: data.nameCategory, //Tìm kiếm thể loại trước rồi gán objectID vào
      book_publish_date: data.datePublish.toISOString(),

      book_ratingsAverage: 4.5,
      book_students_read: 0,
      book_favourites: 0,
    };

    setLoadingToast({
      status: true,
      message: "Đang thêm sách mới...",
    });
    //Gọi API tạo sách
    createBook(payloadCreateBook);
    setLoadingToast({
      status: false,
      message: "",
    });
    toast.success("Thêm sách thành công");

    return data;
  }, []);

  /**
   * @description Xử lý khi người dùng submit form
   * @param {*} data
   */
  const onSubmit = (data) => {
    switch (mode) {
      case "create":
        handleCreateBook(data);
        reset();

        break;
      case "update":
        console.log("Handle Update submit:", data);
        reset();

        break;
      default:
        console.error("Chế độ không hợp lệ");
    }
  };

  return (
    <Stack id="Create-Book-Page" direction={"column"} px={{ xs: 2, sm: 8 }}>
      <IBreadcrumbs
        listBreadcrumbs={[
          {
            id: 1,
            path: "/admin/book-manage",
            name: "Quản lý sách",
          },
          {
            id: 2,
            path: "/admin/book-manage/create-book",
            name: "Thêm sách",
          },
        ]}
        sx={{ pt: 3, pb: 2 }}
      ></IBreadcrumbs>
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
            <DragAndDropFile
              handleUploadImage={handleUploadImage}
              errors={errors.thumbnailUrl}
            />
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
            defaultValue={
              categoriesConvert.length && categoriesConvert[0].value
            }
            options={categoriesConvert}
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
            label={
              <p>
                <b>Công khai sách</b>{" "}
                <span
                  style={{
                    fontSize: "0.8rem",
                  }}
                >
                  (nếu không công khai thì sẽ ở dưới dạng bản nháp, mặc định là
                  công khai)
                </span>
              </p>
            }
            errors={errors.isPublicBook}
          />
        </Grid>

        <Grid item xs={12} sm={12} textAlign={"center"}>
          {mode === "create" ? (
            <Button
              onClick={() =>
                !isUploadImg &&
                toast.error("Vui lòng upload ảnh sách trước khi thêm", {
                  position: "top-center",
                })
              }
              sx={{ width: "50%" }}
              variant="contained"
              type="submit"
            >
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
