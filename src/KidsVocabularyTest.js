import React, { useState, useEffect, useRef, useCallback } from 'react';
import './KidsVocabularyTest.css';

export default function KidsVocabularyTest() {
  const [words, setWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [message, setMessage] = useState('');
  const [listening, setListening] = useState(false);
  const [showWord, setShowWord] = useState(false);
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
      setAttempted((p) => p + 1);

      if (normalized === correct) {
        setScore((p) => p + 1);
        setMessage('🎉 Correct!');
      } else {
        setWrong((p) => p + 1);
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

  // ✅ Upload word list
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
        setWords(list);
        setRemainingWords(list);
        setScore(0);
        setWrong(0);
        setAttempted(0);
        setMessage('');
        const first = list[Math.floor(Math.random() * list.length)];
        setCurrentWord(first);
        setRemainingWords(list.filter((w) => w !== first));
        setTimeout(() => speakWord(), 400);
      }
    };
    reader.readAsText(file);
  };

  const handleCheck = () => {
    if (userInput.trim()) checkAnswer(userInput);
  };

  const handleSkip = () => {
    setAttempted((p) => p + 1);
    setMessage(`⏭️ Skipped! The word was: ${currentWord}`);
    setTimeout(() => pickNextWord(), 1000);
  };

  return (
    <div className="kids-vocab-container">
      <h1>🧠 Kids Vocabulary Test</h1>

      <input type="file" accept=".txt,.csv" onChange={handleFileUpload} />
      <p className="info">Upload words (one per line or comma-separated)</p>

      {words.length > 0 && currentWord ? (
        <div className="quiz-box">
          <h2>Listen carefully 👂</h2>
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

          <div className="extra-buttons">
            {!showWord && (
              <button type="button" className="show-btn" onClick={() => setShowWord(true)}>
                👀 Show Word
              </button>
            )}
            <button type="button" className="skip-btn" onClick={handleSkip}>
              ⏭️ Skip
            </button>
          </div>

          {showWord && <p className="showed-word">📖 {currentWord}</p>}

          <p className="message">{message}</p>

          <div className="score">
            <p>✅ Correct: <b>{score}</b></p>
            <p>❌ Wrong: <b>{wrong}</b></p>
            <p>📊 Attempted: <b>{attempted}</b></p>
            <p>🧾 Remaining: <b>{remainingWords.length}</b></p>
          </div>
        </div>
      ) : (
        <p className="empty-state">Upload a word list to begin the quiz.</p>
      )}
    </div>
  );
}
