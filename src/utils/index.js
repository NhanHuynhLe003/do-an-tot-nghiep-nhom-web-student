import { format, parse, differenceInWeeks } from "date-fns";
import slugify from "slugify";

/**
 * @description Hàm trộn mảng
 */
function shuffleArray(array) {
  // Bắt đầu từ cuối mảng
  for (let i = array.length - 1; i > 0; i--) {
    // Chọn một chỉ số ngẫu nhiên từ 0 đến i
    const j = Math.floor(Math.random() * (i + 1));
    // Đổi chỗ hai phần tử ở vị trí i và j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * @description Hàm làm tròn số half
 * @param {number} num - Số cần làm tròn
 * @returns {number} - Số đã được làm tròn
 */
function roundNumber(num) {
  // Lấy phần thập phân của số
  const decimalPart = num - Math.floor(num);

  // Kiểm tra phần thập phân
  if (decimalPart >= 0.5) {
    return Math.floor(num) + 0.5; // Làm tròn lên đến 0.5
  } else if (decimalPart >= 0.0 && decimalPart < 0.5) {
    return Math.floor(num); // Làm tròn xuống số nguyên
  }
}

/**
 * @description Hàm tính khoảng cách giữa ngày nhập vào và ngày hiện tại theo tuần
 * @param {string} dateString - Chuỗi ngày nhập vào
 * @returns {number} - Số tuần
 */
function calculateTimeDifference(dateString) {
  // Định dạng của chuỗi ngày nhập vào là "dd-MM-yyyy"
  const inputDate = parse(dateString, "dd-MM-yyyy", new Date());

  // Lấy ngày hiện tại
  const currentDate = new Date();

  // Tính khoảng cách giữa ngày nhập vào và ngày hiện tại theo đơn vị tuần
  const weeksDifference = differenceInWeeks(inputDate, currentDate);

  // Trả về số tuần
  return -weeksDifference;
}

/**
 * @description Hàm tính khoảng cách giữa hai điểm trên mặt phẳng
 * @param {*} param0
 * @returns
 */
function calculateDistanceByCoordinate({ x1, y1, x2, y2 }) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

function createSlug(text) {
  return slugify(String(text), {
    lower: true,
    strict: true,
    trim: true,
  });
}

export {
  calculateDistanceByCoordinate,
  shuffleArray,
  roundNumber,
  calculateTimeDifference,
  debounce,
  createSlug,
};
