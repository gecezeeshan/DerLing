import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Ocr = () => {
    const [ocrResult, setOcrResult] = useState("");
    const [processingTime, setProcessingTime] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);

    const API_URL = "https://snipit-61pi.onrender.com/extract-text";

    const runOCR = async (imageFile) => {
        if (!imageFile) {
            toast.error("No image selected.");
            return;
        }

        setIsLoading(true);
        setOcrResult("");
        setProcessingTime(null);

        const startTime = Date.now();

        try {
            const formData = new FormData();
            formData.append("image", imageFile);

            const response = await axios.post(API_URL, formData);
            let text = response.data.text || "No text detected.";
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);

            // Optional watermark removal logic (adjust as needed)
            text = text.replace(/(snipit|render)/gi, "");

            setOcrResult(text);
            setProcessingTime(duration);
            toast.success(`⏱ Processed in ${duration} seconds`);

            setHistory((prev) => {
                const newHistory = [...prev, { name: `#${prev.length + 1}`, time: parseFloat(duration) }];
                return newHistory.slice(-5); // keep last 5
            });
        } catch (error) {
            console.error("OCR Error:", error);
            toast.error("OCR failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) runOCR(file);
    };

    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.includes("image")) {
                const file = item.getAsFile();
                runOCR(file);
                break;
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) runOCR(file);
    };

    const handleDragOver = (e) => e.preventDefault();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(ocrResult);
        toast.info("Copied to clipboard");
    };

    const refreshPage = () => {
        setOcrResult("");
        setProcessingTime(null);
        setHistory([]);
        fileInputRef.current.value = "";
    };

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
            <h2>🧾 OCR - Text Recognition</h2>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ marginBottom: "10px" }}
            />

            <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                    border: "2px dashed #888",
                    padding: "30px",
                    textAlign: "center",
                    marginBottom: "15px",
                    background: "#f9f9f9",
                }}
            >
                📥 Drag & Drop or Paste an Image (Ctrl+V)
            </div>

            <button onClick={() => copyToClipboard()} disabled={!ocrResult}>📋 Copy</button>
            <button onClick={refreshPage} style={{ marginLeft: "10px" }}>🔄 Refresh</button>

            <div style={{ marginTop: "20px" }}>
                <textarea
                    value={ocrResult}
                    readOnly
                    style={{ width: "100%", height: "200px", padding: "10px" }}
                ></textarea>
                {isLoading && <p>⏳ Processing...</p>}
                {processingTime && <p style={{ fontStyle: "italic" }}>⏱ Processed in {processingTime} seconds</p>}
            </div>

            {history.length > 0 && (
                <div style={{ height: 200, marginTop: "30px" }}>
                    <h4>🧠 Last 5 Processing Times</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={history}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="time" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default Ocr;
