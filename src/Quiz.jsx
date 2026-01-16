import { useEffect, useMemo, useState } from "react";
import questionsData from "./questions.json";


const STORAGE_KEY = "mock_exam_progress_v1";

export default function Quiz() {
  const questions = useMemo(() => questionsData, []);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  /* =========================
     Load saved progress
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setIndex(parsed.index ?? 0);
      setResults(parsed.results ?? {});
      setSelected(parsed.results?.[questions[parsed.index]?.id]?.selected ?? "");
      setChecked(Boolean(parsed.results?.[questions[parsed.index]?.id]));
    }
  }, [questions]);

  /* =========================
     Save progress
  ========================= */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ index, results })
    );
  }, [index, results]);

  const q = questions[index];

  const onCheck = () => {
    if (!selected) return;
    setResults((prev) => ({
      ...prev,
      [q.id]: {
        selected,
        isCorrect: selected === q.correctAnswer
      }
    }));
    setChecked(true);
  };

  const goTo = (i) => {
    const r = results[questions[i].id];
    setIndex(i);
    setSelected(r?.selected ?? "");
    setChecked(Boolean(r));
  };

  const resetQuiz = () => {
    if (window.confirm("Are you sure you want to restart the quiz? All progress will be lost.")) {
      localStorage.removeItem(STORAGE_KEY);
      setIndex(0);
      setSelected("");
      setChecked(false);
      setResults({});
    }
  };

  const score = Object.values(results).filter(r => r.isCorrect).length;

  /* =========================
     Button color logic
  ========================= */
  const getBtnColor = (id) => {
    if (!results[id]) return "#ccc";        // unattempted
    return results[id].isCorrect ? "#4caf50" : "#f44336";
  };

  return (
    <div style={{ display: "flex", gap: 20, maxWidth: 1200, margin: "auto" }}>

      {/* =========================
          LEFT: QUESTION NAVIGATOR
      ========================= */}
      <div style={{
        width: 140,
        height: "85vh",
        overflowY: "auto",
        border: "1px solid #ddd",
        padding: 10
      }}>
        <strong>Questions</strong>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 6,
          marginTop: 10
        }}>
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => goTo(i)}
              style={{
                fontSize: 12,
                padding: "6px 0",
                background: getBtnColor(q.id),
                border: i === index ? "2px solid #1976d2" : "1px solid #999",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              {q.id}
            </button>
          ))}
        </div>
      </div>

      {/* =========================
          RIGHT: QUESTION VIEW
      ========================= */}
      <div style={{ flex: 1 }}>
        <h2>Mock Exam</h2>
        <div style={{ marginBottom: 10 }}>
          Question {index + 1} / {questions.length} | Score: {score}
        </div>

        <div style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 20
        }}>
          <strong>{q.question}</strong>

          <div style={{ marginTop: 15 }}>
            {q.options.map(opt => (
              <label key={opt} style={{ display: "block", marginBottom: 8 }}>
                <input
                  type="radio"
                  name="opt"
                  value={opt}
                  disabled={checked}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                />{" "}
                {opt}
              </label>
            ))}
          </div>

          {!checked ? (
            <button onClick={onCheck} disabled={!selected}>
              Check
            </button>
          ) : (
            <div style={{ fontWeight: "bold", marginTop: 10 }}>
              {selected === q.correctAnswer
                ? "✅ Correct"
                : `❌ Wrong — Correct: ${q.correctAnswer}`}
            </div>
          )}

          <div style={{ marginTop: 15 }}>
            <button disabled={index === 0} onClick={() => goTo(index - 1)}>
              Previous
            </button>
            <button
              disabled={index === questions.length - 1}
              onClick={() => goTo(index + 1)}
              style={{ marginLeft: 10 }}
            >
              Next
            </button>
            <button
              onClick={resetQuiz}
              style={{ marginLeft: 20, background: "#000", color: "#fff" }}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
