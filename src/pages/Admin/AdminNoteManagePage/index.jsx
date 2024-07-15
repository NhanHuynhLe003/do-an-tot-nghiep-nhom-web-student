// UserManagementTable.js
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { useGetAllStudentByAdmin } from "../../../hooks/apis/students/useGetAllStudentByAdmin";
import { useNavigate } from "react-router-dom";

export default function AdminNoteManagePage() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [listStudentData, setListStudentData] = useState([]);
  const rowsPerPage = 20;

  const navigate = useNavigate();

  const { data: studentData, isLoading: studentIsLoading } =
    useGetAllStudentByAdmin();

  // useEffect(() => {
  //   if (studentData && studentData.data && studentData.data.metadata?.result) {
  //     const convertStudentDataTableDisplay =
  //       studentData.data.metadata?.result.map((student) => {
  //         return {
  //           id: student._id,
  //           name: student.name,
  //           email: student.email,
  //           classStudent: student.classStudent,
  //           bookReaded: student.books_readed?.length,
  //           dateOfbirth: format(new Date(student.date_of_birth), "dd/MM/yyyy"),
  //           role:
  //             student.roles[0] === process.env.REACT_APP_STUDENT_ROLE
  //               ? "Student"
  //               : "Admin",
  //           status: student.status,
  //         };
  //       });

  //     console.log(
  //       "convertStudentDataTableDisplay",
  //       convertStudentDataTableDisplay
  //     );

  //     setUsers(convertStudentDataTableDisplay);
  //   }
  // }, [studentData]);

  useEffect(() => {
    // Mock 20 users
    const generatedUsers = Array.from({ length: 20 }, (_, id) => ({
      id,
      name: "USER " + id,
      email: "user" + id + "@example.com",
      classStudent: `DTTT${id % 4}A`,
      bookReaded: Math.floor(Math.random() * 100),
      dateOfbirth: format(new Date(2003, 0, 1), "dd/MM/yyyy"),
      role: id % 2 === 0 ? "user" : "admin",
      status: id % 2 === 0 ? "active" : "inactive",
    }));
    setUsers(generatedUsers);
  }, []);

  useEffect(() => {
    // Fetch user data from API
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(users.map((user) => user.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleAddNewStudent = () => {
    navigate("/admin/user/sign-up");
  };

  const handleDeleteAll = () => {
    // Implement delete all functionality
    console.log("Delete all selected items:", selected);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  if (studentIsLoading) {
    return (
      <Stack
        width={"100%"}
        maxHeight={"80vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <CircularProgress
          sx={{
            fontSize: 40,
          }}
        ></CircularProgress>
      </Stack>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px",
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
        >
          {selected.length > 0 && (
            <Button variant="contained" color="error" onClick={handleDeleteAll}>
              Xóa tất cả
            </Button>
          )}
          <Button
            variant="contained"
            sx={{
              background: "var(--color-primary1)",
            }}
            onClick={handleAddNewStudent}
          >
            Thêm Sinh Viên
          </Button>
          <Button variant="contained" color="success">
            Thêm Danh Sách Sinh Viên
          </Button>
          <Button variant="contained" color="warning">
            Danh Sách Lớp
          </Button>
        </Stack>
        <TextField
          size="small"
          label="Search"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <FaSearch color="var(--color-primary2)" opacity={0.6} />
            ),
          }}
        />
      </div>
      <TableContainer component={Paper} style={{ maxHeight: "60vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < users.length
                  }
                  checked={users.length > 0 && selected.length === users.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Class Student</TableCell>
              <TableCell>Books Read</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow
                  key={user.id}
                  selected={selected.indexOf(user.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.indexOf(user.id) !== -1}
                      onChange={() => handleSelectClick(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.classStudent}</TableCell>
                  <TableCell>{user.bookReaded}</TableCell>
                  <TableCell>{user.dateOfbirth}</TableCell>
                  <TableCell>{user?.role}</TableCell>
                  <TableCell>
                    {user.status === "active" ? (
                      <Chip color="success" label={user.status}></Chip>
                    ) : (
                      <Chip color="error" label={user.status}></Chip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction={"row"} gap={1} alignItems={"center"}>
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px",
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
        }}
      >
        <Button
          onClick={() => handleChangePage(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span>
          Page {page + 1} of {Math.ceil(users.length / rowsPerPage)}
        </span>
        <Button
          onClick={() =>
            handleChangePage(
              Math.min(Math.ceil(users.length / rowsPerPage) - 1, page + 1)
            )
          }
          disabled={page >= Math.ceil(users.length / rowsPerPage) - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
