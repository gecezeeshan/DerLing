import React, { useState, useEffect } from "react";
import "./KidsVocabularyTest.css";

export default function KidsSpellingBee() {
  // Core states
  const [words, setWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [spokenLetters, setSpokenLetters] = useState([]);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // 1=setup, 2=test in progress, 3=finished
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [typedList, setTypedList] = useState("");

  // ✅ Initialize Speech Recognition
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
        const letters = speech.replace(/[^A-Z]/g, "").split("");
        if (letters.length > 0) {
          setSpokenLetters((prev) => [...prev, ...letters]);
        }
      };

      recog.onend = () => setListening(false);
      setRecognition(recog);
    } else {
      alert("Speech Recognition not supported. Use Chrome browser.");
    }
  }, []);

  // ✅ File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const list = text.split(/[\n,]+/).map((w) => w.trim()).filter(Boolean);
      if (list.length > 0) initializeQuiz(list);
    };
    reader.readAsText(file);
  };

  // ✅ Manual Start
  const handleStartFromText = () => {
    const list = typedList
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter(Boolean);
    if (list.length === 0) {
      alert("Please type or paste some words first.");
      return;
    }
    initializeQuiz(list);
  };

  // ✅ Initialize quiz
  const initializeQuiz = (list) => {
    setWords(list);
    setRemainingWords(list);
    setScore(0);
    setAttempted(0);
    setMessage("");
    setSpokenLetters([]);
    setTypedAnswer("");
    setStep(2);

    const first = list[Math.floor(Math.random() * list.length)];
    setCurrentWord(first);
    setRemainingWords(list.filter((w) => w !== first));
    setTimeout(() => speakWord(first), 400);
  };

  // ✅ Speak the word
  const speakWord = (word = currentWord) => {
    if (!word) return;
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "en-US";
    utter.rate = 0.8;
    window.speechSynthesis.speak(utter);
  };

  // ✅ Listening for letters
  const startListening = () => {
    if (!recognition) return;
    setSpokenLetters([]);
    setListening(true);
    recognition.start();
  };
  const stopListening = () => {
    if (recognition) recognition.stop();
    setListening(false);
  };

  // ✅ Check the answer
  const checkAnswer = () => {
    const spoken = spokenLetters.join("").toLowerCase();
    const typed = typedAnswer.trim().toLowerCase();
    const answer = typed || spoken;
    const correct = currentWord.toLowerCase();

    if (!answer) {
      setMessage("Please type or speak the word!");
      return;
    }

    setAttempted((a) => a + 1);
    if (answer === correct) {
      setScore((s) => s + 1);
      setMessage("🎉 Correct! Great spelling!");
    } else {
      setMessage(`❌ Incorrect. The correct word was "${currentWord}".`);
    }
  };

  // ✅ Next / Retry / Skip
  const nextWord = () => {
    if (remainingWords.length === 0) {
      setStep(3);
      setMessage("🏁 You finished all the words!");
      return;
    }
    const next = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    setCurrentWord(next);
    setRemainingWords((prev) => prev.filter((w) => w !== next));
    setSpokenLetters([]);
    setTypedAnswer("");
    setMessage("");
    setTimeout(() => speakWord(next), 500);
  };

  const retryWord = () => {
    setSpokenLetters([]);
    setTypedAnswer("");
    setMessage("");
    speakWord();
  };

  const restartTest = () => {
    setStep(1);
    setWords([]);
    setRemainingWords([]);
    setTypedList("");
    setTypedAnswer("");
    setMessage("");
    setScore(0);
    setAttempted(0);
    setSpokenLetters([]);
  };

  // ✅ UI Rendering
  return (
    <div className="app-container">
      <h1>🧒 Kids Spelling Bee</h1>

      {/* 🩵 Step 1: Setup */}
      {step === 1 && (
        <div className="setup-box">
          <textarea
            className="word-input-box"
            value={typedList}
            onChange={(e) => setTypedList(e.target.value)}
            placeholder="✍️ Type or paste words here (comma or newline separated)..."
          />
          <div className="setup-buttons">

            <p className="info">OR upload a .txt/.csv file:</p>
            <input type="file" accept=".txt,.csv" onChange={handleFileUpload} />
          </div>
          <div className="start-button">
            <button onClick={handleStartFromText}>▶️ Start Test</button>
          </div>
        </div>
      )}

      {/* 🩷 Step 2: Test in progress */}
      {step === 2 && currentWord && (
        <div className="quiz-box">
          <h2>👂 Listen carefully and spell the word!</h2>

          <div className="mic-controls">
            <button className="play-button" onClick={() => speakWord()}>🔊 Play Word Again</button>

            {!listening ? (
              <button onClick={startListening}>🎤 Start Speaking</button>
            ) : (
              <button className="stop-btn" onClick={stopListening}>
                ⏹️ Stop Listening
              </button>
            )}
          </div>

          <div className="spelling-box">
            <div className="letters">
              {spokenLetters.map((l, i) => (
                <span key={i} className="letter">
                  {l}
                </span>
              ))}
            </div>
            <input
              type="text"
              className="typed-input"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="Type your answer here..."
              autoComplete="off"
              spellCheck="false"
            />
          </div>

          <div className="button-row">
            <button className="check-btn" onClick={checkAnswer}>
              ✅ Check
            </button>
            <button className="retry-btn" onClick={retryWord}>🔁 Retry</button>
            <button className="next-btn" onClick={nextWord}>⏭️ Next</button>
          </div>

          <p className="message">{message}</p>
        </div>

      )}

      {/* 💛 Step 3: Finished */}
      {step === 3 && (
        <div className="finish-box">
          <h2>🎊 Congratulations! You finished the test!</h2>
          <p>
            Final Score: <b>{score}</b> / <b>{attempted}</b>
          </p>
          <button onClick={restartTest}>🔁 Restart Test</button>
        </div>
      )}

      {/* 💬 Result Panel (Always visible) */}
      <div className="result-panel">
        <p>
          ✅ Score: <b>{score}</b> &nbsp; | &nbsp; 📊 Attempted: <b>{attempted}</b>
        </p>
        {step !== 1 && (
          <button className="restart-btn" onClick={restartTest}>
            🔄 Restart
          </button>
        )}
      </div>
    </div>
  );
}
