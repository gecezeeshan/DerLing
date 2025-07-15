import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Ocr = () => {
  const [fileInput, setFileInput] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pasteBoxRef = useRef(null);

  const RunOCR = async (imageFile) => {
    if (!imageFile) {
      alert("No image selected.");
      return;
    }

    setIsLoading(true);
    setOcrResult("");

    try {
      const url = `https://snipit-61pi.onrender.com/extract-text`;
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axios.post(url, formData);
      setOcrResult(response.data.text || "No text detected.");
    } catch (error) {
      console.error("OCR error", error);
      setOcrResult("Error processing the image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileInput(file);
    if (file) RunOCR(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        setFileInput(file);
        RunOCR(file);
        break;
      }
    }
  };

  useEffect(() => {
    const box = pasteBoxRef.current;
    box.addEventListener("paste", handlePaste);
    return () => box.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>OCR Tool</h1>

      <div style={{ marginBottom: "10px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div
        ref={pasteBoxRef}
        contentEditable
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          height: "150px",
          textAlign: "center",
          color: "#888",
          marginBottom: "10px",
        }}
      >
        📋 Paste image here (Ctrl+V)
      </div>

      <button onClick={() => RunOCR(fileInput)} disabled={isLoading}>
        {isLoading ? "Processing..." : "Process OCR"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>OCR Result</h3>
        <textarea
          value={ocrResult}
          readOnly
          style={{ width: "100%", height: "200px" }}
        />
      </div>
    </div>
  );
};

export default Ocr;
