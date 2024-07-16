import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

export default function ModalTable() {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selected, setSelected] = useState([]);
  const [newClass, setNewClass] = useState("");
  const [classes, setClasses] = useState([
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (isEditing) {
      setConfirmClose(true);
    } else {
      setOpen(false);
    }
  };

  const handleConfirmClose = () => {
    setConfirmClose(false);
    setEditingId(null);
    setEditingName("");
    setIsEditing(false);
    setOpen(false);
  };

  const handleFormOpen = () => setOpenForm(true);
  const handleFormClose = () => setOpenForm(false);

  const handleSelect = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleAddClass = () => {
    setClasses([...classes, { id: classes.length + 1, name: newClass }]);
    setNewClass("");
    handleFormClose();
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
    setOriginalName(name);
    setIsEditing(true);
  };

  const handleSaveClass = () => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === editingId ? { ...cls, name: editingName } : cls
      )
    );
    setEditingId(null);
    setEditingName("");
    setIsEditing(false);
  };

  const handleDeleteClass = (id) => {
    setClassToDelete(id);
    setConfirmDelete(true);
  };

  const confirmDeleteClass = () => {
    setClasses((prevClasses) =>
      prevClasses.filter((cls) => cls.id !== classToDelete)
    );
    setClassToDelete(null);
    setConfirmDelete(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditing) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditing]);

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Quản lý lớp học
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            textTransform: "capitalize",
          }}
        >
          Quản lý danh sách lớp học
        </DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleFormOpen}
          >
            Thêm lớp học mới
          </Button>
          {selected.length > 0 && (
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              color="secondary"
              style={{ marginLeft: "10px" }}
            >
              Xoá các lớp đã chọn
            </Button>
          )}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Lớp</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(cls.id)}
                      onChange={() => handleSelect(cls.id)}
                    />
                  </TableCell>
                  <TableCell>{cls.id}</TableCell>
                  <TableCell>
                    {editingId === cls.id ? (
                      <TextField
                        value={editingName}
                        onChange={(e) => {
                          setEditingName(e.target.value);
                          setIsEditing(true);
                        }}
                      />
                    ) : (
                      cls.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === cls.id ? (
                      <IconButton color="primary" onClick={handleSaveClass}>
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          title="Chỉnh sửa tên lớp học"
                          color="primary"
                          onClick={() => handleEdit(cls.id, cls.name)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          title="Xóa lớp học"
                          color="error"
                          onClick={() => handleDeleteClass(cls.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmClose} onClose={() => setConfirmClose(false)}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nội dung của bạn chưa được lưu, bạn có chắc chắn muốn thoát không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClose(false)}>Hủy</Button>
          <Button
            onClick={() => {
              setEditingName(originalName); // Reset lại tên lớp học
              handleConfirmClose();
            }}
            color="primary"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá lớp học này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Hủy</Button>
          <Button
            onClick={confirmDeleteClass}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openForm} onClose={handleFormClose} maxWidth="xs" fullWidth>
        <DialogTitle>Thêm lớp học mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Class Name"
            fullWidth
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Hủy</Button>
          <Button onClick={handleAddClass} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
