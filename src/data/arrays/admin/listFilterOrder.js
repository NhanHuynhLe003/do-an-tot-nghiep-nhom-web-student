const listCategoryLevel1 = [
  {
    id: 0,
    value: "tất cả thể loại",
    label: "Lựa chọn thể loại sách",
    desc: "tất cả thể loại sách",
    isPublic: true,
    displayOrder: 0,
  },
  {
    id: 1,
    value: "Kỹ năng sống",
    desc: "Các loại sách về thể loại sách kỹ năng sống như: self-help, phát triển bản thân,...",
    isPublic: true,
    displayOrder: 1,
  },
  {
    id: 2,
    value: "Văn học",
    desc: "Các loại sách về thể loại sách Văn học như: tiểu thuyết, truyện ,...",
    isPublic: true,
    displayOrder: 2,
  },
  {
    id: 3,
    value: "Giáo dục",
    desc: "Các loại sách về thể loại Giáo dục như: lập trình, toán, tư duy, tiếng anh ,...",
    isPublic: true,
    displayOrder: 3,
  },
  {
    id: 4,
    value: "Sức khỏe",
    desc: "Mô tả về thể loại sách sức khỏe như: dinh dưỡng, tập luyện, y học,...",
    isPublic: true,
    displayOrder: 4,
  },
  {
    id: 5,
    value: "Du lịch",
    desc: "Mô tả về thể loại sách du lịch như: hướng dẫn du lịch, kinh nghiệm du lịch, văn hóa quốc gia,...",
    isPublic: true,
    displayOrder: 5,
  },
  {
    id: 6,
    value: "Tài chính",
    desc: "Mô tả về thể loại sách tài chính: đầu tư, dạy làm giàu, kinh doanh,...",
    isPublic: false,
    displayOrder: 6,
  },
  {
    id: 7,
    value: "Khoa học",
    desc: "Mô tả về thể loại sách khoa học như: thần số học, tâm lý học ,...",
    isPublic: true,
    displayOrder: 7,
  },
];

const listStatusOrder = [
  {
    id: 0,
    value: "tất cả trạng thái",
    label: "tất cả trạng thái",
    desc: "Mô tả về trạng thái order",
    tag: "all",
    isPublic: true,
    displayOrder: 0,
  },
  {
    id: 1,
    value: "Đang chờ xử lý",
    desc: "Mô tả về trạng thái order đang chờ xử lý",
    tag: "pending",
    isPublic: true,
    displayOrder: 1,
  },
  {
    id: 2,
    value: "Đã xác nhận",
    desc: "Mô tả về trạng thái order đã xác nhận",
    isPublic: true,
    tag: "completed",
    displayOrder: 2,
  },
  {
    id: 3,
    value: "Đã hủy",
    desc: "Mô tả về trạng thái order đã hủy",
    isPublic: true,
    tag: "canceled",
    displayOrder: 3,
  },
];

const listSortDateReturnBook = [
  {
    id: 0,
    value: "Tất cả hạn trả",
    label: "tất cả hạn trả",
    desc: "tất cả ngày user mượn, gần đến hạn, quá hạn",
    tag: "all",
    isPublic: true,
    displayOrder: 0,
  },
  {
    id: 1,
    value: "Gần đây",
    desc: "User mượn gần đây",
    tag: "nearly",
    isPublic: true,
    displayOrder: 1,
  },
  {
    id: 2,
    value: "Đến hạn",
    desc: "User mượn đến hạn, quá 1 tuần tính là quá hạn",
    isPublic: true,
    tag: "due",
    displayOrder: 2,
  },
  {
    id: 3,
    value: "Quá hạn",
    desc: "User đã quá hạn trả sách",
    isPublic: true,
    tag: "overdue",
    displayOrder: 3,
  },
];

// Các lớp trả sách, mỗi năm mỗi cập nhật, chia theo khóa bằng hàm cho lẹ :))
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const listClassBookOrder = [
  {
    id: 0,
    value: "Tất cả lớp",
    label: "tất cả lớp",
    desc: "tất cả các lớp đã mượn sách",
    tag: "all",
    isPublic: true,
    displayOrder: 0,
  },
  {
    id: 1,
    value: `Khóa ${currentYear - 3}`,
    label: `Khóa ${currentYear - 3}`,
    desc: `Khóa ${currentYear - 3}`,
    tag: `Khóa ${currentYear - 3}`,
    isPublic: true,
    displayOrder: 1,
  },
  {
    id: 2,
    value: `Khóa ${currentYear - 2}`,
    label: `Khóa ${currentYear - 2}`,
    desc: `Khóa ${currentYear - 2}`,
    tag: `Khóa ${currentYear - 2}`,
    isPublic: true,
    displayOrder: 2,
  },
  {
    id: 3,
    value: `Khóa ${currentYear - 1}`,
    label: `Khóa ${currentYear - 1}`,
    desc: `Khóa ${currentYear - 1}`,
    tag: `Khóa ${currentYear - 1}`,
    isPublic: true,
    displayOrder: 3,
  },
  {
    id: 4,
    value: `Khóa ${currentYear}`,
    label: `Khóa ${currentYear}`,
    desc: `Khóa ${currentYear}`,
    tag: `Khóa ${currentYear}`,
    isPublic: true,
    displayOrder: 4,
  },
];

export {
  listCategoryLevel1,
  listStatusOrder,
  listSortDateReturnBook,
  listClassBookOrder,
};
