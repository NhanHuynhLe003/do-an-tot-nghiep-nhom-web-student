import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function SubmitDialog({
  type = "button",
  fncHandleClickAccept = (data) => console.log(data),
  styleBtnShowInfo = {},
  dialogInfo = {
    contentDialogDesc: "Bạn có chắc chắn xóa tất cả sách đã chọn chứ",
    contentDialogTitle: "Xác nhận xóa tất cả sách đã chọn",
  },
  acceptButtonInfo = {
    title: "Xác nhận",
    color: "primary",
  },
  cancelButtonInfo = {
    title: "Hủy",
    color: "error",
  },
  buttonShowInfo = {
    startIcon: null,
    endIcon: null,
    variant: "outlined",
    color: "error",
    title: "Show Dialog",
  },
  propsButtonShowInfo = {}
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickAccept = () => {
    handleClose();
    // do something
    fncHandleClickAccept(1);
  };

  const handleClickCancel = () => {
    handleClose();
    // do something
    fncHandleClickAccept(0);
  };

  return (
    <React.Fragment>
      <Button
        type={type}
        sx={{
          ...styleBtnShowInfo,
        }}
        variant={buttonShowInfo.variant}
        onClick={handleClickOpen}
        color={buttonShowInfo.color}
        startIcon={buttonShowInfo.startIcon}
        endIcon={buttonShowInfo.endIcon}
        {...propsButtonShowInfo}
      >
        {buttonShowInfo.title}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogInfo.contentDialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogInfo.contentDialogDesc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* Xác Nhận */}
          <Button onClick={handleClickAccept} color={acceptButtonInfo.color}>
            {acceptButtonInfo.title}
          </Button>

          {/* Hủy */}
          <Button
            onClick={handleClickCancel}
            autoFocus
            color={cancelButtonInfo.color}
          >
            {cancelButtonInfo.title}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
