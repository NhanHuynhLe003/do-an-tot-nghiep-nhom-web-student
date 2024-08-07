import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import CustomeFooter from "./components/CustomFooterTable";

//Dữ liệu tạm thời
const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70, //Chiều rộng cột
    renderCell: (params) => <Button>{params.value}</Button>, //Custom giá trị trả về thành jsx
  },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

//Tạo một context để truyền dữ liệu về pagination từ con lên cha
export const IPaginationTableCustomContext = React.createContext();

// Tạo một hàm component để render mỗi hàng
export default function ITable({
  headerList = columns,
  dataList = rows,
  fncGetListRowSelected = (bookIds) => {},
  fncGetCurrentPage = (currentPage) => {},
  rowHeight = 70,
  isHideFooterSelectedRowCount = true,
  isShowPageSizeOpt = false,
  maxHeightTable = 370,
  minHeightTable = 70,
  isCustomFooter = false,
  pageSize = 5, //Số lượng hàng mỗi trang
  localeTextNoRow = "Chưa có sách trong giỏ hàng",
  customTotalPageSize = 10,
}) {
  function getListRowSelected(params) {
    fncGetListRowSelected([...params]);
  }

  const [pagePagination, setPagePagination] = React.useState({
    page: 1,
    pageSize: 20,
    customTotalPageSize: customTotalPageSize,
  });

  React.useEffect(() => {
    fncGetCurrentPage(pagePagination.page);
  }, [pagePagination]);

  return (
    <DataGrid
      className="DATA_GRID_TABLE"
      // onCellClick={(params) => console.log(params.row)}
      onRowSelectionModelChange={(params) => getListRowSelected(params)} //Lấy ra danh sach id các hàng được chọn
      disableRowSelectionOnClick //Không chọn hàng khi click vào hàng
      rowHeight={rowHeight}
      rows={dataList}
      columns={headerList}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: pageSize },
        },
      }}
      pageSizeOptions={isShowPageSizeOpt && [5, 10, 20]}
      checkboxSelection
      hideFooterSelectedRowCount={isHideFooterSelectedRowCount}
      sx={{
        // maxHeight: maxHeightTable,
        // overflowY: "auto",

        "& .MuiDataGrid-virtualScrollerContent": {
          minHeight: minHeightTable,
        },

        "& .MuiDataGrid-cell:focus-within": {
          outline: "none !important",
        },
      }}
      // Custom footer
      slots={
        isCustomFooter && {
          pagination: () => (
            <IPaginationTableCustomContext.Provider
              value={{ pagePagination, setPagePagination }}
            >
              <CustomeFooter />
            </IPaginationTableCustomContext.Provider>
          ),
        }
      }
      //Hiển thị text khi không có dữ liệu
      localeText={{ noRowsLabel: localeTextNoRow }}
    />
  );
}
