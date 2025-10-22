import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [spokenLetters, setSpokenLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.lang = "en-US";
      recog.continuous = true;
      recog.interimResults = false;

      recog.onresult = (event) => {
        const speech = event.results[event.results.length - 1][0].transcript
          .trim()
          .toUpperCase();

        // Extract letters only (A-Z)
        const letters = speech.replace(/[^A-Z]/g, "").split("");
        if (letters.length > 0) {
          setSpokenLetters((prev) => [...prev, ...letters]);
        }
      };

      recog.onend = () => setListening(false);
      setRecognition(recog);
    } else {
      alert("Speech Recognition not supported on this browser. Use Chrome.");
    }
  }, []);

  // File upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const list = text.split(/[\n,]+/).map((w) => w.trim()).filter(Boolean);
      setWords(list);
      pickRandomWord(list);
    };
    reader.readAsText(file);
  };

  // Speak word aloud
  const speakWord = () => {
    if (!currentWord) return;
    const utter = new SpeechSynthesisUtterance(currentWord);
    utter.lang = "en-US";
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
  };

  // Pick random word
  const pickRandomWord = (list = words) => {
    if (list.length > 0) {
      const next = list[Math.floor(Math.random() * list.length)];
      setCurrentWord(next);
      setSpokenLetters([]);
      setMessage("");
    }
  };

  // Start listening for letters
  const startListening = () => {
    if (!recognition) return;
    setSpokenLetters([]);
    setListening(true);
    recognition.start();
  };

  // Stop listening
  const stopListening = () => {
    if (recognition) recognition.stop();
    setListening(false);
  };

  // Check spelling
  const checkAnswer = () => {
    const spelledWord = spokenLetters.join("").toLowerCase();
    const correct = currentWord.toLowerCase();

    setAttempted((a) => a + 1);
    if (spelledWord === correct) {
      setScore((s) => s + 1);
      setMessage("🎉 Correct! Great spelling!");
    } else {
      setMessage(`❌ Incorrect. The word was "${currentWord}".`);
    }

    setTimeout(() => {
      pickRandomWord();
      speakWord();
    }, 2000);
  };

  return (
    <div className="app-container">
      <h1>🧒 Spelling Bee App</h1>

      <input type="file" accept=".txt,.csv" onChange={handleFileUpload} />
      <p className="info">Upload words (one per line or comma-separated)</p>

      {words.length > 0 && (
        <div className="quiz-box">
          <h2>Listen to the word and spell it letter by letter!</h2>
          <button onClick={speakWord}>🔊 Play Word</button>

          <div className="mic-controls">
            {!listening ? (
              <button onClick={startListening}>🎤 Start Speaking</button>
            ) : (
              <button className="stop-btn" onClick={stopListening}>
                ⏹️ Stop Listening
              </button>
            )}
          </div>

          <div className="spelling-box">
            <h3>📝 Your Spelling:</h3>
            <div className="letters">
              {spokenLetters.map((l, i) => (
                <span key={i} className="letter">
                  {l}
                </span>
              ))}
            </div>
          </div>

          <button className="check-btn" onClick={checkAnswer}>
            ✅ Check
          </button>

          <p className="message">{message}</p>

          <div className="score">
            <p>✅ Score: {score}</p>
            <p>📊 Attempted: {attempted}</p>
          </div>
        </div>
      )}
    </div>
  );
}
