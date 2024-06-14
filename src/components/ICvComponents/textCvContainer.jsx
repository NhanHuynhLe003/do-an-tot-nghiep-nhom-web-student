import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { cloneDeep } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import CvSlice from "../../redux/slices/CvSlice";
import theme from "../../theme";
import style from "./textCvContainer.module.css";
import { currentBoardInViewSelector } from "../../redux/selector";
import { sizeEditorDefault } from "../../constants";
import { useParams } from "react-router-dom";

const textHeadings = [
  {
    id: "H001",
    name: "Heading 1",
    type: "heading",
    fontSize: "2rem",
    fontWeight: "900",
  },
  {
    id: "H002",
    name: "Heading 2",
    type: "heading",
    fontSize: "1.5rem",
  },
  {
    id: "H003",
    name: "Heading 3",
    type: "heading",
    fontSize: "1.17rem",
  },
];

const styleTexts = [
  {
    id: "T001",
    name: "Normal Text",
    style: "fontStyle",
    styleValue: "normal",
    fontSize: "1rem",
    type: "subText",
  },
  {
    id: "T002",
    name: "Bold Text",
    type: "subText",
    fontSize: "1rem",
    style: "fontWeight",
    styleValue: "bold",
  },
  {
    id: "T003",
    name: "Italic Text",
    type: "subText",
    fontSize: "1rem",
    style: "fontStyle",
    styleValue: "italic",
  },
];

