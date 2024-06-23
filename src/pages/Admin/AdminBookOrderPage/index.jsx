import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "./AdminBookOrderPage.module.css";
//===========FILTER===============
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { FaFilter } from "react-icons/fa";
import IPopupButton from "../../../components/IPopupButton";
import { ArrowDropDown } from "@mui/icons-material";
import IMenuListFloat from "../../../components/IMenuListFloat";
import ButtonSortType from "../../../components/bookSearch/buttonSortType";
import {
  listCategoryLevel1,
  listStatusOrder,
  listSortDateReturnBook,
  listClassBookOrder,
} from "../../../data/arrays";
import slugify from "slugify";
export default function AdminBookOrderPage() {
  //============Handle Filter================

  // State lưu trữ nội dung filter
  const [filterContent, setFilterContent] = useState({
    dateSort: "Tất cả ngày",
    orderType: listCategoryLevel1[0].value,
    orderStatus: listStatusOrder[0].value,
    orderDateSortReturn: listSortDateReturnBook[0].value, // [Gần đây, sắp đến hạn, quá hạn]
    classBorrowBook: listClassBookOrder[0].value,
  });

  //Lấy giá trị calendar
  const [dateCalendatrVal, setDateCalendatrVal] = React.useState(
    dayjs("2022-04-17")
  );

  //=================Function area ================
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

  function handleSortDateReturnBook(item) {
    setFilterContent({
      ...filterContent,
      orderDateSortReturn: item.content,
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
          {/* --------------Lọc theo thể loại sách cấp 1(văn học, sức khỏe, tài chính,...) ----------- */}
          <Box component={"li"} className={style.filterItem}>
            <IMenuListFloat
              fnClickItem={handleClickOrderBookType}
              ListButtonContent={
                <ButtonSortType
                  width={"10rem"}
                  sx={{ border: "none", color: "var(--color-primary2)" }}
                  content={filterContent.orderType}
                ></ButtonSortType>
              }
              // Chuyển đổi dữ liệu từ listCategoryLevel1 sang dạng object phù hợp
              menuListItems={listCategoryLevel1.map((item) => ({
                ...item,
                content: item.value,
                // convert value to tag
                tag: slugify(item.value, {
                  lower: true,
                  remove: /[*+~.()'"!:@]/g,
                }),
              }))}
              itemSelected={filterContent.orderType}
            ></IMenuListFloat>
          </Box>

          {/* --------------Lọc theo trạng thái order-------------- */}
          <Box component={"li"} className={style.filterItem}>
            <IMenuListFloat
              fnClickItem={handleClickOrderStatus}
              ListButtonContent={
                <ButtonSortType
                  width={"12rem"}
                  sx={{ border: "none", color: "var(--color-primary2)" }}
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

          {/* --------------Lọc theo hạn trả sách(vừa mượn, gần đến hạn, quá hạn)------------------ */}
          <Box component={"li"} className={style.filterItem}>
            <IMenuListFloat
              fnClickItem={handleSortDateReturnBook}
              ListButtonContent={
                <ButtonSortType
                  width={"10rem"}
                  sx={{ border: "none", color: "var(--color-primary2)" }}
                  content={filterContent.orderDateSortReturn}
                ></ButtonSortType>
              }
              // Chuyển đổi dữ liệu từ listCategoryLevel1 sang dạng object phù hợp
              menuListItems={listSortDateReturnBook.map((item) => ({
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
    </Box>
  );
}
