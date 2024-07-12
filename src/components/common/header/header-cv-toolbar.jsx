import { Box, Button, Stack } from "@mui/material";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  cvEditorContentSelector,
  cvIdEditorSelector,
  cvTextSelector,
  listCvUserSelector,
  positionPointerSelector,
} from "../../../redux/selector";
import IMenuListFloat from "../../IMenuListFloat";
import IMenuBarTipTap, {
  ToolTipTaps,
} from "../../ITipTapEditor/IMenuBarTipTap";
import AccountInfo from "./components/account-info";
import style from "./header-book.module.css";
import { useUpdateCv } from "../../../hooks/apis/cv/useUpdateCv";
import { toast } from "react-toastify";

export default function CvHeaderToolBar({ ref, topPositon = 0 }) {
  const menuToolBarRef = useRef(null);
  const [isHoverToolBar, setIsHoverToolBar] = React.useState(false);

  const cvUserList = useSelector(listCvUserSelector);

  const {
    mutate: updateCv,
    data: dataUpdateCv,
    error: errorUpdateCv,
    isLoading: isLoadingUpdateCv,
  } = useUpdateCv();
  const handlePublicCv = useCallback((e) => {
    console.log("Public CV");
  }, []);

  const handleSendCvToStudent = useCallback((e) => {
    console.log("Send CV to Student");
  }, []);

  const handleSaveCv = useCallback(
    (e) => {
      e.preventDefault();

      if (cvUserList[0]) {
        const dataCv = { ...cvUserList[0] };

        const cvPayload = {
          ...dataCv,
          _id: dataCv?.cvId,
          userId: dataCv?.cvUserId,
          boards: dataCv?.boards?.map((board, boardIndex) => {
            return {
              ...board,

              position: { top: boardIndex * 80, left: 0 },
              listDataItem: board?.listDataItem?.map((item, index) => {
                const newItem = { ...item };

                // newItem._id = item?.id;

                delete newItem.id;
                delete newItem.component;

                return newItem;
              }),
            };
          }),
        };

        console.log("PAYLOAD BEFORE UPDATE:::", cvPayload);

        // delete cvPayload?.cvUserId;

        const loadingIdToast = toast.loading("Đang lưu CV...", {
          position: "top-center",
          autoClose: 2000,
        });

        updateCv(cvPayload, {
          onSuccess: (data, variables, context) => {
            toast.dismiss(loadingIdToast);
            toast.success("Lưu CV thành công", {
              position: "top-center",
              autoClose: 2000,
            });
            console.log("RES UPDATE::::", data);
          },
          onError: () => {
            toast.dismiss(loadingIdToast);
            toast.error("Lưu CV thất bại", {
              position: "top-center",
            });
          },
        });

        console.log("Submit Form CV", cvPayload);
      }
    },
    [cvUserList]
  );

  function handleMouseEnter(e) {
    setIsHoverToolBar(true);
  }

  //Lấy ra giá trị editor từ componet ITipTapEditor truyền lên
  const editorSelector = useSelector(cvEditorContentSelector);
  //Lấy ID và set cho menu khi change status
  const idEditorSelector = useSelector(cvIdEditorSelector);
  //Lấy ra nội dung text dạng html
  const cvTextEditorSelector = useSelector(cvTextSelector);
  //Lấy ra vị trí con trỏ
  const positionMousePointer = useSelector(positionPointerSelector);

  useEffect(() => {
    //Xử lý khi data change từ editor thì thanh công cụ cũng phải re-render
    // return () => console.log("Component-Unmount");
  }, [
    editorSelector,
    idEditorSelector,
    cvTextEditorSelector,
    positionMousePointer,
  ]);

  return (
    <header
      className={clsx("animate__animated animate__fadeInDown", style.header, {
        [style.headerOrigin]: topPositon <= 35,
      })}
      ref={ref}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        // mt={3}
        py={1}
        pr={1}
        position={"relative"}
        className={style.headerContainer}
      >
        <Box
          sx={{
            minHeight: "1.5rem",
            minWidth: "10%",
          }}
        >
          {/* Chỉ cần đang hover toolbar hoặc đang focus 1 trong 2 điều kiên đúng là tool
          bar vẫn sẽ hiện */}
          {editorSelector && (
            <Box
              ref={menuToolBarRef}
              sx={{
                width: "fit-content",
                height: "fit-content",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setIsHoverToolBar(false)}
            >
              <IMenuBarTipTap
                id={idEditorSelector}
                editor={editorSelector}
                // Những công cụ sẽ hiện
                tools={[
                  ToolTipTaps.COLOR,
                  ToolTipTaps.BOLD,
                  ToolTipTaps.ITALIC,
                  ToolTipTaps.STRIKE,
                  ToolTipTaps.HEADING1,
                  ToolTipTaps.HEADING2,
                  ToolTipTaps.HEADING3,
                  ToolTipTaps.CODE_BLOCK,
                ]}
              />
            </Box>
          )}
        </Box>
        <Stack direction={"row"} gap={"0.5rem"}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={"0.5rem"}
            maxHeight={"2rem"}
            my={"auto"}
          >
            <Button
              onClick={handlePublicCv}
              type="submit"
              color="warning"
              variant="outlined"
              size="small"
              sx={{
                height: "100%",
              }}
            >
              Public CV
            </Button>
            <Button
              onClick={handleSendCvToStudent}
              type="submit"
              color="success"
              variant="outlined"
              size="small"
              sx={{
                height: "100%",
              }}
            >
              Send To Student
            </Button>
            <Button
              onClick={handleSendCvToStudent}
              type="submit"
              color="error"
              variant="outlined"
              size="small"
              sx={{
                height: "100%",
              }}
            >
              Remove In Student
            </Button>
            <Button
              onClick={handleSaveCv}
              type="submit"
              color="primary"
              variant="contained"
              size="small"
              sx={{
                height: "100%",
              }}
            >
              Save
            </Button>
          </Stack>
          <IMenuListFloat
            ListButtonContent={<AccountInfo></AccountInfo>}
          ></IMenuListFloat>
        </Stack>
      </Stack>
    </header>
  );
}

//=========================================================================
