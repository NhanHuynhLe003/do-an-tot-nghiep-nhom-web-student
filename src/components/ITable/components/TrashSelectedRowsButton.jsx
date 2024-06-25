import { Button, Stack } from "@mui/material";
import React from "react";
import { DeleteOutline } from "@mui/icons-material";
export default function TrashSelectedRowsButton() {
  return (
    <Stack>
      <Button
        title="Xóa các hàng đã chọn"
        size="small"
        variant="outlined"
        color="error"
        sx={{
          width: "2rem",
        }}
      >
        <DeleteOutline
          color="error"
          className="DeleteOutlineBtnIcon"
        ></DeleteOutline>
      </Button>
    </Stack>
  );
}
