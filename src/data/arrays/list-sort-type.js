// Dữ liệu sắp xếp danh sách trong search
const listSortType = [
  // dữ liệu phải thống nhất với param tìm kiếm BE
  { content: "Sắp Xếp", tag: "all" },
  { content: "Mới Nhất", tag: "newest" },
  { content: "Xem Nhiều", tag: "view-more" },
  { content: "Đánh Giá", tag: "rating" },
];

const listCategoryType = [
  { content: "Thể Loại", tag: "all" },
  { content: "Tâm Lý", tag: "psychology" },
  { content: "Khoa Học", tag: "science" },
  { content: "Tiểu Thuyết", tag: "novel" },
  { content: "Sức Khỏe", tag: "health" },
  { content: "Tự Truyện", tag: "self-help" },
  { content: "Kỹ Năng Mềm ", tag: "soft-skill" },
];

const listStatusType = [
  { content: "Tình Trạng", tag: "all" },
  { content: "Còn Sách", tag: "in-stock" },
];

const listRatingType = [
  { content: "Đánh Giá", tag: "all" },
  { content: "5 Sao", tag: "5" },
  { content: "4 Sao", tag: "4" },
  { content: "3 Sao", tag: "3" },
  { content: "2 Sao", tag: "2" },
  { content: "1 Sao", tag: "1" },
];
export { listSortType, listCategoryType, listStatusType, listRatingType };
