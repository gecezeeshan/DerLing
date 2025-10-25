import React, { useCallback, useMemo, useState } from "react";
import "./KidsHangman.css";

export default function KidsHangman() {
  const [typedList, setTypedList] = useState("");
  const [words, setWords] = useState([]);
  const [remaining, setRemaining] = useState([]);
  const [current, setCurrent] = useState("");
  const [guessed, setGuessed] = useState(new Set());
  const [wrong, setWrong] = useState(0);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const MAX_WRONG = 6;

  const letters = useMemo(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), []);

  const normalizedWord = current.toUpperCase();

  const masked = useMemo(() => {
    return normalizedWord
      .split("")
      .map((ch) => (/[A-Z]/.test(ch) ? (guessed.has(ch) ? ch : "_") : ch))
      .join(" ");
  }, [normalizedWord, guessed]);

  const quizFinished = results.length === words.length && words.length > 0;

  const initRound = useCallback((list) => {
    const index = Math.floor(Math.random() * list.length);
    const word = list[index];
    const rest = list.filter((_, i) => i !== index);
    setCurrent(word);
    setRemaining(rest);
    setGuessed(new Set());
    setWrong(0);
    setMessage("");
  }, []);

  const initializeQuiz = useCallback(
    (list) => {
      const clean = list.map((w) => w.trim()).filter(Boolean);
      if (!clean.length) return;
      setWords(clean);
      setResults([]);
      initRound(clean);
    },
    [initRound]
  );

  const nextWord = useCallback(
    (solved) => {
      setResults((prev) => [...prev, { word: current, solved }]);
      if (remaining.length === 0) {
        setCurrent("");
        return;
      }
      initRound(remaining);
    },
    [current, remaining, initRound]
  );

  const onLetterClick = (ch) => {
    if (!current || quizFinished || guessed.has(ch)) return;

    const newSet = new Set(guessed);
    newSet.add(ch);
    setGuessed(newSet);

    if (!normalizedWord.includes(ch)) {
      const newWrong = wrong + 1;
      setWrong(newWrong);

      if (newWrong >= MAX_WRONG) {
        setMessage(`❌ Out of tries! Word was: ${current}`);
        setTimeout(() => nextWord(false), 900);
      }
      return;
    }

    // Check solved
    if (normalizedWord.split("").every((c) => !/[A-Z]/.test(c) || newSet.has(c))) {
      setMessage("🎉 Great job! You solved it!");
      setTimeout(() => nextWord(true), 800);
    }
  };

  const onRetry = () => {
    setGuessed(new Set());
    setWrong(0);
    setMessage("🔁 Try again!");
  };

  const onSkip = () => {
    setMessage(`⏭️ Skipped! Word was: ${current}`);
    setTimeout(() => nextWord(false), 700);
  };

  const onRestart = () => {
    setTypedList("");
    setWords([]);
    setRemaining([]);
    setCurrent("");
    setGuessed(new Set());
    setWrong(0);
    setResults([]);
    setMessage("");
  };

  const handleStartFromText = () => {
    const list = typedList.split(/[\n,]+/).map((w) => w.trim()).filter(Boolean);
    if (!list.length) return alert("Please enter some words first.");
    initializeQuiz(list);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const list = text.split(/[\n,]+/).map((w) => w.trim()).filter(Boolean);
      initializeQuiz(list);
    };
    reader.readAsText(file);
  };

  const HangmanSVG = () => (
    <svg width="170" height="180" viewBox="0 0 170 180">
      <line x1="20" y1="170" x2="120" y2="170" stroke="#444" strokeWidth="4" />
      <line x1="60" y1="170" x2="60" y2="20" stroke="#444" strokeWidth="4" />
      <line x1="60" y1="20" x2="120" y2="20" stroke="#444" strokeWidth="4" />
      <line x1="120" y1="20" x2="120" y2="40" stroke="#444" strokeWidth="4" />

      {wrong > 0 && <circle cx="120" cy="55" r="15" stroke="#e24a4a" strokeWidth="4" fill="none" />}
      {wrong > 1 && <line x1="120" y1="70" x2="120" y2="110" stroke="#e24a4a" strokeWidth="4" />}
      {wrong > 2 && <line x1="120" y1="80" x2="100" y2="95" stroke="#e24a4a" strokeWidth="4" />}
      {wrong > 3 && <line x1="120" y1="80" x2="140" y2="95" stroke="#e24a4a" strokeWidth="4" />}
      {wrong > 4 && <line x1="120" y1="110" x2="105" y2="135" stroke="#e24a4a" strokeWidth="4" />}
      {wrong > 5 && <line x1="120" y1="110" x2="135" y2="135" stroke="#e24a4a" strokeWidth="4" />}
    </svg>
  );

  return (
    <div className="kids-hangman">
      <h1>🪢 Kids Hangman</h1>

      {!words.length && (
        <div className="setup-card">
          <textarea
            className="word-input"
            value={typedList}
            onChange={(e) => setTypedList(e.target.value)}
            placeholder="Type or paste words here..."
          />
          <button onClick={handleStartFromText}>▶️ Start Game</button>
          <p className="info">or upload a word file:</p>
          <input type="file" accept=".txt,.csv" onChange={handleFileUpload} />
        </div>
      )}

      {!!current && !quizFinished && (
        <div className="game-card">
          <div className="status-row">
            <span>Word {results.length + 1} / {words.length}</span>
            <span>❌ {wrong} / {MAX_WRONG}</span>
          </div>

          <div className="board">
            <HangmanSVG />
            <div className="masked">{masked}</div>
          </div>

          <div className="keyboard">
            {letters.map((l) => (
              <button
                key={l}
                disabled={guessed.has(l) || wrong >= MAX_WRONG}
                className="key"
                onClick={() => onLetterClick(l)}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="actions">
            <button className="retry" onClick={onRetry}>🔁 Retry</button>
            <button className="skip" onClick={onSkip}>⏭️ Skip</button>
          </div>

          <div className="message">{message}</div>
        </div>
      )}

      {quizFinished && (
        <div className="results-card">
          <h2>🎉 Finished!</h2>
          <p>
            ✅ Correct: {results.filter((r) => r.solved).length} &nbsp;|&nbsp;
            ❌ Wrong: {results.filter((r) => !r.solved).length}
          </p>
          <ul>
            {results.map((r, i) => (
              <li key={i}>
                {i + 1}. {r.word} — {r.solved ? "✅ Solved" : "❌ Missed"}
              </li>
            ))}
          </ul>

          <button onClick={onRestart}>🔄 Restart</button>
        </div>
      )}
    </div>
  );
}
