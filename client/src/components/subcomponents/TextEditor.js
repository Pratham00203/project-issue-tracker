import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TextEditor({ description, setDescription }) {
  return (
    <ReactQuill
      theme='snow'
      value={description}
      onChange={setDescription}
      style={{ height: "150px", marginBottom: "45px", fontSize: "16px" }}
    />
  );
}
