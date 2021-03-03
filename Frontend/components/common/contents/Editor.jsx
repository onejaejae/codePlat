import React, { useRef, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import "quill/dist/quill.snow.css";
import styled from "styled-components";

/**
 * @author 박진호
 * @version 1.0
 * @summary 포스트 작성 에디터 컴포넌트
 */

// highlightjs config

hljs.configure({
  languages: [
    "javascript",
    "ruby",
    "python",
    "rust",
    "c",
    "c++",
    "go",
    "java",
    "rust",
    "kotlin",
    "typescript",
  ],
});

// style

const EditorBlock = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;
const TitleInput = styled.input`
  font-size: 1.2rem;
  outline: none;
  padding-bottom: 0.2rem;
  border: none;
  border-bottom: 1px solid #aaa;
  margin-bottom: 1rem;
  width: 100%;
`;
const QuillWrapper = styled.div`
  .ql-editor {
    padding: 20px;
    min-height: 320px;
    font-size: 1rem;
    line-height: 1.5;
  }
  .ql-editor.ql-blank::before {
    left: 20px;
  }
`;

const Editor = ({ onChangeTitle, onChangeDescription, description, title }) => {
  // local state

  const Quill = typeof window === "object" ? require("quill") : () => false;
  const quillElement = useRef(null);
  const quillInstance = useRef(null);

  // hooks

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: "snow",
      placeholder: "내용을 입력해주세요.",
      modules: {
        syntax: { highlight: (text) => hljs.highlightAuto(text).value },
        toolbar: [
          [{ header: "1" }, { header: "2" }],
          [{ color: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          [{ size: ["small", false, "large", "huge"] }],
        ],
      },
    });
    const quill = quillInstance.current;
    quill.root.innerHTML = description;
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        onChangeDescription(quill.root.innerHTML);
      }
    });

    return () => {};
  }, [onChangeDescription]);

  return (
    <EditorBlock>
      <TitleInput
        placeholder="제목을 입력해주세요."
        onChange={onChangeTitle}
        defaultValue={title}
      ></TitleInput>
      <QuillWrapper>
        <div ref={quillElement}></div>
      </QuillWrapper>
    </EditorBlock>
  );
};

export default Editor;
