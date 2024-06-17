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
  console.log(editorState);

  // const { complete, completion } = useCompletion({
  //   api: `${import.meta.env.VITE_BACKEND_URL}/api/v1/ai-auto`,
  // });
  // const { mutateAsync: aiAutoMutate } = useMutation({
  //   mutationFn: aiAuto,
  //   onSuccess: (response) => {
  //     console.log(response);
  //   },
  // });

  // const customText = Text.extend({
  //   addKeyboardShortcuts() {
  //     return {
  //       "shift-a": () => {
  //         const prompt = this.editor.getText().split(" ").slice(-30).join(" ");

  //         // aiAutoMutate({ prompt });
  //         return true;
  //       },
  //     };
  //   },
  // });

  const editor = useEditor({
    autofocus: true,
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        // Use a placeholder:
        placeholder: "Write something …",
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
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
  // const lastCompletion = useRef("");

  // useEffect(() => {
  //   if (!editor || !completion) return;
  //   const diff = completion.slice(lastCompletion.current.length);
  //   lastCompletion.current = completion;

  //   // console.log(token);
  //   editor?.commands.insertContent(diff);
  // }, [completion, editor]);

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
      <PublishPageNav setIsPublish={() => setIsPublish(!isPublish)} />
      <div className='flex flex-col items-center'>
        {editor && (
          <TiptapMenubar
            editor={editor}
            addImage={addImage}
          />
        )}
        <div className='w-[55rem] flex flex-col justify-center'>
          <Input
            className='h-28 text-6xl px-7 border-t-0 border-b-0 border-r-0 rounded-none outline-none ring-0 focus-visible:ring-0 text-[#565555] placeholder:text-[#a2a2a2]'
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
