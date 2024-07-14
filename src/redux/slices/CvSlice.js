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

    //Quản lý CV User(1 người có thể có nhiều CV nên phải là mảng)
    // listCvUser: [
    //   {
    //     cvId: CVID,
    //     cvUserId: "CVU-16102003", //UserId của user, dùng để biết tác giả
    //     title: "CV của tôi",
    //     thumbnail: "https://placehold.co/200x300",
    //     status: "private",
    //     isDelete: false, //CV đã bị xóa
    //     isDragDisabled: false, //Không cho kéo thả các item trong board
    //     boards: [
    //       // {
    //       //   cvId: "CVU-16102003",
    //       //   cvUserId: "CVU-16102003",
    //       //   boardId: "BOARD-001", //thực tế thay bằng _id của board
    //       //   name: "Board 1",
    //       //   position: { top: 0, left: 0 },
    //       //   listDataItem: [
    //       //     {
    //       //       id: "B1-I001",
    //       //       boardId: "BOARD-001",
    //       //       role: "ALL", //["ONLY_READ", "ONLY_WRITE", "ALL"]
    //       //       type: "editor",
    //       //       coordinate: {
    //       //         x: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
    //       //         x2:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.width -
    //       //           TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y2: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
    //       //         x3:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.width -
    //       //           TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y3:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.height -
    //       //           TRANSLATE_NUM * sizeEditorDefault.height,
    //       //         x4: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y4:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.height -
    //       //           TRANSLATE_NUM * sizeEditorDefault.height,
    //       //         x5:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.width / 2 -
    //       //           TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y5:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.height / 2 -
    //       //           TRANSLATE_NUM * sizeEditorDefault.height,
    //       //       },
    //       //       sizeItem: sizeEditorDefault,
    //       //       ChildComponentProps: {},
    //       //       layer: 1,
    //       //       content: "<p>Đây là nội dung của editor</p>",
    //       //       color: "#5496FA",
    //       //     },
    //       //   ],
    //       // },
    //       // {
    //       //   boardId: "BOARD-002",
    //       //   name: "Board 2",
    //       //   position: { top: 80, left: 0 },
    //       //   listDataItem: [
    //       //     {
    //       //       id: "B2-I001",
    //       //       boardId: "BOARD-002",
    //       //       role: "ALL", //["ONLY_READ", "ONLY_WRITE","ALL"] => chỉ đọc < có thể sửa nội dung text < sửa kích thước, vị trí, góc quay, mọi thứ
    //       //       itemType: "editor",
    //       //       coordinate: {
    //       //         x: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
    //       //         x2:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.width -
    //       //           TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y2: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.height,
    //       //         x3:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.width -
    //       //           TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y3:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.height -
    //       //           TRANSLATE_NUM * sizeEditorDefault.height,
    //       //         x4: initCoordinate - TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y4:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.height -
    //       //           TRANSLATE_NUM * sizeEditorDefault.height,
    //       //         x5:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.width / 2 -
    //       //           TRANSLATE_NUM * sizeEditorDefault.width,
    //       //         y5:
    //       //           initCoordinate +
    //       //           sizeEditorDefault.height / 2 -
    //       //           TRANSLATE_NUM * sizeEditorDefault.height,
    //       //       },
    //       //       sizeItem: sizeEditorDefault,
    //       //       ChildComponentProps: {},
    //       //       layer: 1,
    //       //       content: "<p>Đây là nội dung của editor</p>",
    //       //       color: "#5496FA",
    //       //     },
    //       //   ],
    //       // },
    //     ],
    //     dateCreated: "2021-09-01",
    //     dateModified: "2021-09-01",
    //   },
    // ],
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
