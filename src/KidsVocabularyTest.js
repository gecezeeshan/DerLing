import React, { useState, useEffect, useRef, useCallback } from "react";
import "./KidsVocabularyTest.css";

export default function KidsSpellingBee() {
  const [words, setWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [typedList, setTypedList] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [results, setResults] = useState([]);
  const recognitionRef = useRef(null);

  const speakWord = useCallback(() => {
    if (!currentWord || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }, [currentWord]);

const pickNextWord = useCallback(() => {
  if (remainingWords.length === 0) {
    setCurrentWord("");
    return;
  }

  const randomIndex = Math.floor(Math.random() * remainingWords.length);
  const nextWord = remainingWords[randomIndex];

  const updatedRemaining = [...remainingWords];
  updatedRemaining.splice(randomIndex, 1);

  setRemainingWords(updatedRemaining);
  setCurrentWord(nextWord);

  // ✅ Do NOT auto speak on check
}, [remainingWords]);

  const checkAnswer = useCallback(
    (answer) => {
      if (!currentWord) return;
      const normalized = answer.trim().toLowerCase();
      const correct = currentWord.trim().toLowerCase();
      const isCorrect = normalized === correct;
      setResults((prev) => [...prev, { word: currentWord, correct: isCorrect }]);
      if (isCorrect) {
        setCorrectCount((p) => p + 1);
        setMessage("✅ Correct!");
      } else {
        setWrongCount((p) => p + 1);
        setMessage(`❌ Wrong! Correct word: ${currentWord}`);
      }
      setUserInput("");
      setTimeout(() => pickNextWord(), 1000);
    },
    [currentWord, pickNextWord]
  );

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      checkAnswer(transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, [checkAnswer]);

  const startListening = () => {
    if (!recognitionRef.current)
      return alert("Speech Recognition not supported in this browser.");
    setListening(true);
    recognitionRef.current.start();
  };

const initializeQuiz = (list) => {
  setWords(list);
  setRemainingWords(list);
  setCorrectCount(0);
  setWrongCount(0);
  setResults([]);
  setMessage("");

  const first = list[Math.floor(Math.random() * list.length)];
  setCurrentWord(first);
  setRemainingWords(list.filter((w) => w !== first));

  // ✅ Speak once when quiz starts
  setTimeout(() => speakWord(first), 400);
};


  const handleStartFromText = () => {
    const list = typedList
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter(Boolean);
    if (!list.length) return alert("Please enter words first.");
    initializeQuiz(list);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const list = text.split(/[\n,]+/).map((w) => w.trim()).filter(Boolean);
      if (list.length > 0) initializeQuiz(list);
    };
    reader.readAsText(file);
  };

  const quizFinished = results.length === words.length && words.length > 0;

  return (
    <div className="kids-vocab-container">
      <h1>🧠 Kids Vocabulary Test</h1>

      {/* Input Section */}
      {!words.length && (
        <>
          <textarea
            className="word-input-box"
            value={typedList}
            onChange={(e) => setTypedList(e.target.value)}
            placeholder="Type or paste words here..."
          />
          <button onClick={handleStartFromText}>▶️ Start Test</button>
          <p className="info">OR Upload a .txt/.csv file:</p>
          <input type="file" accept=".txt,.csv" onChange={handleFileUpload} />
        </>
      )}

      {/* Quiz In Progress */}
      {currentWord && !quizFinished && (
        <div className="quiz-box">
          <h2>Word {results.length + 1} / {words.length}</h2>
          <button onClick={speakWord}>🔊 Play Word</button>

          <div className="input-area">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the word..."
            />
            <button onClick={() => checkAnswer(userInput)}>✅ Check</button>
          </div>

          <p className="divider">OR</p>
          <button onClick={startListening} disabled={listening}>
            {listening ? "🎙️ Listening..." : "🎤 Speak"}
          </button>

          {/* NEW BUTTONS */}
          <div className="extra-buttons">
            <button
              className="retry-btn"
              onClick={() => {
                setUserInput("");
                speakWord();
                setMessage("🔁 Listen again and retry!");
              }}
            >
              🔁 Retry Word
            </button>

            <button
              className="skip-btn"
              onClick={() => {
                setResults((prev) => [...prev, { word: currentWord, correct: false }]);
                setWrongCount((p) => p + 1);
                setMessage(`⏭️ Skipped! Word was: ${currentWord}`);
                setTimeout(() => pickNextWord(), 800);
              }}
            >
              ⏭️ Next / Skip
            </button>
          </div>

          <p className="message">{message}</p>
        </div>
      )}

      {/* Results */}
      {quizFinished && (
        <div className="result-box">
          <h2>🎉 Test Completed!</h2>
          <p>✅ Correct: <b>{correctCount}</b></p>
          <p>❌ Incorrect: <b>{wrongCount}</b></p>

          <h3>📋 Word Results:</h3>
          <ul>
            {results.map((r, i) => (
              <li key={i}>
                {i + 1}. {r.word} — {r.correct ? "✅" : "❌"}
              </li>
            ))}
          </ul>

          <button onClick={() => window.location.reload()}>🔄 Restart Test</button>
        </div>
      )}
    </div>
  );
}
