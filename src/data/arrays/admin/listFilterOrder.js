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
    value: "tất cả",
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

export { listCategoryLevel1, listStatusOrder };
