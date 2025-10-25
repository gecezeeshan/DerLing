import React, { useState, useEffect, useRef, useCallback } from 'react';
import './KidsVocabularyTest.css';

export default function KidsVocabularyTest() {
  const [words, setWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [typedList, setTypedList] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [message, setMessage] = useState('');
  const [listening, setListening] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [results, setResults] = useState([]);
  const recognitionRef = useRef(null);

  // ✅ Speak the word
  const speakWord = useCallback(() => {
    if (!currentWord || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }, [currentWord]);

  // ✅ Pick next word
  const pickNextWord = useCallback(() => {
    if (remainingWords.length === 0) {
      setCurrentWord('');
      setMessage('🎉 Quiz Finished!');
      return;
    }
    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    const nextWord = remainingWords[randomIndex];
    const updated = [...remainingWords];
    updated.splice(randomIndex, 1);
    setRemainingWords(updated);
    setCurrentWord(nextWord);
    setShowWord(false);
    setTimeout(() => speakWord(), 400);
  }, [remainingWords, speakWord]);

  // ✅ Check answer
  const checkAnswer = useCallback(
    (answer) => {
      if (!currentWord) return;
      const normalized = answer.trim().toLowerCase();
      const correct = currentWord.trim().toLowerCase();

      const isCorrect = normalized === correct;
      setResults((prev) => [...prev, { word: currentWord, correct: isCorrect }]);

      if (isCorrect) {
        setCorrectCount((p) => p + 1);
        setMessage('🎉 Correct!');
      } else {
        setWrongCount((p) => p + 1);
        setMessage(`❌ Wrong! The correct word was: ${currentWord}`);
      }

      setUserInput('');
      setTimeout(() => pickNextWord(), 1500);
    },
    [currentWord, pickNextWord]
  );

  // ✅ Speech recognition setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      checkAnswer(transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [checkAnswer]);

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert('Speech Recognition not supported on this browser.');
      return;
    }
    setListening(true);
    try {
      recognition.start();
    } catch (error) {
      console.error('Speech error', error);
      setListening(false);
    }
  };

  // ✅ Upload file
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') return;

      const list = text
        .split(/[\n,]+/)
        .map((w) => w.trim())
        .filter(Boolean);

      if (list.length > 0) {
        initializeQuiz(list);
      }
    };
    reader.readAsText(file);
  };

  // ✅ Start quiz from typed words
  const handleStartFromText = () => {
    const list = typedList
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter(Boolean);

    if (list.length === 0) {
      alert('Please type or paste some words first.');
      return;
    }
    initializeQuiz(list);
  };

  // ✅ Common quiz initializer
  const initializeQuiz = (list) => {
    setWords(list);
    setRemainingWords(list);
    setCorrectCount(0);
    setWrongCount(0);
    setResults([]);
    setMessage('');
    const first = list[Math.floor(Math.random() * list.length)];
    setCurrentWord(first);
    setRemainingWords(list.filter((w) => w !== first));
    setTimeout(() => speakWord(), 400);
  };

  const handleCheck = () => {
    if (userInput.trim()) checkAnswer(userInput);
  };

  // ✅ Quiz finished
  const quizFinished = !currentWord && results.length === words.length;

  return (
    <div className="kids-vocab-container">
      <h1>🧠 Kids Vocabulary Test</h1>

      {/* 🔤 Input Section */}
      {!words.length && (
        <>
          <textarea
            className="word-input-box"
            value={typedList}
            onChange={(e) => setTypedList(e.target.value)}
            placeholder="Type or paste words here (comma or newline separated)..."
          />
          <button type="button" onClick={handleStartFromText}>
            ▶️ Start Test
          </button>
          <p className="info">OR upload a .txt/.csv file:</p>
          <input type="file" accept=".txt,.csv" onChange={handleFileUpload} />
        </>
      )}

      {/* 🎮 Quiz Active */}
      {words.length > 0 && currentWord && !quizFinished && (
        <div className="quiz-box">
          <h2>
            Word {words.length - remainingWords.length}/{words.length}
          </h2>
          <h3>Listen carefully 👂</h3>
          <button type="button" onClick={speakWord}>🔊 Play Word</button>

          <div className="input-area">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the word..."
            />
            <button type="button" onClick={handleCheck}>Check</button>
          </div>

          <p className="divider">OR</p>

          <button
            type="button"
            className={listening ? 'mic-on' : 'mic-off'}
            onClick={startListening}
            disabled={listening}
          >
            {listening ? '🎙️ Listening...' : '🎤 Speak the Word'}
          </button>

          {showWord ? (
            <p className="showed-word">📖 {currentWord}</p>
          ) : (
            <button type="button" className="show-btn" onClick={() => setShowWord(true)}>
              👀 Show Word
            </button>
          )}

          <p className="message">{message}</p>
        </div>
      )}

      {/* ✅ Final Results */}
      {quizFinished && (
        <div className="result-box">
          <h2>🎉 Test Completed!</h2>
          <p>✅ Correct: <b>{correctCount}</b></p>
          <p>❌ Incorrect: <b>{wrongCount}</b></p>

          <h3>📋 Word Results:</h3>
          <ul>
            {results.map((r, i) => (
              <li key={i}>
                {i + 1}. {r.word} — {r.correct ? '✅ Correct' : '❌ Incorrect'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!words.length && <p className="empty-state">Enter or upload words to begin the quiz.</p>}
    </div>
  );
}
