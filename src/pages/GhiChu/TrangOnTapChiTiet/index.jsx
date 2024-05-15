////////////////////ANHKHOA//////////////////////////
import React, { useState } from "react";
import style from "./TrangOnTapChiTiet.module.css";

const notes = [
  {
    tieude: "Note 1",
    nd: "Khoa Học Giỏi Quá Đi.",
    ngay: "2024-05-15",
  },
  {
    tieude: "Note 2",
    nd: "Khoa Học Giỏi Quá Quá Đi.",
    ngay: "2024-05-14",
  },
  {
    tieude: "Note 3",
    nd: "Sống có kỉ luật là một trong những yếu tố quan trọng giúp con người đạt được thành công trong cuộc sống. Kỉ luật không chỉ giúp chúng ta tự kiểm soát hành vi, tư duy mà còn giúp chúng ta phát triển bản thân và đạt được mục tiêu mình đề ra. Việc sống có kỉ luật không chỉ đem lại lợi ích cho bản thân mà còn tạo ra một cộng đồng văn minh, phát triển.Trong cuộc sống hàng ngày, việc tuân thủ các quy tắc, nguyên tắc và kế hoạch đã đề ra là một cách để chúng ta duy trì sự ổn định và tiến bộ. Khi chúng ta có kỉ luật trong cuộc sống, chúng ta sẽ dễ dàng tự kiểm soát hành vi, tư duy và hành động của mình. Điều này giúp chúng ta tránh xa những hành vi tiêu cực, đồng thời tạo ra một môi trường tích cực cho bản thân và người xung quanh.Sống có kỉ luật cũng giúp chúng ta phát triển bản thân một cách toàn diện. Khi chúng ta tuân thủ kế hoạch, lịch trình và nguyên tắc đã đề ra, chúng ta sẽ dần dần trở nên tự tin, kiên định và có trách nhiệm hơn trong mọi việc. Đồng thời, việc tuân thủ kỉ luật cũng giúp chúng ta rèn luyện ý chí, kiên nhẫn và sự kiên trì trong công việcNgoài ra, sống có kỉ luật cũng giúp chúng ta đạt được mục tiêu mình đề ra. Khi chúng ta có kỉ luật trong cuộc sống, chúng ta sẽ dễ dàng tập trung vào công việc, học tập và phát triển bản thân mà không bị phân tâm bởi những yếu tố xung quanh. Điều này giúp chúng ta tiết kiệm thời gian, năng lượng và tài nguyên để đạt được mục tiêu của mình một cách hiệu quả.Tóm lại, sống có kỉ luật không chỉ là một phong cách sống mà còn là yếu tố quan trọng giúp chúng ta đạt được thành công trong cuộc sống. Kỉ luật giúp chúng ta tự kiểm soát hành vi, tư duy và hành động của mình, phát triển bản thân một cách toàn diện và đạt được mục tiêu mình đề ra. Vì vậy, hãy sống có kỉ luật để trở thành người thành công và hạnh phúc trong cuộc sống.Sống có kỉ luật là một trong những yếu tố quan trọng giúp con người đạt được thành công trong cuộc sống. Kỉ luật không chỉ giúp chúng ta tự kiểm soát hành vi, tư duy mà còn giúp chúng ta phát triển bản thân và đạt được mục tiêu mình đề ra.Việc sống có kỉ luật không chỉ đem lại lợi ích cho bản thân mà còn tạo ra một cộng đồng văn minh, phát triển.Trong cuộc sống hàng ngày, việc tuân thủ các quy tắc, nguyên tắc và kế hoạch đã đề ra là một cách để chúng ta duy trì sự ổn định và tiến bộ. Khi chúng ta có kỉ luật trong cuộc sống, chúng ta sẽ dễ dàng tự kiểm soát hành vi, tư duy và hành động của mình. Điều này giúp chúng ta tránh xa những hành vi tiêu cực, đồng thời tạo ra một môi trường tích cực cho bản thân và người xung quanh.Sống có kỉ luật cũng giúp chúng ta phát triển bản thân một cách toàn diện. Khi chúng ta tuân thủ kế hoạch, lịch trình và nguyên tắc đã đề ra, chúng ta sẽ dần dần trở nên tự tin, kiên định và có trách nhiệm hơn trong mọi việc. Đồng thời, việc tuân thủ kỉ luật cũng giúp chúng ta rèn luyện ý chí, kiên nhẫn và sự kiên trì trong công việcNgoài ra, sống có kỉ luật cũng giúp chúng ta đạt được mục tiêu mình đề ra. Khi chúng ta có kỉ luật trong cuộc sống, chúng ta sẽ dễ dàng tập trung vào công việc, học tập và phát triển bản thân mà không bị phân tâm bởi những yếu tố xung quanh. Điều này giúp chúng ta tiết kiệm thời gian, năng lượng và tài nguyên để đạt được mục tiêu của mình một cách hiệu quả.Tóm lại, sống có kỉ luật không chỉ là một phong cách sống mà còn là yếu tố quan trọng giúp chúng ta đạt được thành công trong cuộc sống. Kỉ luật giúp chúng ta tự kiểm soát hành vi, tư duy và hành động của mình, phát triển bản thân một cách toàn diện và đạt được mục tiêu mình đề ra. Vì vậy, hãy sống có kỉ luật để trở thành người thành công và hạnh phúc trong cuộc sống",
    ngay: "2024-05-13",
  },
  {
    tieude: "Note 4",
    nd: "Khoa Học Giỏi Quá Quá Quá Quá Đi.",
    ngay: "2024-05-12",
  },
];

export default function TrangOnTapChiTiet() {
  const [selectedNote, setSelectedNote] = useState(notes[0]); // Ghi chú mặc định
  return (
    <div className={style.TrangOnTap}>
      <div className={style.documentList}>
        <h5 className={style.tieude}>Documents</h5>
        {notes.map((note, index) => (
          <div key={index} onClick={() => setSelectedNote(note)}>
            <div className={style.notecard}>
              <h6 className={style.titlenote}>{note.tieude}</h6>
              <span className={style.ndnote}>
                {/* Kiểm tra độ dài của nội dung và cắt bớt nếu cần */}
                {note.nd.length > 30 ? note.nd.slice(0, 30) + "..." : note.nd}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className={style.OnTapChiTiet}>
        <h2>{selectedNote.tieude}</h2>
        <div className={style.fonderdate}>
          <img
            src="https://tse3.explicit.bing.net/th?id=OIP.SQo02J3N13kPFLekg_E3TAHaHu&pid=Api&P=0&h=180"
            alt="hinh-anh"
            className={style.img}
          />
          <div className={style.dateContainer}>
            <p className={style.h2}>DATE</p>
            <span className={style.date}>{selectedNote.ngay}</span>
          </div>
        </div>
        <div className={style.fonderdate}>
          <img
            src="https://tse4.mm.bing.net/th?id=OIP.5DEFJ19gCTvlUyaQ4f70MAHaHa&pid=Api&P=0&h=180"
            alt="hinh-anh"
            className={style.img}
          />
          <div className={style.dateContainer}>
            <p className={style.h2}>Fonder</p>
            <span className={style.date}>Document</span>
          </div>
        </div>
        <div className={style.contentEditable} contentEditable="true">
          {selectedNote.nd}
        </div>
        <div className={style.buttonlon}>
          <button className={style.Buttonnho}>1 day</button>
          <button className={style.Buttonnho}>2 days</button>
          <button className={style.Buttonnho}>3 days</button>
          <button className={style.Buttonnho}>4 days</button>
        </div>
      </div>
    </div>
  );
}
/////////////////////ANHKHOA////////////////////////////
