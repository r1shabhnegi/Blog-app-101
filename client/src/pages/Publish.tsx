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
// import { useCompletion } from "@ai-sdk/react";
const Publish = () => {
  const [editorState, setEditorState] = useState("<h4>Write...</h4>");
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
    extensions: [StarterKit, Image],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
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

        <Input
          className='w-[43.8rem] text-6xl h-24 outline-none ring-0 focus-visible:ring-0 rounded-none placeholder:text-gray-900 border-r-0 border-t-0 border-b-0'
          placeholder='Title'
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
        />

        <EditorContent
          editor={editor}
          className='w-full pb-6 pl-3 mx-auto prose prose-xl border-l border-gray-200'
          placeholder='write'
        />
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
