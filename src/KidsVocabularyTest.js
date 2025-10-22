import React, { useState, useEffect, useRef, useCallback } from 'react';
import './KidsVocabularyTest.css';

export default function KidsVocabularyTest() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [message, setMessage] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const speakWord = useCallback(() => {
    if (!currentWord) {
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWord);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentWord]);

  const pickRandomWord = useCallback(() => {
    if (words.length === 0) {
      setCurrentWord('');
      return '';
    }

    const nextWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(nextWord);
    return nextWord;
  }, [words]);

  const resetRound = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const nextWord = pickRandomWord();
      setMessage('');
      if (nextWord) {
        setTimeout(() => speakWord(), 200);
      }
    }, 1500);
  }, [pickRandomWord, speakWord]);

  const checkAnswer = useCallback((answer) => {
    if (!currentWord) {
      return;
    }

    const normalized = answer.trim().toLowerCase();
    const correct = currentWord.trim().toLowerCase();

    setAttempted((prev) => prev + 1);
    if (normalized === correct) {
      setScore((prev) => prev + 1);
      setMessage('🎉 Correct! Great job!');
    } else {
      setMessage(`❌ Oops! The correct word was: ${currentWord}`);
    }

    setUserInput('');
    resetRound();
  }, [currentWord, resetRound]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      checkAnswer(transcript);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [checkAnswer]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') {
        return;
      }

      const list = text
        .split(/[\n,]+/)
        .map((word) => word.trim())
        .filter(Boolean);

      setWords(list);
      setScore(0);
      setAttempted(0);
      setMessage('');
      setCurrentWord('');

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (list.length > 0) {
        const nextWord = list[Math.floor(Math.random() * list.length)];
        setCurrentWord(nextWord);
        setTimeout(() => speakWord(), 300);
      }
    };

    reader.readAsText(file);
  };

  const handleCheck = () => {
    if (userInput.trim()) {
      checkAnswer(userInput);
    }
  };

  const startListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      window.alert('Speech Recognition not supported on this browser.');
      return;
    }

    setListening(true);
    try {
      recognition.start();
    } catch (error) {
      setListening(false);
      console.error('Unable to start speech recognition', error);
    }
  };

  return (
    <div className="kids-vocab-container">
      <h1>🧠 Kids Vocabulary Test</h1>

      <input type="file" accept=".txt,.csv" onChange={handleFileUpload} />
      <p className="info">Upload words (one per line or comma-separated)</p>

      {words.length > 0 ? (
        <div className="quiz-box">
          <h2>Listen carefully 👂</h2>
          <button type="button" onClick={speakWord} disabled={!currentWord}>
            🔊 Play Word
          </button>

          <div className="input-area">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the word..."
            />
            <button type="button" onClick={handleCheck}>
              Check
            </button>
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

          <p className="message">{message}</p>

          <div className="score">
            <p>
              ✅ Score: <span className="score-value">{score}</span>
            </p>
            <p>
              📊 Attempted: <span className="score-value">{attempted}</span>
            </p>
          </div>
        </div>
      ) : (
        <p className="empty-state">Upload a word list to begin the quiz.</p>
      )}
    </div>
  );
}
