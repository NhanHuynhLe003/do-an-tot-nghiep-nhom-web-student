import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useGetAllStudentByAdmin } from '../../../hooks/apis/students/useGetAllStudentByAdmin';
import { useNavigate } from 'react-router-dom';

export default function AdminNoteManagePage() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [listStudentData, setListStudentData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const rowsPerPage = 20;

  const navigate = useNavigate();

  const { data: studentData, isLoading: studentIsLoading } = useGetAllStudentByAdmin();

  useEffect(() => {
    // Tạo dữ liệu tạm thời để hiển thị, tạo ngẫu nhiên 1 mảng chứa 100 phần tử
    const generatedUsers = Array.from({ length: 100 }, (_, id) => ({
      id,
      name: 'USER ' + id,
      mssv: '03082111' + id,
      email: 'user' + id + '@example.com',
      classStudent: `DTTT${id % 4}A`,
      number: Math.floor(Math.random() * 10) + 1, //Tạo dữ liệu tạm thời để hiển thị random 10
      noteTitle: `Note title ${id}`,
      status: id % 2 === 0 ? 'active' : 'inactive',
    }));
    setUsers(generatedUsers);
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

  //Sau khi tạo dữ liệu tạm thời thì hiển thị ra màn hình
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

  const handleViewStudent = (id) => {
    navigate(`/trang-chinh`);
  };

  if (studentIsLoading) {
    return (
      <Stack
        width={'100%'}
        maxHeight={'80vh'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <CircularProgress sx={{ fontSize: 40 }} />
      </Stack>
    );
  }

  // Lọc sinh viên theo lớp học được chọn
  const filteredUsers = users.filter((user) =>
    selectedClass === '' ? true : user.classStudent === selectedClass
  );

  return (
    <div>
      <TextField
        select
        label="Chọn Lớp học"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        fullWidth
        style={{ marginBottom: '16px' }}
      >
        <MenuItem value="">Tất cả lớp học</MenuItem>
        <MenuItem value="DTTT0A">DTTT0A</MenuItem>
        <MenuItem value="DTTT1A">DTTT1A</MenuItem>
        <MenuItem value="DTTT2A">DTTT2A</MenuItem>
        <MenuItem value="DTTT3A">DTTT3A</MenuItem>
      </TextField>

      <TableContainer component={Paper} style={{ maxHeight: '60vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < users.length}
                  checked={users.length > 0 && selected.length === users.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>MSSV</TableCell>
              <TableCell>Class Student</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Note Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id} selected={selected.indexOf(user.id) !== -1}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.indexOf(user.id) !== -1}
                      onChange={() => handleSelectClick(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mssv}</TableCell>
                  <TableCell>{user.classStudent}</TableCell>
                  <TableCell sx={{ paddingRight: '24px', textAlign: 'center' }}>{user.number}</TableCell>
                  <TableCell>{user.noteTitle}</TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <Chip color="success" label={user.status} />
                    ) : (
                      <Chip color="error" label={user.status} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewStudent(user.id)}
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
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
        }}
      >
        <Button
          onClick={() => handleChangePage(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span>
          Page {page + 1} of {Math.ceil(filteredUsers.length / rowsPerPage)}
        </span>
        <Button
          onClick={() =>
            handleChangePage(
              Math.min(
                Math.ceil(filteredUsers.length / rowsPerPage) - 1,
                page + 1
              )
            )
          }
          disabled={page >= Math.ceil(filteredUsers.length / rowsPerPage) - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
