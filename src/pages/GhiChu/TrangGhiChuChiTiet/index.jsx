import React from "react";
import style from "./TrangGhiChuChiTiet.module.css"
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function TrangGhiChuChiTiet() {
  const editor = useCreateBlockNote();
  return <div className={style.GhiChuChiTiet}>
    <div>
      <BlockNoteView editor={editor} className={"TrangGhiChuChiTiet___BlockNoteView"} />
    </div>

  </div>
}