const typeTexts = [
  {
    id: "TT001",
    name: "Times New Roman",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Times New Roman', Times, serif`,
  },
  {
    id: "TT002",
    name: "Arial",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `Arial, Helvetica, sans-serif`,
  },
  {
    id: "TT003",
    name: "Verdana",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `Verdana, Geneva, sans-serif`,
  },
  {
    id: "TT004",
    name: "Georgia",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `Georgia, serif`,
  },
  {
    id: "TT005",
    name: "Courier New",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Courier New', Courier, monospace`,
  },
  {
    id: "TT006",
    name: "Lucida Console",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Lucida Console', Monaco, monospace`,
  },
  {
    id: "TT007",
    name: "Tahoma",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `Tahoma, Geneva, sans-serif`,
  },
  {
    id: "TT008",
    name: "Trebuchet MS",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Trebuchet MS', Helvetica, sans-serif`,
  },
  {
    id: "TT009",
    name: "Impact",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `Impact, Charcoal, sans-serif`,
  },
  {
    id: "TT010",
    name: "Comic Sans MS",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Comic Sans MS', cursive, sans-serif`,
  },
  {
    id: "TT011",
    name: "Palatino",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Palatino Linotype', 'Book Antiqua', Palatino, serif`,
  },
  {
    id: "TT012",
    name: "Garamond",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `Garamond, serif`,
  },
  {
    id: "TT013",
    name: "Bookman",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Bookman Old Style', serif`,
  },
  {
    id: "TT014",
    name: "Arial Black",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Arial Black', Gadget, sans-serif`,
  },
  {
    id: "TT015",
    name: "Avant Garde",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Avant Garde', sans-serif`,
  },
  {
    id: "TT016",
    name: "Optima",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `Optima, sans-serif`,
  },
  {
    id: "TT017",
    name: "Futura",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `Futura, sans-serif`,
  },
  {
    id: "TT018",
    name: "Century Gothic",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Century Gothic', sans-serif`,
  },
  {
    id: "TT019",
    name: "Lucida Sans",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Lucida Sans Unicode', 'Lucida Grande', sans-serif`,
  },
  {
    id: "TT020",
    name: "Gill Sans",
    type: "typeText",
    fontSize: "1rem",
    fontFamily: `'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif`,
  },
];
const TRANSLATE_NUM = 0.5;
const initCoordinate = 500;
export default function TextCvContainer() {
  const { id: idCurrentPageCv } = useParams();

  const dispatch = useDispatch();

  //Vị trí hiện tại của Board
  const currentBoardSelectorInView = useSelector(currentBoardInViewSelector);

  const [searchBook, setSearchBook] = React.useState("");

  function handleSearchBook(value) {
    setSearchBook(value);
  }

  //Khả năng cao là chỉ truyền dữ liệu không truyền DOM, DOM chỉ để map ra thôi
  function handleAddDragItem(type = "editor") {
    const cvId = idCurrentPageCv;
    const boardId = currentBoardSelectorInView.id;
    const idDragItem = uuidv4();
    const dataItem = {
      id: `${boardId}_${idDragItem}`,
      role: "ALL", //["ONLY_READ", "ONLY_WRITE", "ALL"]
      type: "editor",
      coordinate: {
        x: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
        y: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
        x2:
          initCoordinate +
          sizeEditorDefault.width -
          TRANSLATE_NUM * sizeEditorDefault.width,
        y2: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
        x3:
          initCoordinate +
          sizeEditorDefault.width -
          TRANSLATE_NUM * sizeEditorDefault.width,
        y3:
          initCoordinate +
          sizeEditorDefault.height -
          TRANSLATE_NUM * sizeEditorDefault.height,
        x4: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
        y4:
          initCoordinate +
          sizeEditorDefault.height -
          TRANSLATE_NUM * sizeEditorDefault.height,
        x5:
          initCoordinate +
          sizeEditorDefault.width / 2 -
          TRANSLATE_NUM * sizeEditorDefault.width,
        y5:
          initCoordinate +
          sizeEditorDefault.height / 2 -
          TRANSLATE_NUM * sizeEditorDefault.height,
      },
      sizeItem: sizeEditorDefault,
      layer: 1,
    };

    dispatch(
      CvSlice.actions.setAddDragItemIntoBoard({
        cvId,
        boardId,
        dataItem,
      })
    );
  }
  return (
    <Box className={style.TextCvContainer}>
      <Paper
        component="form"
        sx={{
          background: "transparent",
          borderRadius: "5rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          display: "flex",
          p: "2px 8px",
          alignItems: "center",
          maxHeight: "2.5rem",
          width: "100%",
          mt: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, order: 2 }}
          placeholder="Tìm kiếm kiểu text"
          inputProps={{ "aria-label": "search" }}
          onChange={handleSearchBook}
        />
        <IconButton
          type="button"
          sx={{ p: "4px 8px", color: theme.colors.primary1 }}
          aria-label="search"
        >
          <SearchIcon
            sx={{
              color: theme,
            }}
          />
        </IconButton>
      </Paper>

      <Button
        fullWidth
        variant="contained"
        sx={{ my: 2, backgroundColor: "var(--color-primary1)" }}
        onClick={handleAddDragItem}
      >
        Thêm Text Box
      </Button>

      <Stack className={style.listDefaultText} direction={"column"}>
        <Typography
          component="h3"
          sx={{
            mt: 1,
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "var(--color-primary2)",
          }}
        >
          Kiểu Heading Text
        </Typography>
        <Stack direction={"column"}>
          {textHeadings.map((text) => (
            <Box
              key={text.id}
              sx={{
                backgroundColor: "rgba(77,77,77,0.4)",
                color: "#fff",
                fontSize: text.fontSize,
                mt: 2,
                px: 1,
                cursor: "pointer",
                transition: "all 0.1s",

                "&:hover": {
                  backgroundColor: "rgba(77,77,77,0.9)",
                },
              }}
            >
              {text.name}
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack className={style.listDefaultText} direction={"column"} mt={2}>
        <Typography
          component="h3"
          sx={{
            mt: 1,
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "var(--color-primary2)",
          }}
        >
          Kiểu Style Text
        </Typography>
        <Stack direction={"column"}>
          {styleTexts.map((text) => (
            <Box
              key={text.id}
              sx={{
                backgroundColor: "rgba(77,77,77,0.4)",
                color: "#fff",
                fontSize: text.fontSize,
                mt: 2,
                px: 1,
                cursor: "pointer",
                transition: "all 0.1s",
                [text.style]: text.styleValue,

                "&:hover": {
                  backgroundColor: "rgba(77,77,77,0.9)",
                },
              }}
            >
              {text.name}
            </Box>
          ))}
        </Stack>
      </Stack>

      <Stack className={style.listDefaultText} direction={"column"} mt={2}>
        <Typography
          component="h3"
          sx={{
            mt: 1,
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "var(--color-primary2)",
          }}
        >
          Kiểu Chữ
        </Typography>
        <Stack direction={"column"}>
          {typeTexts.map((text) => (
            <Box
              key={text.id}
              sx={{
                backgroundColor: "rgba(77,77,77,0.4)",
                color: "#fff",
                fontSize: text.fontSize,
                mt: 2,
                px: 1,
                cursor: "pointer",
                transition: "all 0.1s",
                fontFamily: text.fontFamily,

                "&:hover": {
                  backgroundColor: "rgba(77,77,77,0.9)",
                },
              }}
            >
              {text.name}
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
