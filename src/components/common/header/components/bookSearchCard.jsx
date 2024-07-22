import { Box, Rating, Stack, Typography } from "@mui/material";
import React from "react";

export default function BookSearchCard({
  img = "https://placehold.co/200x300",
  title = "title",
  author = "author",
  desc = "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  rating = 4.5,
}) {
  return (
    <Stack
      direction={"row"}
      gap={"1rem"}
      sx={{
        padding: "0.5rem",
      }}
    >
      <Box width={"20%"}>
        <img
          alt={`img-of-${title}`}
          width={"100%"}
          height={"auto"}
          src={img}
        ></img>
      </Box>
      <Box width={"70%"}>
        <Stack direction={"column"} gap={"0.5rem"}>
          <Typography
            sx={{
              fontSize: "1.2rem",
              fontWeight: "600",
              color: "var(--color-primary2)",
              opacity: 0.8,
              padding: 0,
              lineHeight: 1,
            }}
          >
            {title}
          </Typography>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "var(--color-primary2)",
                opacity: 0.8,
                padding: 0,
                lineHeight: 0.8,
              }}
            >
              {author}
            </Typography>

            <Rating
              name="read-only"
              value={rating}
              readOnly
              sx={{
                color: "var(--color-primary1)",
                fontSize: "1rem",
                padding: 0,
                lineHeight: 0.8,
              }}
            ></Rating>
          </Stack>
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: "400",
              color: "var(--color-primary2)",
              opacity: 0.6,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {desc}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
