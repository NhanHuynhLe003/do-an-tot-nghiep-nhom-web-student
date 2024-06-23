import React from "react";

export default function Rectangle({ width, height, fill }) {
  return (
    <svg
      fill={fill}
      version="1.1"
      baseProfile="tiny"
      id="Layer_1"
      width={width}
      height={height}
    >
      <rect x="0.5" y="4.5" width={width} height={height} />
    </svg>
  );
}
