import React, { useEffect, useState } from "react";
import style from "./TestComponentInput.module.css";
import { dataTest } from "../../../data/ung-dung-ghi-chu/test-data";
import { CircularProgress } from "@mui/material";

// ===============CODE CUA NHAN==================

export default function TestComponentInput() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "500px" }}>
      <button>Click</button>
      <textarea cols={10} rows={20}></textarea>

      {dataTest ? (
        dataTest.map((data, index) => {
          return (
            <div key={data.id}>
              <img src={data.img} alt="hinh-anh" width={"200"} />
              <p>{data.name}</p>
              <p>{data.price}</p>
              <p>{data.danhgia}</p>
            </div>
          );
        })
      ) : (
        <CircularProgress size={60} />
      )}
    </div>
  );
}
