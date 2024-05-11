import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import { calculateTimeDifference } from "../../utils";
import TextShowMore from "./textShowMore";

export default function CommentBook({
  img = "/imgs/avatar-user.jpg",
  name = "Nguyễn Văn A",
  date = "20-03-2024",
  content = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque voluptate assumenda esse dolore maiores ea laudantium a, quisquam nam fugit. Recusandae enim aut deserunt! Quis placeat blanditiis voluptas asperiores culpa.
  Molestias, sint impedit! Nostrum maiores, architecto labore sapiente amet repellendus cupiditate commodi omnis harum inventore eum ipsa aspernatur atque excepturi praesentium esse fugit corporis! Iusto optio hic laudantium est ullam!
  Officiis laudantium aspernatur eaque maiores commodi distinctio molestias vitae voluptatibus eveniet! Alias sunt laboriosam itaque accusamus quaerat? Quam atque, vero minima illo, unde repudiandae quas rerum quis adipisci nulla repellendus!
  Ducimus animi fugit excepturi magni ratione, odio maiores fugiat! Sit quaerat natus quam velit tempore temporibus, deleniti ea voluptatem tempora qui minus laboriosam dolores. Saepe nulla reiciendis illo! Minima, doloribus?`,
}) {
  return (
    <Stack
      direction={"column"}
      sx={{
        boxShadow: "0px 0 10px rgba(0, 0, 0, 0.25)",
        borderRadius: "0.75rem",
        p: "1rem",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack direction={"row"} alignItems={"center"}>
          <Avatar
            alt="Nguyen Van A"
            src={img}
            sx={{ width: 56, height: 56, marginRight: "0.5rem" }}
          />
          <Typography
            component={"p"}
            sx={{ fontSize: "1.5rem", color: "var(color-white1)" }}
          >
            {name}
          </Typography>
        </Stack>

        <Typography
          component={"p"}
          sx={{ color: "var(--color-primary2)", opacity: 0.5 }}
        >
          {calculateTimeDifference(date)} tuần trước
        </Typography>
      </Stack>

      <TextShowMore text={content} textAlign={"left"}></TextShowMore>
    </Stack>
  );
}
