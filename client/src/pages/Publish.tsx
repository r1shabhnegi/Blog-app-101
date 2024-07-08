import PublishPageNav from "@/components/PublishPageNav";
import TiptapMenubar from "@/components/TiptapMenubar";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Text } from "@tiptap/extension-text";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import { useMutation } from "@tanstack/react-query";
import { aiAuto } from "@/api";
import { Input } from "@/components/ui/input";
import PublishCard from "@/components/PublishCard";
import Placeholder from "@tiptap/extension-placeholder";
// import { useCompletion } from "@ai-sdk/react";
const Publish = () => {
  const [editorState, setEditorState] = useState("");
  const [isPublish, setIsPublish] = useState(false);
  const [titleValue, setTitleValue] = useState("");

  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
    ],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none text-gray-200",
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className='mx-auto w-full flex flex-col bg-red-00 max-w-[65rem]'>
      <PublishPageNav
        setIsPublish={() => setIsPublish(!isPublish)}
        isPublish={titleValue.length > 0 && editorState.length > 9}
      />
      <div className='flex flex-col items-center'>
        {editor && (
          <TiptapMenubar
            editor={editor}
            addImage={addImage}
          />
        )}
        <div className=' xl:w-[55rem] flex flex-col justify-center items-center'>
          <Input
            className='h-28 text-4xl md:text-5xl lg:text-6xl px-7 border-t-0 border-b-0 border-r-0 rounded-none outline-none ring-0 focus-visible:ring-0 text-[#565555] placeholder:text-[#a2a2a2]'
            placeholder='Title'
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
          />

          <EditorContent
            editor={editor}
            className='w-full pb-6 pl-3 mx-auto border-l border-gray-200'
            placeholder='write'
          />
        </div>
      </div>
      {isPublish ? (
        <PublishCard
          cancel={() => setIsPublish(!isPublish)}
          titleValue={titleValue}
          editorValue={editorState}
        />
      ) : null}
    </div>
  );
};
export default Publish;
