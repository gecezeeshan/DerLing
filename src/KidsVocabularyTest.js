import React, { useState, useEffect, useRef, useCallback } from 'react';
import './KidsVocabularyTest.css';

export default function KidsVocabularyTest() {
  const [wordBank, setWordBank] = useState([]);
  const [wordQueue, setWordQueue] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [message, setMessage] = useState('');
  const [listening, setListening] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
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

  const scheduleNextWord = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setMessage('');
      setWordQueue((prevQueue) => {
        const [, ...rest] = prevQueue;
        const nextWord = rest[0] ?? '';
        setCurrentWord(nextWord);
        if (!nextWord) {
          setQuizComplete(true);
        }
        return rest;
      });
      timeoutRef.current = null;
    }, 1500);
  }, []);

  const checkAnswer = useCallback((answer) => {
    if (!currentWord) {
      return;
    }

    const normalized = answer.trim().toLowerCase();
    const correct = currentWord.trim().toLowerCase();
    const hasMoreWords = wordQueue.length > 1;

    setAttempted((prev) => prev + 1);
    if (normalized === correct) {
      setScore((prev) => prev + 1);
      setMessage('🎉 Correct! Great job!');
    } else {
      setMessage(`❌ Oops! The correct word was: ${currentWord}`);
    }

    setUserInput('');
    if (hasMoreWords) {
      setCurrentWord('');
      scheduleNextWord();
    } else {
      setQuizComplete(true);
      setWordQueue([]);
      setCurrentWord('');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [currentWord, scheduleNextWord, wordQueue.length]);

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

  useEffect(() => {
    if (!currentWord) {
      return undefined;
    }

    const speakTimeout = setTimeout(() => {
      speakWord();
    }, 300);

    return () => {
      clearTimeout(speakTimeout);
    };
  }, [currentWord, speakWord]);

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

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setListening(false);

      if (list.length === 0) {
        setWordBank([]);
        setWordQueue([]);
        setCurrentWord('');
        setUserInput('');
        setScore(0);
        setAttempted(0);
        setMessage('');
        setQuizComplete(false);
        return;
      }

      const shuffled = (() => {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      })();

      setWordBank(shuffled);
      setWordQueue(shuffled);
      setCurrentWord(shuffled[0] ?? '');
      setUserInput('');
      setScore(0);
      setAttempted(0);
      setMessage('');
      setQuizComplete(false);
    };

    reader.readAsText(file);
  };

  const handleCheck = () => {
    if (userInput.trim() && currentWord) {
      checkAnswer(userInput);
    }
  };

  const startListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      window.alert('Speech Recognition not supported on this browser.');
      return;
    }

    if (!currentWord) {
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

      {wordBank.length > 0 ? (
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
              placeholder={
                currentWord ? 'Type the word...' : 'All words completed! Upload a new list to play again.'
              }
              disabled={!currentWord}
            />
            <button type="button" onClick={handleCheck} disabled={!currentWord}>
              Check
            </button>
          </div>

          <p className="divider">OR</p>
          <button
            type="button"
            className={listening ? 'mic-on' : 'mic-off'}
            onClick={startListening}
            disabled={listening || !currentWord}
          >
            {listening ? '🎙️ Listening...' : '🎤 Speak the Word'}
          </button>

          <p className="message">{message}</p>
          {quizComplete && wordBank.length > 0 && (
            <p className="message completion-message">
              🎉 You completed all {wordBank.length} words! Final score: {score}/{wordBank.length}
            </p>
          )}

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
