import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteBookInCart } from "../../../../hooks/apis/cart/useDeleteBookInCart";
import { useGetBooksInCart } from "../../../../hooks/apis/cart/useGetBooksInCart";
import { useUpdateBookQuantiyInCart } from "../../../../hooks/apis/cart/useUpdateBookQuantityInCart";
import SubmitDialog from "../../../IDialog/SubmitDialog";
import IQuantityInput from "../../../IQuantityInput";
import ITable from "../../../ITable/ITable";

export default function CartBookOrder({
  handleGetCartProductCount = (count) => {
    console.log("handleGetCartProductCount:::", count);
  },
}) {
  const navigate = useNavigate();

  // Lấy thông tin sinh viên login hiện tại từ localStorage
  const dataStudent = JSON.parse(localStorage.getItem("studentData"));

  // Trigger API xóa sách khỏi giỏ hàng
  const { mutate: deleteBookInCart, data: dataDeleteBookInCartData } =
    useDeleteBookInCart();

  // Trigger API lấy danh sách sách trong giỏ hàng
  const { data: dataBooksInCartData } = useGetBooksInCart({
    cartUserId: dataStudent?._id,
  });

  //Trigger API cập nhật số lượng sách trong giỏ hàng
  const {
    mutate: updateBookQuantityInCart,
    data: dataUpdateBookQuantityInCartData,
  } = useUpdateBookQuantiyInCart();

  //=============STATE================
  const [cartDataBookList, setCartDataBookList] = React.useState([]);
  const [bookCartIdsSelect, setBookCartIdsSelect] = React.useState([]);

  //Header table cart, chỉ cập nhật khi có sự thay đổi về dữ liệu sách trong giỏ hàng, nếu dùng useRef thì sẽ không cập nhật được
  const headerGetTableCart = useCallback(
    () => [
      {
        field: "BookImage",
        headerName: "Ảnh",
        width: 70,
        renderCell: (params) => (
          // Giup render the anh book html trong cell
          <img
            src={params.value}
            alt="Book"
            style={{ width: "100%", height: "100%", padding: "0.25rem 0.1rem" }}
          />
        ),
      },
      { field: "BookName", headerName: "Tên", width: 100 },
      {
        field: "BookQuantity",
        headerName: "Số lượng",
        width: 100,
        renderCell: (params) => {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <IQuantityInput
                id={params?.id}
                value={params?.value}
                fnGetValue={(payload) => handleUpdateQuantityBook(payload)}
              ></IQuantityInput>
            </Box>
          );
        },
      },
      {
        field: "BookAction",
        headerName: "Action",
        width: 90,
        renderCell: (params) => {
          function handleDelBook(payload) {
            const { params, data } = payload;

            if (data) {
              const bookId = params?.id;
              const studentData = JSON.parse(
                localStorage.getItem("studentData")
              );
              // Xử lý xóa sách đã chọn khỏi giỏ hàng
              deleteBookInCart({
                userId: studentData._id,
                bookId: bookId,
              });
            }
          }
          
          return (
            <Box>
              <SubmitDialog
                styleBtnShowInfo={{
                  color: "var(--color-primary2)",
                  backgroundColor: "#fff",
                  boxShadow: "none",

                  padding: "0.25rem 0rem",
                  "&:hover": {
                    color: "var(--color-primary2)",
                    backgroundColor: "#fff",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  },
                }}
                buttonShowInfo={{
                  variant: "contained",
                  color: "primary",
                  title: "X",
                }}
                dialogInfo={{
                  contentDialogTitle: "Xác nhận xóa sách khỏi giỏ hàng",
                  contentDialogDesc:
                    "Bạn có chắc chắn xóa quyển sách này khỏi giỏ hàng chứ?",
                }}
                fncHandleClickAccept={(data) => handleDelBook({ params, data })}
              ></SubmitDialog>
            </Box>
          );
        },
      },
    ],
    [
      cartDataBookList,
      dataBooksInCartData,
      dataUpdateBookQuantityInCartData,
      dataDeleteBookInCartData,
      bookCartIdsSelect,
    ]
  );

  useEffect(() => {
    const listBookInCart = dataBooksInCartData?.data?.metadata;
    handleGetCartProductCount(listBookInCart?.length || 0);
    if (!!listBookInCart) {
      const newCartDataBookList = listBookInCart.map((book, index) => {
        return {
          id: book?.bookId?._id || Date.now() + index,
          BookImage: book?.bookId?.book_thumb,
          BookName: book?.bookId?.book_name,
          BookQuantity: book?.quantity,
        };
      });

      setCartDataBookList(newCartDataBookList);
    }
  }, [dataBooksInCartData]);

  function handleGetListRowSelected(bookIds) {
    setBookCartIdsSelect(bookIds);
  }

  function handleDeleteBooksSelectedInCart(data) {
    if (data === 1) {
      const studentData = JSON.parse(localStorage.getItem("studentData"));

      // Xử lý xóa các quyển sách đã chọn khỏi giỏ hàng
      bookCartIdsSelect.forEach((bookId) => {
        deleteBookInCart({
          userId: studentData._id,
          bookId: bookId,
        });
      });
    }
  }

  function handleUpdateQuantityBook(payload) {
    const { id, value } = payload;
    // Xử lý cập nhật số lượng sách đã chọn trong giỏ hàng
    const previousBookData = cartDataBookList.find((book) => book.id === id);
    updateBookQuantityInCart({
      userId: dataStudent._id,
      book: {
        bookId: id,
        quantity: value - previousBookData?.BookQuantity || 0,
        // VD: {bookId: "123", quantity: 3} mà ban đầu quantity = 5 => output: {bookIdL "123", quantity: 5+3 = 8} => nếu giảm thì truyền số âm vào
      },
    });
  }

  return (
    <Box
      className={"Cart_Book_Order"}
      sx={{
        position: "relative",
        width: "fit-content",
        height: "fit-content",
        "@media (max-width: 600px)": {
          width: "94%",
          margin: "0 auto",
        },
      }}
    >
      {bookCartIdsSelect.length > 0 && (
        <div title="Xóa các quyển sách đã chọn">
          <SubmitDialog
            styleBtnShowInfo={{
              position: "absolute",
              bottom: "2.75rem",
              left: "1rem",
              zIndex: 10,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "red",
                color: "white",
              },
            }}
            buttonShowInfo={{
              variant: "outlined",
              color: "error",
              title: <DeleteIcon></DeleteIcon>,
            }}
            dialogInfo={{
              contentDialogTitle: "Xóa các sách đã chọn",
              contentDialogDesc:
                "Bạn có chắc chắn xóa các quyển sách đã chọn này khỏi giỏ hàng chứ?",
            }}
            fncHandleClickAccept={(data) =>
              handleDeleteBooksSelectedInCart(data)
            }
          ></SubmitDialog>
        </div>
      )}

      <ITable
        pageSize={5}
        headerList={headerGetTableCart()}
        dataList={cartDataBookList}
        fncGetListRowSelected={handleGetListRowSelected}
      ></ITable>

      {cartDataBookList.length > 0 && (
        <Button
          sx={{
            display: "flex",
            mx: "auto",
            my: "0.5rem",
          }}
          onClick={() => navigate(`/checkout/${dataStudent?._id}`)}
        >
          Kiểm tra đơn mượn sách
        </Button>
      )}
    </Box>
  );
}
