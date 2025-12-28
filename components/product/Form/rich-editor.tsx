"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { forwardRef } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Editor = forwardRef<any, EditorProps>(
  (
    { value, onChange, placeholder = "Write something...", className = "" },
    ref,
  ) => {
    const modules = {
      toolbar: [
        [{ header: [false, 3, 2, 1] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        // [{ color: [] }, { background: [] }],
        // ["clean"], // remove formatting
      ],
    };

    return (
      <div ref={ref} className="quill-wrapper h-64 rounded-3xl">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          className={cn(["h-64 rounded-2xl", className])}
          style={{ height: "256px" }}
        />
      </div>
    );
  },
);

Editor.displayName = "Editor";
export { Editor };
