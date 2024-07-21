import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import styles from "./AdminMultiSignUp.module.css";
import { debounce } from "lodash";
import { useStudentSignUp } from "../../../../hooks/apis/access/useStudentSignUp";
import { toast } from "react-toastify";

export default function AdminMultiSignUp() {
  const [rows, setRows] = useState([]);
  const [header, setHeader] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  const { mutate: signUpStudent, isLoading: isLoadingSignup } =
    useStudentSignUp();

  const handleSubmitRegister = debounce(async () => {
    rows.forEach((row) => {
      if (row && Object.values(row).length > 0) {
        signUpStudent(row, {
          onError: () => toast.error(`Đăng ký học sinh: ${row.name} thất bại!`),
        });
      }
    });

    toast.success("Hoàn tất đăng ký danh sách sinh viên!", {
      autoClose: 3000,
      position: "top-center",
    });
    setOpenForm(false);
  }, 300);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);

      console.log("Data:::", data);

      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log("JSON:::", json);

      // Convert the array of arrays to an array of objects
      const headers = json[0];
      setHeader(headers);
      //Header mặc định là hàng đầu tiên nên cắt tại hàng thứ 2
      const rowsData = json.slice(1).map((row) => {
        const rowObject = {};
        row.forEach((cell, index) => {
          rowObject[headers[index]] = cell;
        });
        return rowObject;
      });

      setRows(rowsData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFormOpen = () => setOpenForm(true);
  const handleFormClose = () => setOpenForm(false);

  return (
    <div id="Admin-Multi-Sign-Up" className={styles.container}>
      <Typography
        component={"h1"}
        variant="h4"
        sx={{
          color: "var(--color-primary1)",
          fontWeight: 500,
          textTransform: "capitalize",
          textAlign: "center",
          mt: 4,
        }}
      >
        Đăng ký sinh viên theo danh sách
      </Typography>
      <input
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        id="upload-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-file" className={styles.labelBtnContainer}>
        <Button variant="contained" component="span">
          Upload Excel File
        </Button>
      </label>
      {rows.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            width: "90%",
            margin: "0 auto",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {header?.map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, i) => (
                    <TableCell key={i}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <br />

      {rows && rows.length > 0 && (
        <div className={styles.btnContainer}>
          <Button
            variant="outlined"
            onClick={handleFormOpen}
            sx={{
              width: "fit-content",
              margin: "0 auto",
              transition: "all 0.2s",

              ":hover": {
                backgroundColor: "var(--color-primary1)",
                color: "white",
                border: "none",
                outline: "none",
              },
            }}
          >
            Xác nhận đăng ký
          </Button>
          <Dialog
            open={openForm}
            onClose={handleFormClose}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>Thêm danh sách sinh viên</DialogTitle>
            <DialogContent>
              Bạn có chắc chắn muốn đăng ký danh sách sinh viên này chứ?
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                onClick={handleSubmitRegister}
                disabled={isLoadingSignup}
                startIcon={
                  isLoadingSignup && <CircularProgress></CircularProgress>
                }
              >
                Xác nhận
              </Button>
              <Button onClick={handleFormClose} variant="text" color="error">
                Hủy
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}
