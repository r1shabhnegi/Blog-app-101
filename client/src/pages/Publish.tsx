import PublishPageNav from "@/components/PublishPageNav";
import TiptapMenubar from "@/components/TiptapMenubar";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Text } from "@tiptap/extension-text";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
const Publish = () => {
  const [editorState, setEditorState] = useState("<h1>Title</h1>");

  console.log(editorState);

  const { complete, completion } = useCompletion({
    api: `${import.meta.env.VITE_BACKEND_URL}/api/v1/ai-auto`,
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "shift-a": () => {
          const prompt = this.editor.getText().split(" ").slice(-30);
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });
  const lastCompletion = useRef("");

  useEffect(() => {
    if (!editor || !completion) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;

    // console.log(token);
    editor?.commands.insertContent(diff);
  }, [completion, editor]);

  return (
    <div className='mx-auto w-full flex flex-col bg-red-00 max-w-[65rem]'>
      <PublishPageNav />
      <div className='flex flex-col items-center'>
        {editor && <TiptapMenubar editor={editor} />}
        <EditorContent
          editor={editor}
          className='prose prose-xl mx-auto w-[55rem]'
        />
      </div>
    </div>
  );
};
export default Publish;
