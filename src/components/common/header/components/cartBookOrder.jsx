import React from "react";
import ITable from "../../../ITable/ITable";
import { cartDataBookList, cartHeaderTable } from "../../../../data/arrays";

export default function CartBookOrder() {
  return (
    <div>
      <ITable headerList={cartHeaderTable} dataList={cartDataBookList}></ITable>
    </div>
  );
}
