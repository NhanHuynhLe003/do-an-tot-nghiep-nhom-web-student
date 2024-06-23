import React from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaEraser,
  FaParagraph,
  FaListUl,
  FaListOl,
  FaUndo,
  FaRedo,
  FaRulerHorizontal,
} from "react-icons/fa";
import { BsEraserFill, BsBlockquoteLeft } from "react-icons/bs";
import { PiCodeBlock } from "react-icons/pi";
import { AiOutlineEnter } from "react-icons/ai";
import clsx from "clsx";
import "./IMenuBarTipTap.css";
import { useDispatch } from "react-redux";
import CvSlice from "../../redux/slices/CvSlice";

export const ToolTipTaps = {
  BOLD: "bold",
  ITALIC: "italic",
  STRIKE: "strike",
  CODE: "code",
  ERASE_MARKS: "eraseMarks",
  ERASE_NODES: "eraseNodes",
  PARAGRAPH: "paragraph",
  HEADING1: "heading1",
  HEADING2: "heading2",
  HEADING3: "heading3",
  HEADING4: "heading4",
  HEADING5: "heading5",
  HEADING6: "heading6",
  BULLET_LIST: "bulletList",
  ORDERED_LIST: "orderedList",
  CODE_BLOCK: "codeBlock",
  BLOCKQUOTE: "blockquote",
  HORIZONTAL_RULE: "horizontalRule",
  HARD_BREAK: "hardBreak",
  UNDO: "undo",
  REDO: "redo",
  COLOR: "color",
};

/**
 * @description MenuBar thanh công cụ cho edit text
 * @param {Object} props - Các thuộc tính cho component
 * @param {Object} props.editor - Editor của TipTap sử dụng useEditor để tạo ra
 * @param {String[]} props.tools - Danh sách các công cụ hiển thị trên menu bar
 * @returns {JSX.Element} Thanh công cụ menu bar
 */
const IMenuBarTipTap = ({ editor, tools, id }) => {
  // Định nghĩa các công cụ trên thanh công cụ
  const toolButtons = {
    [ToolTipTaps.BOLD]: {
      action: () => editor.chain().focus().toggleBold().run(),
      icon: <FaBold />,
      isActive: editor.isActive("bold"),
      canExecute: editor.can().chain().focus().toggleBold().run(),
    },
    [ToolTipTaps.ITALIC]: {
      action: () => editor.chain().focus().toggleItalic().run(),
      icon: <FaItalic />,
      isActive: editor.isActive("italic"),
      canExecute: editor.can().chain().focus().toggleItalic().run(),
    },
    [ToolTipTaps.STRIKE]: {
      action: () => editor.chain().focus().toggleStrike().run(),
      icon: <FaStrikethrough />,
      isActive: editor.isActive("strike"),
      canExecute: editor.can().chain().focus().toggleStrike().run(),
    },
    [ToolTipTaps.CODE]: {
      action: () => editor.chain().focus().toggleCode().run(),
      icon: <FaCode />,
      isActive: editor.isActive("code"),
      canExecute: editor.can().chain().focus().toggleCode().run(),
    },
    [ToolTipTaps.ERASE_MARKS]: {
      action: () => editor.chain().focus().unsetAllMarks().run(),
      icon: <FaEraser />,
    },
    [ToolTipTaps.ERASE_NODES]: {
      action: () => editor.chain().focus().clearNodes().run(),
      icon: <BsEraserFill />,
    },
    [ToolTipTaps.PARAGRAPH]: {
      action: () => editor.chain().focus().setParagraph().run(),
      icon: <FaParagraph />,
      isActive: editor.isActive("paragraph"),
    },
    [ToolTipTaps.HEADING1]: {
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      icon: "H1",
      isActive: editor.isActive("heading", { level: 1 }),
    },
    [ToolTipTaps.HEADING2]: {
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: "H2",
      isActive: editor.isActive("heading", { level: 2 }),
    },
    [ToolTipTaps.HEADING3]: {
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      icon: "H3",
      isActive: editor.isActive("heading", { level: 3 }),
    },
    [ToolTipTaps.HEADING4]: {
      action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      icon: "H4",
      isActive: editor.isActive("heading", { level: 4 }),
    },
    [ToolTipTaps.HEADING5]: {
      action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      icon: "H5",
      isActive: editor.isActive("heading", { level: 5 }),
    },
    [ToolTipTaps.HEADING6]: {
      action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      icon: "H6",
      isActive: editor.isActive("heading", { level: 6 }),
    },
    [ToolTipTaps.BULLET_LIST]: {
      action: () => editor.chain().focus().toggleBulletList().run(),
      icon: <FaListUl />,
      isActive: editor.isActive("bulletList"),
    },
    [ToolTipTaps.ORDERED_LIST]: {
      action: () => editor.chain().focus().toggleOrderedList().run(),
      icon: <FaListOl />,
      isActive: editor.isActive("orderedList"),
    },
    [ToolTipTaps.CODE_BLOCK]: {
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      icon: <PiCodeBlock />,
      isActive: editor.isActive("codeBlock"),
    },
    [ToolTipTaps.BLOCKQUOTE]: {
      action: () => editor.chain().focus().toggleBlockquote().run(),
      icon: <BsBlockquoteLeft />,
      isActive: editor.isActive("blockquote"),
    },
    [ToolTipTaps.HORIZONTAL_RULE]: {
      action: () => editor.chain().focus().setHorizontalRule().run(),
      icon: <FaRulerHorizontal />,
    },
    [ToolTipTaps.HARD_BREAK]: {
      action: () => editor.chain().focus().setHardBreak().run(),
      icon: <AiOutlineEnter />,
    },
    [ToolTipTaps.UNDO]: {
      action: () => editor.chain().focus().undo().run(),
      icon: <FaUndo />,
      canExecute: editor.can().chain().focus().undo().run(),
    },
    [ToolTipTaps.REDO]: {
      action: () => editor.chain().focus().redo().run(),
      icon: <FaRedo />,
      canExecute: editor.can().chain().focus().redo().run(),
    },
    [ToolTipTaps.COLOR]: {
      action: (event) =>
        editor.chain().focus().setColor(event.target.value).run(),
      icon: null,
      isActive: editor.isActive("textStyle", {
        color: editor.getAttributes("textStyle").color,
      }),
      value: editor.getAttributes("textStyle").color || "#000000",
    },
  };

  return (
    <div className="ITipTapEditor___listToolBarButtons" id={id}>
      {tools.map((tool) => {
        const toolConfig = toolButtons[tool];
        if (!toolConfig) return null;

        // Đối với công cụ màu sắc, sử dụng input type color sẽ đặc biệt
        if (tool === ToolTipTaps.COLOR) {
          return (
            <input
              key={tool}
              className={clsx(
                "ITipTapEditor___buttonTool",
                "ITipTapEditor___ColorPicker",
                toolConfig.isActive ? "is-active" : ""
              )}
              type="color"
              onInput={toolConfig.action}
              value={toolConfig.value}
              data-testid="setColor"
            />
          );
        }

        return (
          <button
            key={tool}
            onClick={() => {
              toolConfig.action();
              // dispatch(CvSlice.actions.setEditorContent(editor))
            }}
            disabled={toolConfig.canExecute === false}
            className={clsx(
              "ITipTapEditor___buttonTool",
              toolConfig.isActive ? "is-active" : ""
            )}
          >
            {toolConfig.icon}
          </button>
        );
      })}
    </div>
  );
};

export default IMenuBarTipTap;
