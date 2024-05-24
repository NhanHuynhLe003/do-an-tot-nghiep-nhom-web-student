import { Box, Stack, Typography } from "@mui/material";
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
import { listCategoryLevel1, listStatusOrder } from "../../../data/arrays";
import slugify from "slugify";
export default function AdminBookOrderPage() {
  //============Handle Filter================
  const [filterContent, setFilterContent] = useState({
    dateSort: "Sắp Xếp",
    orderType: "Thể Loại",
    orderStatus: "Tình Trạng",
  });
  const [dateCalendatrVal, setDateCalendatrVal] = React.useState(
    dayjs("2022-04-17")
  );

  useEffect(() => {
    console.log("[filterContent:::]", filterContent);
  }, [filterContent]);

  //=================Function area ================
  function handleSortDateChange(data) {
    // Data nhận vào là object phải convert về dạng string
    const convertDate = dayjs(data).format("YYYY-MM-DD");

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
    console.log("[item:::]", listCategoryLevel1);
    setFilterContent({
      ...filterContent,
      orderStatus: item.content,
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
          sx={{ display: "flex", gap: "0.5rem", "& li": { listStyle: "none" } }}
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
                  <span>Theo Ngày</span>
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
                  width={"10rem"}
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
              fnClickItem={handleClickOrderStatus}
              ListButtonContent={
                <ButtonSortType
                  width={"10rem"}
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

          {/* --------------Lọc theo lớp mượn sách---------------- */}
          <Box component={"li"} className={style.filterItem}>
            6
          </Box>

          {/* --------------Reset Filter Button------------------- */}
          <Box component={"li"} className={style.filterItem}>
            7
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
