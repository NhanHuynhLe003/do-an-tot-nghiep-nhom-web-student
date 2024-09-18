import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { toast } from "react-toastify";
import { useSendEmail } from "../../hooks/apis/email/useSendEmail";

export default function SendCvEmailTeacherListBtn({
  isSaveCv = false,
  cvImgUrl = "",
  cvId = "",
  btnProps = {},
  btnContent = "Show List",
  items = [
    {
      id: 1,
      name: "value1",
      email: "Text 1",
    },
    {
      id: 2,
      name: "value2",
      email: "Text 2",
    },
    {
      id: 3,
      name: "value3",
      email: "Text 3",
    },
  ],
  options = {},
}) {

  const HOSTWEBAPP = process.env.REACT_APP_HOST;
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const loadingId = useRef(null);
  const [isListVisible, setIsListVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [loading, setLoading] = useState(false);

  const { mutate: sendEmail } = useSendEmail();

  useEffect(() => {
    if (loading) {
      loadingId.current = toast.loading("Đang xử lý gửi CV cho giáo viên...", {
        position: "top-center",
      });
    } else {
      toast.dismiss(loadingId.current);
    }
  }, [loading]);

  const handleToggle = () => {
    setIsListVisible(!isListVisible);
  };

  const handleSelectionChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const handleSubmit = () => {
    setLoading(true);
    
    if (!selectedItem) {
      setLoading(false);
      toast.error("Vui lòng chọn giảng viên", {
        position: "top-center",
      });
      return;
    }

    if(!isSaveCv){
      setLoading(false);
      toast.error("Vui lòng lưu CV trước khi gửi yêu cầu");
      return;
    }

    const dataItem = JSON.parse(selectedItem);

    sendEmail(
      {
        destinationEmail: dataItem?.email || "0308211150@caothang.edu.vn",
        nameReceiver: dataItem?.name ,
        title: `Sinh Viên ${studentData?.name} nhờ giảng viên hỗ trợ sửa CV`,
        content: `<div> <div>Sinh viên ${studentData?.name} muốn nhờ giảng viên ${dataItem?.name} hỗ trợ sửa CV <a href="${HOSTWEBAPP}/admin/cv-manage/${cvId}">Xem CV</a> </div> <br/> <br/> <img style="width:100%;" src=${cvImgUrl} alt="anh-preview-cv-sinh-vien"/></div>`,
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.success("Gửi yêu cầu thành công", {
            position: "top-center",
          });
        },
        onError: () => {
          setLoading(false);
          toast.error("Gửi yêu cầu thất bại, vui lòng thử lại!", {
            position: "top-center",
          });
        },
      }
    );
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <Button onClick={handleToggle} {...btnProps}>
        {btnContent}
      </Button>
      {isListVisible && (
        <Box
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            mt: 2,
            border: "1px solid #ccc",
            borderRadius: 1,
            position: "absolute",
            top: "3rem",
            width: "fit-content",
            zIndex: 100,
            backgroundColor: "#fff",
            padding: '0.5rem 1rem'
          }}
        >
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Button variant="contained" onClick={handleSubmit}>
              Gửi Yêu Cầu
            </Button>
          </Box>
          <Typography component={"h1"} variant="h6">
            Lựa chọn giảng viên
          </Typography>
          <RadioGroup value={selectedItem} onChange={handleSelectionChange}>
            <List>
              {items?.map((item, index) => (
                <ListItem key={item?.id}>
                  <FormControlLabel
                    control={<Radio />}
                    value={JSON.stringify(item)}
                    label={<ListItemText sx={{
                      textWrap: 'nowrap'
                    }} primary={item?.name} />}
                  />
                </ListItem>
              ))}
            </List>
          </RadioGroup>
        </Box>
      )}
    </div>
  );
};

