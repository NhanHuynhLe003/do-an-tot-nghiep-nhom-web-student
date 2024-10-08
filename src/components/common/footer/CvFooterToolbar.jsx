import { Box, Slider, Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cvZoomScaleSelector } from "../../../redux/selector";
import CvSlice from "../../../redux/slices/CvSlice";
import { debounce } from "lodash";

export default function CvFooterToolbar({
  sideBarWidth,
  drawerToolbarPaperWidth,
}) {
  const dispatch = useDispatch();
  const zoomScale = useSelector(cvZoomScaleSelector);
  const [zoom, setZoom] = useState(zoomScale || 100);

  // Tạo hàm debounce một lần duy nhất
  const debouncedDispatch = useCallback(
    debounce((newValue) => {
      dispatch(CvSlice.actions.setZoomScale(newValue / 100));
    }, 50),
    [dispatch]
  );

  function handleZoomChange(event, newValue) {
    setZoom(newValue / 100);
    debouncedDispatch(newValue);
  }

  return (
    <Box
      component={"footer"}
      sx={{
        position: "fixed",
        bottom: 0,
        // CHo nó cách sidebar và bìa 3.1%
        left: `calc(${sideBarWidth}px + 3.15%)`,
        right: 0,
        // 100% - bìa - sideBarWidth - drawerToolbarPaperWidth
        width: `calc(100% - 3.15% - ${sideBarWidth}px - ${drawerToolbarPaperWidth}px)`,
        height: "40px",
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: "2rem",
        zIndex: 999,
      }}
    >
      <Box className="Footer_Box_Left">Left</Box>
      <Box
        className="Footer_Box_Right"
        sx={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <Typography
          className="page-current-select"
          component={"h5"}
          variant="body1"
          mb={"4px"}
        >
          Trang 1/3
        </Typography>
        <Box
          sx={{
            width: "250px",
          }}
        >
          <Slider
            sx={{
              width: "100%",
              height: "0.2rem",
            }}
            value={zoom * 100}
            min={10}
            max={500}
            step={2}
            onChange={handleZoomChange}
            aria-labelledby="zoom-slider"
          />
        </Box>
        <Typography
          className="page-current-select"
          component={"h5"}
          variant="body1"
          mb={"4px"}
          maxWidth={"1.5rem"}
        >
          {Math.floor(zoomScale * 100)}%
        </Typography>
      </Box>
    </Box>
  );
}
