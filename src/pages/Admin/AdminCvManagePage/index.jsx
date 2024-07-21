import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useGetAllCvByAdmin } from "../../../hooks/apis/admin/useGetAllCvByAdmin";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import IPagination from "../../../components/IPagination";
import { useCreateEmptyCv } from "../../../hooks/apis/admin/useCreateEmptyCv";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AdminCvManagePage() {
  const navigate = useNavigate();
  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const pageSize = useRef(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [cvData, setCvData] = useState([]);

  useEffect(() => {
    console.log("CURRENT PAGE:::", currentPage);
  }, [currentPage]);

  const {
    data: dataCv,
    error: errorCv,
    isLoading: isLoadingCv,
  } = useGetAllCvByAdmin({ page: currentPage, pageSize: pageSize.current });

  const {
    mutate: createNewCv,

    data: dataCreateCv,
    error: errorCreateCv,
    isLoading: isLoadingCreateCv,
  } = useCreateEmptyCv();

  useEffect(() => {
    console.log("DATA CV:::", dataCv);
    setCvData(dataCv?.data?.metadata || []);
  }, [dataCv]);

  if (isLoadingCv)
    return (
      <Stack direction={"column"} width={"100%"} minHeight={"80vh"} justi>
        <CircularProgress
          size={"small"}
          sx={{
            fontSize: "2rem",
          }}
        ></CircularProgress>
      </Stack>
    );

  async function handleCreatNewCvAndDirect() {
    const userId = studentData?._id;
    if (userId) {
      const toastLoading = toast.loading("Đang tạo CV mới...", {
        position: "top-center",
      });
      await createNewCv(
        { userId },
        {
          onSuccess: (data, variables, context) => {
            console.log("DATA CREATE CV:::", data?.metadata?._id);
            const newIdCv = data?.metadata?._id;
            toast.dismiss(toastLoading);
            toast.success("Tạo CV mới thành công", {
              position: "top-center",
              autoClose: 2000,
            });

            // navigate(`/admin/cv-manage/${newIdCv}`);
            window.location.href = `/admin/cv-manage/${newIdCv}`;
          },
        }
      );
    }
  }

  const handleClickCv = (cvId) => {
    window.location.href = `/admin/cv-manage/${cvId}`;
  };
  return (
    <Box id="Admin Cv Manage Page">
      <Typography
        width={"84%"}
        margin={"2rem auto 0 auto"}
        component={"h1"}
        variant="h4"
        fontWeight={600}
        color={"var(--color-primary2)"}
        textTransform={"capitalize"}
        sx={{ opacity: 0.8 }}
      >
        Bảng Quản lý CV
      </Typography>
      <Box
        sx={{
          width: "84%",
          minHeight: "80vh",
          margin: "4rem auto",
          background: "#fff",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
          borderRadius: 4,
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Stack direction={"row"} gap={"0.75rem"}>
            <input
              style={{
                padding: "0.5rem 0.75rem",
                border: "none",
                outline: "none",
                borderRadius: 16,
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              }}
              placeholder="Tìm kiếm CV...."
            />
          </Stack>
          <Stack direction={"row"} gap={"1rem"}>
            <Button
              size="large"
              type="button"
              variant="contained"
              color="success"
            >
              Thùng rác
            </Button>
            <Button
              onClick={handleCreatNewCvAndDirect}
              size="large"
              type="button"
              variant="contained"
            >
              ADD CV
            </Button>
          </Stack>
        </Stack>
        <br />
        <br />
        <Stack
          className="Cv_Container"
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"flex-start"}
          gap={{ md: 4, sm: 3, xs: 2 }}
        >
          {cvData &&
            cvData?.result &&
            cvData?.result.map((cv, index) => (
              <Stack
                key={cv._id}
                onClick={() => handleClickCv(cv._id)}
                title={"Xem chi tiết CV"}
                className={clsx("CV_CARD")}
                direction={"column"}
                width={{ md: "22%", xs: "46%", sm: "28%" }}
                sx={{
                  boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",

                  transition: "all 0.3s",
                  ":hover": {
                    boxShadow: "0 0 12px rgba(0, 0, 0, 0.4)",
                    cursor: "pointer",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <img
                    width="100%"
                    height={"auto"}
                    alt={"cv-img-" + cv._id}
                    src={cv.thumbnail || "https://placehold.co/200x300"}
                  ></img>
                </Box>
                <Stack
                  direction={"column"}
                  sx={{
                    padding: "0.5rem",
                  }}
                >
                  <Typography fontWeight={"500"} my={1}>
                    {cv?.boards[0]?.name}
                  </Typography>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography
                      fontSize={"0.8rem"}
                      sx={{
                        color: "var(--color-primary2)",
                        opacity: 0.8,
                        fontWeight: 500,
                      }}
                    >
                      {cv?.cvUserId?.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: "var(--color-primary2)",
                        opacity: 0.6,
                        fontWeight: 500,
                      }}
                      fontSize={"0.65rem"}
                    >
                      {format(parseISO(cv?.updatedAt), "dd-MM-yyyy")}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            ))}
        </Stack>
        <br />
        <br />
        <br />
        <Stack direction={"column"} alignItems={"center"}>
          <IPagination
            getPageNotControl={(page) => setCurrentPage(page)}
            currentPage={currentPage}
            totalPage={Math.floor(cvData?.total / pageSize.current) + 1}
          ></IPagination>
        </Stack>
      </Box>
    </Box>
  );
}
