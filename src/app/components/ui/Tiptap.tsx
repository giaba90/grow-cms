"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListOl,
  FaListUl,
  FaHeading,
} from "react-icons/fa";
import { useState } from "react";

interface TiptapProps {
  onChange?: (content: string) => void;
}

const Tiptap = ({ onChange }: TiptapProps) => {
  const [headingLevel, setHeadingLevel] = useState(1);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Underline,
    ],

    content: "<p>Hello World!</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px]",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const saveContent = () => {
    if (editor) {
      console.log(editor.getJSON());
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full">
          <div className="flex space-x-2 mb-2 border bg-white">
            <div className="relative">
              <button className={`p-2`}>
                <FaHeading />
              </button>
              <select
                value={headingLevel}
                onChange={(e) => {
                  const level = Number(e.target.value);
                  setHeadingLevel(level);
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as any })
                    .run();
                }}
                className="absolute top-0 left-0 opacity-0 w-full h-full cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    H{level}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
            >
              <FaBold />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 ${
                editor.isActive("italic") ? "bg-gray-300" : ""
              }`}
            >
              <FaItalic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 ${
                editor.isActive("underline") ? "bg-gray-300" : ""
              }`}
            >
              <FaUnderline />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 ${
                editor.isActive("bulletList") ? "bg-gray-300" : ""
              }`}
            >
              <FaListUl />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 ${
                editor.isActive("orderedList") ? "bg-gray-300" : ""
              }`}
            >
              <FaListOl />
            </button>
          </div>
          <EditorContent editor={editor} className="border p-2 bg-white" />
        </div>
      </div>
    </>
  );
};

export default Tiptap;
