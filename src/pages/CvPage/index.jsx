import { Box, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import IPagination from "../../components/IPagination";
import { useGetCvsByUserId } from "../../hooks/apis/cv/useGetCvsByUserId";

export default function CvPage() {
  const handleClickCvItem = (cvId) => {
    window.location.replace(`/cv/manage/${cvId}`);
  };

  const studentData = JSON.parse(localStorage.getItem("studentData"));

  const pageSize = useRef(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [cvData, setCvData] = useState([]);

  const { data: listCvData } = useGetCvsByUserId({ userId: studentData?._id });

  useEffect(() => {
    setCvData(listCvData?.data?.metadata || []);
  }, [listCvData]);

  return (
    <Box id="Cv_Manage_Page">
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
        Bảng Quản lý CV của tôi
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
                onClick={handleClickCvItem.bind(this, cv._id)}
                key={cv._id}
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
                    {cv?.title}
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
                      HUYNH LE NHAN
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
