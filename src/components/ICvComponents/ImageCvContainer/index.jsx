import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from "../../../apis/axiosConfig";
import { sizeImageDndDefault } from "../../../constants";
import { currentBoardInViewSelector } from "../../../redux/selector";
import CvSlice from "../../../redux/slices/CvSlice";
import {
  dropzoneStyle,
  img,
  thumb,
  thumbInner,
  thumbsContainer,
} from "./styleUploadImage";
import { useGetImagesByUserIdAndNameStorage } from "../../../hooks/apis/upload/useGetImagesByUserIdAndNameStorage";
import { useUploadImageStatic } from "../../../hooks/apis/upload/useUploadImageStatic";

const TRANSLATE_NUM = 0.5;
const initCoordinate = 500;
const IUploadImageDropZone = () => {
  const studentData = JSON.parse(localStorage.getItem("studentData"));
  const [images, setImages] = useState([]);

  //Lấy id của trang hiện tại tu url
  const { id: idCurrentPageCv } = useParams();
  const dispatch = useDispatch();
  //Vị trí hiện tại của Board, dựa trên thanh scroll
  const currentBoardSelectorInView = useSelector(currentBoardInViewSelector);

  const { data: dataImages } = useGetImagesByUserIdAndNameStorage({
    userId: studentData?._id,
    nameStorage: "cvs",
  });

  const { mutate: uploadImageStatic } = useUploadImageStatic();

  useEffect(() => {
    const imagesData = dataImages?.data?.metadata;
    if (imagesData) {
      // setImages();
      setImages(imagesData);
    }
  }, [dataImages]);

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
    acceptedFiles.forEach((file) => {
      uploadImageStatic(
        { nameStorage: "cvs", file: file },
        {
          onSuccess: (data, variables, context) => {
            // listNewImageUpload.push(daa)
            toast.success("Upload ảnh thành công", {
              position: "top-center",
            });
          },
        }
      );
    });
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
        {images.map((img, index) => (
          <div
            className="Image_Upload_Container"
            key={index}
            style={thumb}
            ref={refImage}
            onClick={async () => {
              //Lấy ra kích thươc item hiện tại

              const sizeImage = refImage.current?.getBoundingClientRect();
              handleClickAddImage({
                imgName: uuidv4(),
                src: img?.signedUrl, //Lấy ảnh tạm trước upload ảnh thật sau
                styleValue: {
                  width: sizeImage.width || "60px",
                  height: sizeImage.height || "100px",
                },
              });
            }}
          >
            <div style={thumbInner}>
              <img
                src={img?.signedUrl}
                style={{
                  width: "100%",
                  height: "auto",
                }}
                alt={`preview-${index}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IUploadImageDropZone;
