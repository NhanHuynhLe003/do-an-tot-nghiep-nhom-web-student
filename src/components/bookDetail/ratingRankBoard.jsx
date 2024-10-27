import { Box, Grid, Typography } from "@mui/material";
import { FaStar } from "react-icons/fa";
import style from "./ratingRankBoard.module.css";

export default function RatingRankBoard({
  rating = 0,
  ratingCount = 0,
  ratingDetail = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
}) {
  return (
    <Grid container spacing={2} alignItems="flex-start">
      {/* Phần rating */}
      <Grid item xs={12} lg={2}>
        <Box textAlign="center">
          <Typography component="h3" variant="h2" fontWeight={900}>
            {rating}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--color-primary2)",
              opacity: 0.6,
            }}
          >
            {ratingCount} Đánh giá
          </Typography>
        </Box>
      </Grid>

      {/* Phần StarGenerator */}
      <Grid item xs={4} md={5} lg={3}>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <StarGenerator star={5} />
          <StarGenerator star={4} />
          <StarGenerator star={3} />
          <StarGenerator star={2} />
          <StarGenerator star={1} />
        </Box>
      </Grid>

      {/* Phần ChartGenerator */}
      <Grid item xs={8} md={7} lg={7}>
        <Box display="flex" flexDirection="column" gap="0.85rem">
          <ChartGenerator
            value={Math.floor((ratingDetail['5'] / ratingCount) * 100)}
            count={ratingDetail['5']}
          />
          <ChartGenerator
            value={Math.floor((ratingDetail['4'] / ratingCount) * 100)}
            count={ratingDetail['4']}
          />
          <ChartGenerator
            value={Math.floor((ratingDetail['3'] / ratingCount) * 100)}
            count={ratingDetail['3']}
          />
          <ChartGenerator
            value={Math.floor((ratingDetail['2'] / ratingCount) * 100)}
            count={ratingDetail['2']}
          />
          <ChartGenerator
            value={Math.floor((ratingDetail['1'] / ratingCount) * 100)}
            count={ratingDetail['1']}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

function StarGenerator({ star = 1 }) {
  return (
    <Box>
      {Array.from({ length: star }, (_, index) => (
        <FaStar key={index} color={"#faaf00"} />
      ))}
    </Box>
  );
}

function ChartGenerator({ value = 0, count= 0 }) {
  return (
    <Box
      title={`${count} đánh giá`}
      className={style.ratingRankBoard}
    >
      <Box
        width={`${value}%`}
        className={style.ratingRankBoardBar}
      >
        {" "}
      </Box>
    </Box>
  );
}
