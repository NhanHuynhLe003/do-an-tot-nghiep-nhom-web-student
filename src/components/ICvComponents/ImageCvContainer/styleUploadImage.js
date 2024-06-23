const dropzoneStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: "2px",
  borderRadius: "4px",
  borderColor: "var(--color-primary1)",
  borderStyle: "dashed",
  backgroundColor: "#fff",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  gap: "0.5rem",
};

const thumb = {
  borderRadius: 2,
  width: "48%",
  height: "auto",
  cursor: "grab",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  width: "100%",
  height: "100%",
};

export { dropzoneStyle, thumbsContainer, thumb, thumbInner, img };
