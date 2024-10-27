import {
  Avatar,
  Box,
  Button,
  CircularProgress,
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
import { useCreateComment } from "../../hooks/apis/comment/useCreateComment";
import { useDeleteComment } from "../../hooks/apis/comment/useDeleteComment";
import { useGetComment } from "../../hooks/apis/comment/useGetComment";
import { useUpdateComment } from "../../hooks/apis/comment/useUpdateComment";
import SubmitDialog from "../IDialog/SubmitDialog";
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
  commentId = "",
  isRatingMode = false,
  rating = 0,
}) {
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
  const { mutate: deleteCommentById } = useDeleteComment();
  const { mutate: updateComment } = useUpdateComment();
  const { data: childrenCommentList } = useGetComment({
    bookId,
    parentCommentId: parentId,
    isRating: isRatingMode,
  });

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

  const handleDeleteComment = () => {
    deleteCommentById(
      {
        commentId,
        bookId,
      },
      {
        onSuccess: () => {
          toast.success("Xóa bình luận thành công !");
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi xóa bình luận, vui lòng thử lại !");
        },
      }
    );
  };

  const handleClickBtnUpdateComment = () => {};

  const handleUpdateComment = () => {
    updateComment(
      {
        commentId,
        content: contentReply,
        isRating: isRatingMode,
        rating,
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật bình luận thành công !");
        },
        onError: () => {
          toast.error(
            "Có lỗi xảy ra khi cập nhật bình luận, vui lòng thử lại !"
          );
        },
      }
    );
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
        isRating: isRatingMode,
      },
      {
        onSuccess: () => {
          setIsLoadingComment(false);
          handleHideCommentBox();
        },
        onError: () => {
          toast.error(
            `Có lỗi xảy ra khi phản hồi ${
              isRatingMode ? "đánh giá" : "bình luận"
            }, vui lòng thử lại !`
          );
          setIsLoadingComment(false);
        },
      }
    );
  };

  useEffect(() => {
    if (childrenCommentList) {
      setChildComments(
        childrenCommentList?.data?.metadata?.comments?.map((cmt) => {
          const date = new Date(cmt?.createdAt);
          return {
            ...cmt,
            createdAt: format(date, "dd-MM-yyyy"),
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

        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <Typography
            component={"p"}
            sx={{
              color: "var(--color-primary2)",
              opacity: 0.5,
              fontSize: "1rem",
            }}
          >
            {date}
          </Typography>
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
              onClick={handleClickBtnUpdateComment}
              startIcon={<MdEdit />}
              color="inherit"
              size="small"
            >
              Chỉnh sửa
            </Button>
            <SubmitDialog
              fncHandleClickAccept={(status) => {
                if (status) handleDeleteComment();
              }}
              dialogInfo={{
                contentDialogDesc:
                  "Bạn có chắc chắn muốn xóa bình luận này chứ ?",
                contentDialogTitle: "Xác nhận xóa bình luận",
              }}
              acceptButtonInfo={{
                title: "Xác nhận",
                color: "error",
              }}
              cancelButtonInfo={{
                title: "Hủy",
                color: "inherit",
              }}
              buttonShowInfo={{
                startIcon: <IoTrash />,
                variant: "text",
                color: "inherit",
                title: "Xóa",
              }}
              styleBtnShowInfo={{
                width: "100%",
                textAlign: "left",
                justifyContent: "flex-start",
                px: 1,
              }}
            />
          </Popover>
        </Stack>
      </Stack>

      <TextShowMore
        text={content}
        textAlign={"left"}
        isRating={isRatingMode}
        rating={rating}
      ></TextShowMore>

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
                  lineHeight: "14px",
                  overflow: "hidden",
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
                  date={cmt?.createdAt}
                  img={cmt?.comment_userId?.profileImage}
                  name={cmt?.comment_userId?.name}
                  parentName={cmt?.comment_parentId?.comment_userId?.name}
                  isRatingMode={isRatingMode}
                ></ChildCommentBook>
              ))}
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  );
}
