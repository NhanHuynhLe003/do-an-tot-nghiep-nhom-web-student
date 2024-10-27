import { Button, Rating, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";

export default function TextShowMore({
  text,
  textAlign = "center",
  fontSize = "1rem",
  isRating = false,
  rating = 0
}) {
  const [textContent, setTextContent] = React.useState(text);
  const [statusIsShowMore, setStatusIsShowMore] = React.useState(false);

  useEffect(() => {
    if (text?.length > 250) setTextContent(text.slice(0, 250) + ".....");
  }, [text]);

  const handleShowMore = () => {
    if (statusIsShowMore) {
      // Nếu đg được show thì ẩn bớt
      setTextContent(text.slice(0, 250) + ".....");
    } else {
      setTextContent(text);
    }
    setStatusIsShowMore(!statusIsShowMore);
  };

  return (
    <Typography
      component={"p"}
      mt={"1rem"}
      mb={"1rem"}
      fontSize={fontSize}
      fontWeight={400}
      color={"var(--color-primary2)"}
      sx={{
        opacity: 0.9,
      }}
      textAlign={textAlign}
    >
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>

      <div dangerouslySetInnerHTML={{__html: textContent}}/>
      {text?.length > 250 && (
        <Button
          type="button"
          sx={{ fontWeight: "bold" }}
          variant="text"
          color="inherit"
          onClick={handleShowMore}
          size="small"
        >
          {statusIsShowMore ? "Ẩn bớt" : "Đọc thêm"}
        </Button>
      )}
      {isRating && rating > 0 && <Rating readOnly value={rating} defaultValue={0} sx={{fontSize: '1.4rem'}} precision={0.5}/>}
      </Stack>
    </Typography>
  );
}
