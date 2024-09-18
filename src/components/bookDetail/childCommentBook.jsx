import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Input,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoTrash } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { useCreateComment } from "../../hooks/apis/comment/useCreateComment";
import { calculateTimeDifference } from "../../utils";
import TextShowMore from "./textShowMore";

export default function ChildCommentBook({
  img = "/imgs/avatar-user.jpg",
  name = "Nguyễn Văn A",
  date = "20-03-2024",
  content = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque voluptate assumenda esse dolore maiores ea laudantium a, quisquam nam fugit. Recusandae enim aut deserunt! Quis placeat blanditiis voluptas asperiores culpa.
  Molestias, sint impedit! Nostrum maiores, architecto labore sapiente amet repellendus cupiditate commodi omnis harum inventore eum ipsa aspernatur atque excepturi praesentium esse fugit corporis! Iusto optio hic laudantium est ullam!
  Officiis laudantium aspernatur eaque maiores commodi distinctio molestias vitae voluptatibus eveniet! Alias sunt laboriosam itaque accusamus quaerat? Quam atque, vero minima illo, unde repudiandae quas rerum quis adipisci nulla repellendus!
  Ducimus animi fugit excepturi magni ratione, odio maiores fugiat! Sit quaerat natus quam velit tempore temporibus, deleniti ea voluptatem tempora qui minus laboriosam dolores. Saepe nulla reiciendis illo! Minima, doloribus?`,
  parentId = "",
  bookId = "",
  userId = "",
}) {

  const contentBoxRef = React.useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isShowCommentBox, setIsShowCommentBox] = React.useState(false);
  const [contentReply, setContentReply] = React.useState("");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const {mutate: createComment} = useCreateComment();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleShowCommentBox = () => {
    setIsShowCommentBox(!isShowCommentBox);
  };

  const handleHideCommentBox = () => {
    setIsShowCommentBox(false);
    setContentReply("");
  };

  const handleChangeContentReply = (e) => {
    const textarea = contentBoxRef.current;
    // Đặt chiều cao về auto để reset trước khi tính toán kích thước
    textarea.style.height = "auto";

    // Đặt chiều cao mới dựa trên chiều cao cuộn (scrollHeight)
    textarea.style.height = `${textarea.scrollHeight}px`;
    setContentReply(e.target.value);
  };

  const handleClickShowAdvanceSetting = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAdvanceSetting = () => {
    setAnchorEl(null);
  };

  const handleSubmitComment = () => {
    setIsLoadingComment(true);

    createComment({
      bookId,
      userId,
      content: contentReply,
      parentId: parentId
    }, {
      onSuccess: () => {
        setIsLoadingComment(false);
        handleHideCommentBox();
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi phản hồi bình luận, vui lòng thử lại sau");
        setIsLoadingComment(false);
      }
    })
  }


  return (
    <Stack
      direction={"column"}
      sx={{
        p: "1rem",
        mb: "0.75rem",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack direction={"row"} alignItems={"center"} gap={2}>
          <Stack direction={"row"} alignItems={"center"}>
            <Avatar
              alt="Nguyen Van A"
              src={img || "/imgs/avatar-user.jpg"}
              sx={{ width: 28, height: 28, marginRight: "0.5rem" }}
            />
            <Typography
              component={"p"}
              sx={{ fontSize: "1rem", color: "var(color-white1)" }}
            >
              {name}
            </Typography>
          </Stack>

          <Typography
            component={"p"}
            sx={{
              color: "var(--color-primary2)",
              opacity: 0.5,
              fontSize: "0.8rem",
            }}
          >
            {calculateTimeDifference(date)} ngày trước
          </Typography>
        </Stack>

        <button
          aria-describedby={id}
          variant="contained"
          onClick={handleClickShowAdvanceSetting}
          style={{
            backgroundColor: "transparent",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            width: 28,
            height: 28,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HiDotsVertical />
        </button>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseAdvanceSetting}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Button
            variant="text"
            sx={{
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start",
              px: 1,
            }}
            startIcon={<MdEdit />}
            color="inherit"
            size="small"
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="text"
            sx={{
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start",
              px: 1,
            }}
            startIcon={<IoTrash />}
            color="inherit"
            size="small"
          >
            Xóa
          </Button>
        </Popover>
      </Stack>

      <TextShowMore text={content} textAlign={"left"} fontSize="0.9rem"></TextShowMore>

      <Stack direction={"column"} alignItems={"flex-start"}>
        <Button sx={{ textTransform: "none" , color: 'var(--color-primary-2)', fontSize: '0.7rem'}} onClick={handleShowCommentBox}>
          Phản hồi
        </Button>
        {isLoadingComment && <CircularProgress size={20} />}
        {!isLoadingComment && isShowCommentBox && (
          <Box width={"100%"} mt={2}>
            <Stack direction={"row"} gap={1}>
            <Avatar
              alt="Nguyen Van A"
              src={studentData?.profileImage || "/imgs/avatar-user.jpg"}
              sx={{ width: 28, height: 28, marginRight: "0.35rem" }}
            />
            <textarea
                ref={contentBoxRef}
                style={{
                  width: "100%",
                  resize: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                  background: "transparent",
                  outline: "none",
                  paddingBottom: "0",
                  lineHeight: '14px',
                  overflow: 'hidden'
                }}
                onChange={handleChangeContentReply}
                placeholder="Nhập nội dung phản hồi...."
              />
            </Stack>
            <Stack direction={"row"} mt={3} justifyContent={'flex-end'}>
              <Button
                onClick={handleHideCommentBox}
                type="button"
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: 8, outline: "none", border: "none" }}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="contained"
                color={contentReply ? "primary" : "inherit"}
                disabled={contentReply?.length === 0}
                sx={{ borderRadius: 8, outline: "none", border: "none" }}
                onClick={handleSubmitComment}
              >
                Phản hồi
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}
