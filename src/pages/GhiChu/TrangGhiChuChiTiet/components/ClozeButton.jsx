import {
  useBlockNoteEditor,
  useComponentsContext,
  useEditorContentOrSelectionChange,
} from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { useState } from "react";

// Custom Formatting Toolbar Button to toggle blue text & background color.
export function ClozeButton() {
  const editor = useBlockNoteEditor();

  const Components = useComponentsContext();

  // Tracks whether the text & background are both blue.
  const [isSelected, setIsSelected] = useState(

    editor.getActiveStyles().textColor === "black" &&
      editor.getActiveStyles().backgroundColor === "yellow"
  );

  // Updates state on content or selection change.
  useEditorContentOrSelectionChange(() => {
    setIsSelected(

      editor.getActiveStyles().textColor === "black" &&
        editor.getActiveStyles().backgroundColor === "yellow"
    );
  }, editor);

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={"Black Text & Yellow Background"}
      onClick={() => {
        editor.toggleStyles({
          textColor: "black",
          backgroundColor: "yellow",
        });
      }}
      isSelected={isSelected}
    >
      Highlight
    </Components.FormattingToolbar.Button>
  );
}
