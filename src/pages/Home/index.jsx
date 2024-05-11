import React from "react";
import anhTest from "../../assets/images/avatar-student.jpg";
import TestComponentInput from "../../components/ung-dung-ghi-chu/TestComponentInput";
// import anh2 from "/imgs/avatar-user.jpg";
export default function Home() {
  return (
    <div>
      <img src={anhTest} alt="mo-ta-anh" />
      {/* <img src={anh2} alt="hinh-anh-2" /> */}

      <TestComponentInput></TestComponentInput>
    </div>
  );
}
