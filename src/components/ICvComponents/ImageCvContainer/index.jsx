import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  dropzoneStyle,
  img,
  thumb,
  thumbInner,
  thumbsContainer,
} from "./styleUploadImage";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { currentBoardInViewSelector } from "../../../redux/selector";
import CvSlice from "../../../redux/slices/CvSlice";
import {
  sizeEditorDefault,
  sizeImageDndDefault,
  sizeShapeElementDefault,
} from "../../../constants";
import axiosInstance from "../../../apis/axiosConfig";
import { toast } from "react-toastify";

const TRANSLATE_NUM = 0.5;
const initCoordinate = 500;
const IUploadImageDropZone = () => {
  const [images, setImages] = useState([]);

  //Lấy id của trang hiện tại tu url
  const { id: idCurrentPageCv } = useParams();
  const dispatch = useDispatch();
  //Vị trí hiện tại của Board, dựa trên thanh scroll
  const currentBoardSelectorInView = useSelector(currentBoardInViewSelector);
  function handleClickAddImage({ imgName, src, styleValue }) {
    console.log("handleClickAddImage", imgName, src, styleValue);
    const cvId = idCurrentPageCv;
    const idItemDrag = uuidv4();
    const boardId = currentBoardSelectorInView.id;

    const dataItem = {
      boardId: boardId,
      id: idItemDrag,
      role: "ALL", //["ONLY_READ", "ONLY_WRITE", "ALL"]
      itemType: "image",

      coordinate: {
        x: initCoordinate - TRANSLATE_NUM * sizeImageDndDefault.width,
        y: initCoordinate - TRANSLATE_NUM * sizeImageDndDefault.height,
        x2:
          initCoordinate +
          sizeImageDndDefault.width -
          TRANSLATE_NUM * sizeImageDndDefault.width,
        y2: initCoordinate - TRANSLATE_NUM * sizeImageDndDefault.height,
        x3:
          initCoordinate +
          sizeImageDndDefault.width -
          TRANSLATE_NUM * sizeImageDndDefault.width,
        y3:
          initCoordinate +
          sizeImageDndDefault.height -
          TRANSLATE_NUM * sizeImageDndDefault.height,
        x4: initCoordinate - TRANSLATE_NUM * sizeImageDndDefault.width,
        y4:
          initCoordinate +
          sizeImageDndDefault.height -
          TRANSLATE_NUM * sizeImageDndDefault.height,
        x5:
          initCoordinate +
          sizeImageDndDefault.width / 2 -
          TRANSLATE_NUM * sizeImageDndDefault.width,
        y5:
          initCoordinate +
          sizeImageDndDefault.height / 2 -
          TRANSLATE_NUM * sizeImageDndDefault.height,
      },
      sizeItem: sizeImageDndDefault,
      rotateDeg: 0,
      layer: 1,
      color: "",

      // Props của component con
      ChildComponentProps: {
        id: idItemDrag,
        imgName,
        src,
        styleValue,
      },
    };

    dispatch(
      CvSlice.actions.setAddDragItemIntoBoard({
        cvId,
        boardId,
        dataItem,
      })
    );
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    // Thêm list ảnh vào mảng images
    setImages((prevImages) => [
      ...prevImages,
      ...acceptedFiles.map((file) =>
        // Tạo link preview cho ảnh, nếu sau này upload api sẽ thay bằng link thực tế
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const refImage = useRef(null);

  return (
    <div
      className="container"
      style={{ marginTop: "1rem", marginBottom: "2rem" }}
    >
      <div {...getRootProps({ className: "dropzone" })} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <p
          style={{
            width: "100%",
            whiteSpace: "normal", //Xuống dòng khi text quá dài
          }}
        >
          Nhấn hoặc Kéo ảnh vào đây
        </p>
      </div>
      <h1
        style={{
          fontSize: "1.35rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
          marginTop: "0.5rem",
          color: "var(--color-primary2)",
        }}
      >
        Ảnh của bạn
      </h1>
      {/* Khu vực chứa ảnh tạm đã thêm vào */}
      <div style={thumbsContainer}>
        {images.map((file, index) => (
          <div
            className="Image_Upload_Container"
            key={index}
            style={thumb}
            ref={refImage}
            onClick={async () => {
              const formData = new FormData();
              const extension = file?.name.split(".").pop();
              const newFileName = `${Date.now()}.${extension}`;
              const renamedFile = new File([file], newFileName, {
                type: file.type,
              });

              formData.append("uploadFileKey", renamedFile);

              const imageUpload = await axiosInstance.post(
                "/v1/api/upload/static/img?nameStorage=cvs",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              toast.success("Upload ảnh thành công", {});

              console.log("IMAGE UPLOAD:::", imageUpload?.data?.metadata);

              //Lấy ra kích thươc item hiện tại
              const currentFileName = file?.name.slice(
                0,
                file.name.indexOf(".")
              );

              const sizeImage = refImage.current?.getBoundingClientRect();
              handleClickAddImage({
                imgName: currentFileName || uuidv4(),
                src: file.preview, //Lấy ảnh tạm trước upload ảnh thật sau
                styleValue: {
                  width: sizeImage.width || "100px",
                  height: sizeImage.height || "100px",
                },
              });
            }}
          >
            <div style={thumbInner}>
              <img src={file.preview} style={img} alt={`preview-${index}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IUploadImageDropZone;
