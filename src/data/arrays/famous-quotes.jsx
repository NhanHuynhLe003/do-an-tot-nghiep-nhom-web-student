import { Box, Stack } from "@mui/material";
import style from "./css/famous-quotes.module.css";
const famouseQuotes = [
  {
    component: (
      <Stack className={style.cardContainer} direction={"column"}>
        <p className={style.contentCard}>
          “There is more treasure in books than in all the pirate’s loot on
          Treasure Island.”
        </p>
        <br />
        <Box textAlign={"right"}>
          <p className={style.authorCard}>-Walt Disney</p>
        </Box>
      </Stack>
    ),
  },
  {
    component: (
      <Stack className={style.cardContainer} direction={"column"}>
        <p className={style.contentCard}>
          “There is more treasure in books than in all the pirate’s loot on
          Treasure Island.”
        </p>
        <br />
        <Box textAlign={"right"}>
          <p className={style.authorCard}>-Walt Disney</p>
        </Box>
      </Stack>
    ),
  },
  {
    component: (
      <Stack className={style.cardContainer} direction={"column"}>
        <p className={style.contentCard}>
          “There is more treasure in books than in all the pirate’s loot on
          Treasure Island.”
        </p>
        <br />
        <Box textAlign={"right"}>
          <p className={style.authorCard}>-Walt Disney</p>
        </Box>
      </Stack>
    ),
  },
];

export { famouseQuotes };
