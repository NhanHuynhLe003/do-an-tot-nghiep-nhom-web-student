import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { FaCamera } from "react-icons/fa";
import axios from "axios";

function IUploadIconImg({ handleUploadImage = (imgFile) => {}, errors = {} }) {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  // Hàm xử lý khi người dùng thả file vào vùng drop
  const onDrop = useCallback((acceptedFiles) => {
    // Lấy file đầu tiên trong mảng file đã chọn
    const file = acceptedFiles[0];
    if (file) {
      // sau khi file có giá trị thì setAvatar để lưu file đã chọn
      setAvatar(file);

      // Tạo URL preview cho ảnh đã chọn
      const reader = new FileReader();
      reader.onloadend = () => {
        // Khi load ảnh xong, setPreview để lưu url và hiển thị ảnh đã chọn
        setPreview(reader.result);
      };
      // Đọc file ảnh dưới dạng URL
      reader.readAsDataURL(file);
    }
  }, []);

  // Sử dụng hook useDropzone để xử lý việc kéo thả file
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*", // Chỉ chấp nhận file ảnh
  });

  // Xử lý sự kiện khi nhấn nút save avatar để tiến hành upload ảnh lên Cloud trước khi lưu vào database
  const handleSaveClick = async () => {
    const imgFile = avatar;
    //Truyền file ảnh đã chọn lên component cha để xử lý upload ảnh
    handleUploadImage(imgFile);
  };

  return (
    <div style={{ textAlign: "center", width: "fit-content" }}>
      <Stack direction={"row"} gap={0.5} my={3} alignItems={"center"}>
        <div
          {...getRootProps()}
          className="dropzone-img"
          style={{
            padding: "20px",
            cursor: "pointer",
            textAlign: "center",
            height: 200,
            width: 200,
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography
              width={150}
              height={150}
              sx={{
                border: "2px dashed var(--color-primary1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary1)",
                borderRadius: 4,
              }}
            >
              Thả ảnh vào đây...
            </Typography>
          ) : (
            <Box width={"100%"}>
              <Box
                width={150}
                height={150}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ECECEE",
                  borderRadius: 4,
                  mb: 1,
                }}
              >
                <FaCamera fontSize={50}></FaCamera>
              </Box>
              <Typography
                component="p"
                sx={{
                  color: "var(--color-primary1)",
                  fontSize: "0.75rem",
                }}
              >
                Chọn ảnh hoặc kéo thả ảnh vào đây
              </Typography>

              {/* Message bao loi */}
              <Typography
                className="error-message"
                component={"p"}
                sx={{
                  fontSize: "0.75rem",
                }}
                color={"error"}
              >
                {errors && errors.message}
              </Typography>
            </Box>
          )}
        </div>
        <div style={{ marginTop: 20 }}>
          {/* xem ảnh preview trước khi lưu */}
          {preview && (
            <Box width={"100%"}>
              <Box
                width={200}
                height={"auto"}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ECECEE",
                  borderRadius: 4,
                  padding: 2,
                  mb: 1,
                }}
              >
                <img
                  width={"100%"}
                  height={"auto"}
                  alt="img-uploaded"
                  style={{
                    borderRadius: "1rem",
                  }}
                  src={preview}
                ></img>
              </Box>
            </Box>
          )}
        </div>
      </Stack>

      {avatar && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveClick}
          style={{ marginTop: 20 }}
          startIcon={<PhotoCamera />}
        >
          Upload Ảnh
        </Button>
      )}
    </div>
  );
}

export default IUploadIconImg;
