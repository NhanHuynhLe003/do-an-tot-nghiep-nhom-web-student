import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./AdminBookOrderPage.module.css";
//===========FILTER===============
import { ArrowDropDown } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import dayjs from "dayjs";
import { FaEdit, FaFilter } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import IMenuListFloat from "../../../components/IMenuListFloat";
import IPopupButton from "../../../components/IPopupButton";
import ButtonSortType from "../../../components/bookSearch/buttonSortType";

import slugify from "slugify";
import ITable from "../../../components/ITable/ITable";
import {
  listCategoryLevel1,
  listClassBookOrder,
  listStatusOrder,
} from "../../../data/arrays";
import { useGetAllOrderByAdmin } from "../../../hooks/apis/checkout_order";
import { useAcceptOrderByAdmin } from "../../../hooks/apis/checkout_order/useAcceptOrderByAdmin";

const listOrder = [
  {
    id: 1,
    StudentName: "Nguyễn Văn A",
    StudentClass: "12A1",
    StudentId: "B20DCCN001",
    BookInformations: "Sách văn học",
    ReturnDate: "20-10-2022",
    OrderStatus: "cancelled",
  },
  {
    id: 2,
    StudentName: "Nguyễn Văn B",
    StudentClass: "12A2",
    StudentId: "B20DCCN002",
    BookInformations: "Sách kinh tế",
    ReturnDate: "20-10-2022",
    OrderStatus: "indue",
  },
  {
    id: 3,
    StudentName: "Nguyễn Văn C",
    StudentClass: "12A2",
    StudentId: "B20DCCN002",
    BookInformations: "Sách kinh tế",
    ReturnDate: "20-10-2022",
    OrderStatus: "overdue",
  },
  {
    id: 4,
    StudentName: "Nguyễn Văn D",
    StudentClass: "12A6",
    StudentId: "B20DCCN002",
    BookInformations: "Sách luật",
    ReturnDate: "20-10-2022",
    OrderStatus: "completed",
  },
  {
    id: 5,
    StudentName: "Nguyễn Văn E",
    StudentClass: "12A7",
    StudentId: "B20DCCN002",
    BookInformations: "Sách luật",
    ReturnDate: "20-10-2022",
    OrderStatus: "pending",
  },
];
export default function AdminBookOrderPage() {
  //Giới hạn số lượng item trên 1 trang
  const limitPage = useRef(5);

  const [currentPagePagination, setCurrentPagePagination] = useState(1);
  //Lấy giá trị calendar
  const [dateCalendatrVal, setDateCalendatrVal] = React.useState(
    dayjs(format(new Date(), "yyyy-MM-dd"))
  );
  //Chuyển data xuống table
  const [dataOrderTableConvert, setDataOrderTableConvert] = useState(listOrder);

  const [totalPage, setTotalPage] = useState(); // Tổng số trang của table

  // State lưu trữ nội dung filter
  const [filterContent, setFilterContent] = useState({
    dateSort: "Tất cả ngày",
    orderType: listCategoryLevel1[0].value,
    orderStatus: listStatusOrder[0].value,
    classBorrowBook: listClassBookOrder[0].value,
  });

  const { data: dataOrders } = useGetAllOrderByAdmin({
    skip: (currentPagePagination - 1) * limitPage.current,
    limit: limitPage.current,
  });

  const { mutate: acceptOrderBook } = useAcceptOrderByAdmin();

  useEffect(() => {
    const convertOrderDataList = dataOrders?.data?.metadata?.map(
      (dataOrder) => {
        return {
          id: dataOrder._id,
          StudentName: dataOrder?.order_userId?.name,
          StudentClass: dataOrder?.order_userId?.classStudent,
          StudentId: dataOrder?.order_userId?.student_id,
          BookInformations: dataOrder?.order_books
            ?.map(
              (book, bookIndex) => `${book.bookName} - SL: ${book.bookQuantity}`
            )
            .join("\n"),
          BookQuantity: 1,
          ReturnDate: dataOrder?.order_checkout?.returnDate,
          OrderStatus: dataOrder?.order_status,
        };
      }
    );

    setDataOrderTableConvert(convertOrderDataList);

    // Tính tổng số trang
    setTotalPage(
      Math.ceil(dataOrders?.data?.options?.total / limitPage.current)
    );
  }, [dataOrders]);

  //Header cuả table
  const headerGetOrderTable = useCallback(
    () => [
      {
        //ID đơn hàng
        field: "id",
        headerName: "ID",
        width: 60,
      },
      {
        field: "OrderStatus",
        headerName: "Trạng thái",
        width: 140,

        renderCell: (params) => {
          let chipStyle = {};
          let chipValue = params.value;

          switch (params.value) {
            case "cancelled":
              chipValue = "Đã Hủy";
              chipStyle = {
                color: "var(--cancel-color-status)",
                fontWeight: "500",
                backgroundColor: "var(--cancel-color-status-rgba)",
              };
              break;
            case "indue":
              chipValue = "Đang Đọc";
              chipStyle = {
                color: "var(--indue-color-status)",
                fontWeight: "500",
                backgroundColor: "var(--indue-color-status-rgba)",
              };
              break;
            case "overdue":
              chipValue = "Quá Hạn";
              chipStyle = {
                color: "var(--overdue-color-status)",
                fontWeight: "500",
                backgroundColor: "var(--overdue-color-status-rgba)",
              };
              break;
            case "completed":
              chipValue = "Hoàn Thành";
              chipStyle = {
                color: "var(--completed-color-status)",
                fontWeight: "500",
                backgroundColor: "var(--completed-color-status-rgba)",
              };
              break;
            case "pending":
              chipValue = "Chờ Xác Nhận";
              chipStyle = {
                color: "var(--pending-color-status)",
                fontWeight: "500",
                backgroundColor: "var(--pending-color-status-rgba)",
              };
              break;
            default:
              chipStyle = {
                color: "var(--success-color-status)",
                fontWeight: "500",
                backgroundColor: "var(--success-color-status-rgba)",
              };
          }
          if (params.value === "pending")
            return (
              <Chip
                title={"Nhấn vào để xác nhận cho phép mượn sách"}
                label={chipValue}
                variant="filled"
                sx={{
                  ...chipStyle,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "var(--pending-color-status-rgba)",
                  },
                }}
                onClick={() => handleAcceptOrderBook(params.row.id)}
              />
            );

          return (
            <Chip
              title={chipValue}
              label={chipValue}
              variant="filled"
              sx={{ ...chipStyle, userSelect: "none" }}
            />
          );
        },
      },
      {
        field: "StudentName",
        headerName: "Tên Sinh Viên",
        width: 150,
      },
      {
        field: "StudentClass",
        headerName: "Lớp",
        width: 100,
      },
      {
        field: "StudentId",
        headerName: "Mã SV",
        width: 80,
      },

      { field: "BookInformations", headerName: "Thông Tin Sách", width: 200 },
      {
        field: "ReturnDate",
        headerName: "Ngày trả sách",
        width: 120,
      },

      {
        field: "Action",
        headerName: "Action",
        width: 160,
        renderCell: (params) => {
          return (
            <Stack
              direction={"row"}
              height={"100%"}
              gap={"0.25rem"}
              alignItems={"center"}
            >
              <Button
                variant="text"
                color="success"
                sx={{
                  fontSize: "1rem",
                }}
              >
                <FaEdit></FaEdit>
              </Button>
              <Button
                variant="text"
                color="error"
                sx={{
                  fontSize: "1rem",
                }}
                onClick={() => handleDeleteBookInCheckout(params)}
              >
                <RiDeleteBin5Line></RiDeleteBin5Line>
              </Button>
            </Stack>
          );
        },
      },
    ],
    []
  );

  //=================Function area ================

  function handleAcceptOrderBook(payload) {
    // Xác nhận cho phép mượn sách
    acceptOrderBook({
      orderId: payload,
    });
  }

  function handleUpdateQuantityBook(payload) {}

  function handleDeleteBookInCheckout(payload) {}

  function handleSortDateChange(data) {
    // Data nhận vào là object phải convert về dạng string

    const convertDate = dayjs(data).format("DD-MM-YYYY");

    setFilterContent({
      ...filterContent,
      dateSort: convertDate,
    });
    setDateCalendatrVal(data);
  }

  function handleClickOrderBookType(item) {
    console.log("[item:::]", listCategoryLevel1);
    setFilterContent({
      ...filterContent,
      orderType: item.content,
    });
  }

  function handleClickOrderStatus(item) {
    setFilterContent({
      ...filterContent,
      orderStatus: item.content,
    });
  }

  function handleSelectClassBorrowBook(item) {
    setFilterContent({
      ...filterContent,
      classBorrowBook: item.content,
    });
  }

  return (
    <Box id="Admin_Book_Order_Page">
      <Typography component={"h1"} variant="h4" px={4} py={2}>
        Quản lý đơn mượn sách
      </Typography>

      {/*================= Filter Book ===================*/}
      <Stack
        direction={"row"}
        className={style.filterBar}
        px={4}
        width={"100%"}
      >
        <Box
          component={"ul"}
          sx={{
            pl: 0,
            display: "flex",
            gap: "0.5rem",
            "& li": { listStyle: "none" },
            alignItems: "center",
            flexWrap: "wrap",
          }}
          width={"100%"}
        >
          <Box component={"li"} className={style.filterItem}>
            {/* Lọc theo: mới nhất, cũ nhất */}
            <FaFilter></FaFilter>
          </Box>

          {/* -------------Lọc theo ngày------------ */}
          <Box component={"li"} className={style.filterItem}>
            {/* Sử dụng Để hiện thụ popup, có thể cấu hình ở component cha*/}
            <IPopupButton
              // Nội dung popup filter theo ngày là cuốn lịch
              contentPopup={
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={dateCalendatrVal}
                    onChange={(dateVal) => handleSortDateChange(dateVal)}
                  />
                </LocalizationProvider>
              }
              contentButton={
                <Stack direction={"row"} gap={"0.75rem"}>
                  <span>{filterContent.dateSort}</span>
                  <ArrowDropDown></ArrowDropDown>
                </Stack>
              }
              buttonProps={{
                sx: {
                  border: "none",

                  color: "var(--color-primary2)",
                },
              }} // Button Props
              popoverProps={{
                // Popover Props
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
              }}
            ></IPopupButton>
          </Box>

          {/* --------------Lọc theo trạng thái order-------------- */}
          <Box component={"li"} className={style.filterItem}>
            <IMenuListFloat
              fnClickItem={handleClickOrderStatus}
              ListButtonContent={
                <ButtonSortType
                  width={"12rem"}
                  sx={{
                    border: "none",
                    color: "var(--color-primary2)",
                  }}
                  content={filterContent.orderStatus}
                ></ButtonSortType>
              }
              // Chuyển đổi dữ liệu từ listCategoryLevel1 sang dạng object phù hợp
              menuListItems={listStatusOrder.map((item) => ({
                ...item,
                content: item.value,
                // convert value to tag
                tag:
                  item.tag ||
                  slugify(item.value, {
                    lower: true,
                    remove: /[*+~.()'"!:@]/g,
                  }),
              }))}
              itemSelected={filterContent.orderStatus}
            ></IMenuListFloat>
          </Box>

          {/* --------------Lọc theo lớp mượn sách---------------- */}
          <Box component={"li"} className={style.filterItem}>
            <IMenuListFloat
              fnClickItem={handleSelectClassBorrowBook}
              ListButtonContent={
                <ButtonSortType
                  width={"8rem"}
                  sx={{ border: "none", color: "var(--color-primary2)" }}
                  content={filterContent.classBorrowBook}
                ></ButtonSortType>
              }
              // Chuyển đổi dữ liệu từ listCategoryLevel1 sang dạng object phù hợp
              menuListItems={listClassBookOrder.map((item) => ({
                ...item,
                content: item.value,
                // convert value to tag
                tag:
                  item.tag ||
                  slugify(item.value, {
                    lower: true,
                    remove: /[*+~.()'"!:@]/g,
                  }),
              }))}
              itemSelected={filterContent.classBorrowBook}
            ></IMenuListFloat>
          </Box>

          {/* --------------Reset Filter Button------------------- */}
          <Box component={"li"} className={style.filterItem}>
            <Button>Reset Filter</Button>
          </Box>
        </Box>
      </Stack>

      {/*================= TABLE===================*/}
      <Box
        sx={{
          px: 4,
          mt: 4,
        }}
      >
        <ITable
          fncGetCurrentPage={(currentPage) => {
            console.log("Current Page:", currentPage);
            setCurrentPagePagination(currentPage);
          }}
          isCustomFooter={true}
          customTotalPageSize={Math.ceil(
            dataOrders?.data?.options?.total / limitPage.current
          )}
          pageSize={limitPage.current}
          headerList={headerGetOrderTable()}
          dataList={dataOrderTableConvert}
        ></ITable>
      </Box>
    </Box>
  );
}
