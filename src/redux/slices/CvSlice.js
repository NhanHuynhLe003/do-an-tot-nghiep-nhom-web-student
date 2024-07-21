import { createSlice } from "@reduxjs/toolkit";

import { sizeEditorDefault } from "../../constants";
const TRANSLATE_NUM = 0.5;
const initCoordinate = 300;

const CVID = "16102003";
const CvSlice = createSlice({
  name: "cvs",
  initialState: {
    editorContent: "",
    idEditor: -1, //id của editor đang được chọn
    textEditor: "",
    coordPointer: {}, //Tọa độ con trỏ trong Editor
    sizeEditor: sizeEditorDefault, //Kích thước của editor,
    itemDraggableSizeAndDeg: {
      id: -1,
      size: sizeEditorDefault,
      deg: 0,
    }, // Kích thước và góc quay của item draggable
    control: {
      zoomScale: 1,
    },
    listIdItemResizingOrRotating: {}, //Kiểm tra xem có đang thực hiện resize hoặc rotate không

    isClickOutside: false, //kiểm tra có nhấn ra bên ngoài các item đang kéo không
    itemsDragSelect: {
      mode: "single",
      items: [],
    }, //Mảng chứa các item được chọn, gồm {id, status}

    // Dữ liệu list CV User
    listCvUser: [],

    //Quản lý board hiện tại đang xem (trong viewPort) để thêm item vào CV đúng board đúng vị trí
    currentBoardInView: {
      id: "BOARD-001",
      name: "Board 1",
      position: { top: 0, left: 0 },
    },

    //Quản lý trạng thái lịch sử của cv
    history: {
      cvId: CVID,
      past: [],
      present: null,
      future: [],
    },
  },
  reducers: {
    // Truyền editorContent từ header xuống tiptapeditor
    setEditorContent: (state, action) => {
      state.editorContent = action.payload;
    },
    setIdEditor: (state, action) => {
      state.idEditor = action.payload;
    },
    setTextEditorChange: (state, action) => {
      state.textEditor = action.payload;
    },
    setPositionPointer: (state, action) => {
      state.coordPointer = action.payload;
    },
    setSizeEditor: (state, action) => {
      state.sizeEditor = action.payload;
    },
    setSizeAndDegItemDraggable: (state, action) => {
      state.itemDraggableSizeAndDeg = action.payload;
    },

    setZoomScale: (state, action) => {
      state.control.zoomScale = action.payload;
    },

    setClickOutsideDragItem: (state, action) => {
      state.isClickOutside = action.payload;
    },

    setListIdItemResizingOrRotating: (state, action) => {
      const { idItem, cvId, boardId, isResizeRotate } = action.payload;
      state.listIdItemResizingOrRotating[`${cvId}-${boardId}-${idItem}`] =
        isResizeRotate;
    },

    setPropertyItemsDragSelect: (state, action) => {
      state.itemsDragSelect = action.payload;
    },

    //Set dữ liệu cho list CV User thường chỉ set trong lần đầu tiên
    setDataListCvUser: (state, action) => {
      state.listCvUser = action.payload;
    },

    setCurrentBoardInView: (state, action) => {
      state.currentBoardInView = action.payload;
    },

    setNameBoard: (state, action) => {
      const { cvId, boardId, name } = action.payload;
      const cv = state.listCvUser.find((cv) => cv.cvId === cvId);
      const board = cv.boards.find((board) => board.boardId === boardId);
      board.name = name;
    },

    setAddBoardIntoCv: (state, action) => {
      const { cvId, board } = action.payload;
      let indexFound = -1;
      const cv = state.listCvUser.find((cv, index) => {
        if (cv.cvId === cvId) {
          indexFound = index;
          return true;
        }
        return false;
      });

      if (indexFound !== -1) {
        cv.boards.splice(indexFound + 1, 0, board);
      }
    },

    setRemoveBoardInCv: (state, action) => {
      const { cvId, boardId } = action.payload;
      const cv = state.listCvUser.find((cv) => cv.cvId === cvId);
      if (cv) {
        cv.boards = cv.boards.filter((board) => board.boardId !== boardId);
      }
    },

    // setAddDragItemIntoBoard: (state, action) => {
    //   const { cvId, boardId, dataItem } = action.payload;

    //   state.listCvUser
    //     .find((cv) => cv.cvId === cvId)
    //     .boards.find((board) => board.boardId === boardId)
    //     .listDataItem.push(dataItem);
    // },

    setAddDragItemIntoBoard: (state, action) => {
      const { cvId, boardId, dataItem } = action.payload;

      const cv = state.listCvUser?.find((cv) => cv.cvId === cvId);

      const board = cv?.boards?.find((board) => board.boardId === boardId);

      if (board) {
        if (!board.listDataItem) board.listDataItem = [];
        board.listDataItem?.push(dataItem);
      }
    },

    setAddRoleForItem: (state, action) => {
      const { cvId, boardId, idItem, role } = action.payload;

      const cv = state.listCvUser?.find((cv) => cv.cvId === cvId);

      const board = cv?.boards?.find((board) => board.boardId === boardId);

      const dataItem = board?.listDataItem?.find(
        (dataItem) => dataItem.id === idItem
      );

      if (dataItem) {
        dataItem.role = role;
      }
    },

    setAddColorToShapeItem: (state, action) => {
      const { cvId, boardId, idItem, color } = action.payload;

      const cv = state.listCvUser?.find((cv) => cv.cvId === cvId);

      const board = cv?.boards?.find((board) => board.boardId === boardId);

      const dataItem = board?.listDataItem?.find(
        (dataItem) => dataItem.id === idItem
      );

      if (dataItem) {
        dataItem.color = color;
      }
    },

    setAddContentToEditorItem: (state, action) => {
      const { cvId, boardId, idItem, content } = action.payload;

      const cv = state.listCvUser?.find((cv) => cv.cvId === cvId);

      const board = cv?.boards?.find((board) => board.boardId === boardId);

      const dataItem = board?.listDataItem?.find(
        (dataItem) => dataItem.id === idItem
      );

      if (dataItem) {
        dataItem.content = content;
      }
    },

    setUpdateListDataItemInBoard: (state, action) => {
      if (!action.payload) return;

      const { cvId, boardId, listDataItem } = action.payload;

      const cv = state.listCvUser?.find((cv) => cv.cvId === cvId);
      const board = cv?.boards?.find((board) => board.boardId === boardId);

      if (board) {
        board.listDataItem = listDataItem;
      }
    },

    setUpdateLayerItemInBoard: (state, action) => {
      const { cvId, boardId, idItem, layerItem } = action.payload;
      const layerData = layerItem < 1 ? 1 : layerItem;
      const cv = state.listCvUser?.find((cv) => cv.cvId === cvId);
      const board = cv?.boards?.find((board) => board.boardId === boardId);
      const dataItem = board?.listDataItem?.find(
        (dataItem) => dataItem.id === idItem
      );
      if (dataItem) {
        dataItem.layer = layerData;
      }
    },

    setUpdateColorItemInBoard: (state, action) => {
      const { cvId, boardId, idItem, colorItem } = action.payload;
      const cv = state.listCvUser?.find((cv) => cv.cvId === cvId);
      const board = cv?.boards?.find((board) => board.boardId === boardId);
      const dataItem = board?.listDataItem?.find(
        (dataItem) => dataItem.id === idItem
      );
      if (dataItem) {
        dataItem.color = colorItem;
      }
    },

    setHistoryState: (state, action) => {
      const { cvId, historyState, limit = 0 } = action.payload;
      state.history.cvId = cvId;

      // Add the current state to past, and set new history state as present
      if (state.history.present !== null) {
        state.history.past.push(state.history.present);
      }
      state.history.present = historyState;

      // Clear future
      state.history.future = [];

      // Limit the size of the past array
      if (limit > 0 && state.history.past.length > limit) {
        state.history.past = state.history.past.slice(
          state.history.past.length - limit
        );
      }
    },
    setUndoHistoryState: (state) => {
      if (state.history.past.length > 0) {
        // Di chuyển state hiện tại vào future
        state.history.future.unshift(state.history.present);
        // Set state trước đó làm state hiện tại
        state.history.present = state.history.past.pop();
      }
    },
    setRedoHistoryState: (state) => {
      if (state.history.future.length > 0) {
        // Chuyển State hiện tại vào past
        state.history.past.push(state.history.present);
        // Set state tiếp theo làm state hiện tại
        state.history.present = state.history.future.shift();
      }
    },
  },
});
export default CvSlice;
//====================================================
