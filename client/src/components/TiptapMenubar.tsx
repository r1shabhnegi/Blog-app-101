import { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  CodepenIcon,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Image,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

const TiptapMenubar = ({
  editor,
  addImage,
}: {
  editor: Editor;
  addImage: () => void;
}) => {
  return (
    <div className='flex items-center flex-col md:flex-row w-full py-1.5 px-5 mb-10 gap-6 md:gap-7 lg:gap-8 xl:gap-10 rounded-xl bg-gray-0  text-gray-600 mt-6 mb- bg-gray-50 border-'>
      <div className='flex justify-between flex-1 w-full'>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${editor.isActive("bold") ? "is-active" : ""} m-1`}>
          <Bold className='w-6 h-6' />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`${editor.isActive("italic") ? "is-active" : ""} p-1`}>
          <Italic className='w-6 h-6' />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`${editor.isActive("strike") ? "is-active" : ""} p-1`}>
          <Strikethrough className='w-6 h-6' />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`${editor.isActive("code") ? "is-active" : ""} p-1`}>
          <Code className='w-6 h-6' />
        </button>
        {/* <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${
          editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          } p-1`}>
          <Heading1 className='w-6 h-6' />
      </button> */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          } p-1`}>
          <Heading2 className='w-6 h-6' />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          } p-1`}>
          <Heading3 className='w-6 h-6' />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          } p-1`}>
          <Heading4 className='w-6 h-6' />
        </button>
      </div>
      <div className='flex justify-between flex-1 w-full '>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={`${
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          } p-1`}>
          <Heading5 className='w-6 h-6' />
        </button>
        {/* <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={`${
          editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          } p-1`}>
          <Heading6 className='w-6 h-6' />
          </button> */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${editor.isActive("bulletList") ? "is-active" : ""} p-1`}>
          <List className='w-6 h-6' />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${
            editor.isActive("orderedList") ? "is-active" : ""
          } p-1`}>
          <ListOrdered className='w-6 h-6' />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${editor.isActive("codeBlock") ? "is-active" : ""} p-1`}>
          <CodepenIcon className='w-6 h-6' />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${editor.isActive("blockquote") ? "is-active" : ""} p-1`}>
          <Quote className='w-6 h-6' />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}>
          <Undo className='w-6 h-6' />
        </button>
        {/* <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}>
          <Redo className='w-6 h-6' />
        </button> */}
        <button onClick={addImage}>
          <Image className='w-6 h-6' />
        </button>
      </div>
    </div>
  );
};
export default TiptapMenubar;
