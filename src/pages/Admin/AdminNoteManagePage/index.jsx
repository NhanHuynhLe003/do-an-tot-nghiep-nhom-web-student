import React, { useState, useEffect } from "react";
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
  MenuItem,
  Box,
} from "@mui/material";
import {
  SearchOutlined,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useGetAllStudentByAdmin } from "../../../hooks/apis/students/useGetAllStudentByAdmin";
import { useNavigate } from "react-router-dom";
import { useGetAllNoteByAdmin } from "../../../hooks/apis/notes/useGetAllNoteByAdmin";
import { debounce } from "lodash";

export default function AdminNoteManagePage() {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [listNoteDataStudent, setListNoteDataStudent] = useState([]);
  const [totalNote, setTotalNote] = useState(0);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchData, setSearchData] = useState("");
  const rowsPerPage = 5;

  const navigate = useNavigate();

  // Lấy tất cả note chưa bị xóa trong csdl
  const { data: listAllNoteAdmin, isLoading: listAllNoteAdminIsLoading } =
    useGetAllNoteByAdmin({
      page: page,
      search: searchData,
    });

  useEffect(() => {
    const noteListDataAdmin = listAllNoteAdmin?.data?.metadata?.data;
    const totalNoteAdmin = listAllNoteAdmin?.data?.metadata?.total;
    if (noteListDataAdmin) {
      // Lưu trữ danh sách dữ liệu ADMIN vào list.
      setListNoteDataStudent(noteListDataAdmin);
    }
    if (totalNoteAdmin) {
      setTotalNote(totalNoteAdmin);
    }
  }, [listAllNoteAdmin]);

  const handleSelectClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    console.log("Selected index:", selectedIndex);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleViewStudent = (id) => {
    navigate(`/ghi-chu`);
  };

  const handleSearchNote = debounce((value) => {
    setSearchData(value);
  }, 700);

  if (listAllNoteAdminIsLoading) {
    return (
      <Stack
        width={"100%"}
        maxHeight={"80vh"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ marginTop: 6 }}
      >
        <CircularProgress sx={{ fontSize: 40 }} />
      </Stack>
    );
  }

  return (
    <div>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          marginBottom: 2,
          marginTop: 4,
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        <TextField
          size="small"
          InputProps={{
            endAdornment: <SearchOutlined />,
          }}
          onChange={(e) => handleSearchNote(e.target.value)}
          placeholder="Tìm kiếm theo tên sv hoặc tên note"
        ></TextField>
        <TextField
          select
          size="small"
          label="Chọn Lớp học"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          sx={{
            width: "20%",
          }}
        >
          <MenuItem value="">Tất cả lớp học</MenuItem>
          <MenuItem value="DTTT0A">DTTT0A</MenuItem>
          <MenuItem value="DTTT1A">DTTT1A</MenuItem>
          <MenuItem value="DTTT2A">DTTT2A</MenuItem>
          <MenuItem value="DTTT3A">DTTT3A</MenuItem>
        </TextField>
      </Stack>

      <Box
        sx={{
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        <TableContainer
          component={Paper}
          style={{ maxHeight: "60vh", width: "100%" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>MSSV</TableCell>
                <TableCell>Lớp</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Cấp bậc</TableCell>
                <TableCell>Tình trạng</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* List Note Data Student có tồn tại ko */}
              {listNoteDataStudent &&
                listNoteDataStudent.map((note) => (
                  <TableRow
                    key={note._id}
                    selected={selected.indexOf(note._id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.indexOf(note._id) !== -1}
                        onChange={() => handleSelectClick(note._id)}
                      />
                    </TableCell>
                    <TableCell>{note.note_userId.name}</TableCell>
                    <TableCell>{note.note_userId.email}</TableCell>
                    <TableCell>{note.note_userId.student_id}</TableCell>
                    <TableCell>{note.note_userId.classStudent}</TableCell>
                    <TableCell>{note.note_title}</TableCell>
                    <TableCell>{note.note_level}</TableCell>
                    <TableCell>
                      {note.note_level >= 1 ? (
                        <Chip color="success" label={"ôn tập"} />
                      ) : (
                        <Chip color="warning" label={"thẻ mới"} />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewStudent(note._id)}
                      >
                        <VisibilityIcon />
                      </IconButton>
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
            Trước
          </Button>
          <span>
            Trang {page + 1} trong {Math.ceil(totalNote / rowsPerPage)}
          </span>
          <Button
            onClick={() => handleChangePage(page + 1)}
            // Điều kiện disabled khi page >= tổng số trang - 1
            // disabled={page >= Math.ceil(totalNote / rowsPerPage) - 1}
          >
            Sau
          </Button>
        </div>
      </Box>
    </div>
  );
}
