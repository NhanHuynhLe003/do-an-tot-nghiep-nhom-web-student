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
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoTrash } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { commentList } from "../../data/arrays";
import { useCreateComment } from "../../hooks/apis/comment/useCreateComment";
import { useGetComment } from "../../hooks/apis/comment/useGetComment";
import { calculateTimeDifference } from "../../utils";
import ChildCommentBook from "./childCommentBook";
import TextShowMore from "./textShowMore";

export default function CommentBook({
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
  const { data: childrenCommentList } = useGetComment({
    bookId,
    parentCommentId: parentId,
  });
  
  const contentBoxRef = useRef();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isShowCommentBox, setIsShowCommentBox] = React.useState(false);
  const [contentReply, setContentReply] = React.useState("");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [childComments, setChildComments] = useState([]);
  const [isShowComments, setIsShowComments] = useState(false);
  const [isLoadingCommentChildList, setIsLoadingCommentChildList] =
    useState(false);

  const { mutate: createComment } = useCreateComment();
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

  const handleClickBtnShowComments = () => {
    if (!isShowComments) {
      setIsLoadingCommentChildList(true);
      setTimeout(() => {
        setIsLoadingCommentChildList(false);
        setIsShowComments(!isShowComments);
      }, 1000);
    } else {
      setIsShowComments(!isShowComments);
    }
  };

  const handleSubmitComment = () => {
    setIsLoadingComment(true);

    createComment(
      {
        bookId,
        userId,
        content: contentReply,
        parentId: parentId,
      },
      {
        onSuccess: () => {
          setIsLoadingComment(false);
          handleHideCommentBox();
        },
        onError: () => {
          toast.error(
            "Có lỗi xảy ra khi phản hồi bình luận, vui lòng thử lại !"
          );
          setIsLoadingComment(false);
        },
      }
    );
  };

  useEffect(() => {
    if (childrenCommentList) {
      setChildComments(
        childrenCommentList?.data?.metadata?.map((cmt) => {
          const date = new Date(cmt?.updatedAt);
          return {
            ...cmt,
            updatedAt: format(date, "dd-MM-yyyy"),
          };
        })
      );
    }
  }, [childrenCommentList]);

  return (
    <Stack
      direction={"column"}
      sx={{
        boxShadow: "0px 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "0.5rem",
        p: "1rem",
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
              sx={{ width: 40, height: 40, marginRight: "0.5rem" }}
            />
            <Typography
              component={"p"}
              sx={{ fontSize: "1.2rem", color: "var(color-white1)" }}
            >
              {name}
            </Typography>
          </Stack>

          <Typography
            component={"p"}
            sx={{
              color: "var(--color-primary2)",
              opacity: 0.5,
              fontSize: "1rem",
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
            width: 32,
            height: 32,
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

      <TextShowMore text={content} textAlign={"left"}></TextShowMore>

      <Stack direction={"column"} alignItems={"flex-start"}>
        <Button
          sx={{ textTransform: "none", color: "var(--color-primary-2)" }}
          onClick={handleShowCommentBox}
        >
          Phản hồi
        </Button>
        {isLoadingComment && <CircularProgress size={20} />}
        {!isLoadingComment && isShowCommentBox && (
          <Box width={"100%"} mt={2}>
            <Stack direction={"row"} gap={1}>
              <Avatar
                alt="Nguyen Van A"
                src={img}
                sx={{ width: 32, height: 32, marginRight: "0.5rem" }}
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
            <Stack direction={"row"} mt={3} justifyContent={"flex-end"}>
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
      {childComments?.length > 0 && (
        <Button
          sx={{
            width: "fit-content",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            textTransform: "none",
            gap: 1,
          }}
          onClick={handleClickBtnShowComments}
        >
          {isShowComments ? (
            <FaChevronDown size={12} />
          ) : (
            <FaChevronUp size={12} />
          )}
          {`${childComments?.length} phản hồi`}
        </Button>
      )}
      {isLoadingCommentChildList ? (
        <Box
          sx={{
            minHeight: "2rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Stack direction={"column"} mt={2}>
          {isShowComments && (
            <Box
              sx={{
                boxShadow: "0px 0 10px rgba(0, 0, 0, 0.08)",
                borderRadius: "0.35rem",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                my: "0.5rem",
              }}
            >
              {childComments.map((cmt) => (
                <ChildCommentBook
                  key={cmt?._id}
                  parentId={cmt?._id}
                  bookId={bookId}
                  userId={userId}
                  content={cmt?.comment_content}
                  date={cmt?.updatedAt}
                  img={cmt?.comment_userId?.profileImage}
                  name={cmt?.comment_userId?.name}
                ></ChildCommentBook>
              ))}
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  );
}
