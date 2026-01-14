import { useMemo, useState } from "react";
import questionsData from "../public/questions.json";

/**
 * Quiz component:
 * - Select an option
 * - Press "Check" to see correct/wrong
 * - Only after "Check" you can go Next/Previous
 */
export default function Quiz() {
  const questions = useMemo(() => questionsData, []);
  const [index, setIndex] = useState(0);

  // selected option for current question
  const [selected, setSelected] = useState("");
  // whether current question has been checked
  const [checked, setChecked] = useState(false);

  // track results per question: { [id]: { selected, isCorrect } }
  const [results, setResults] = useState({});

  const q = questions[index];

  const onCheck = () => {
    if (!selected) return;
    const isCorrect = selected === q.correctAnswer;
    setResults((prev) => ({
      ...prev,
      [q.id]: { selected, isCorrect },
    }));
    setChecked(true);
  };

  const goTo = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= questions.length) return;

    const nextQ = questions[nextIndex];
    const prevResult = results[nextQ.id];

    setIndex(nextIndex);
    setSelected(prevResult?.selected ?? "");
    setChecked(Boolean(prevResult)); // if already answered, show result immediately
  };

  const score = Object.values(results).reduce((acc, r) => acc + (r.isCorrect ? 1 : 0), 0);
  const answered = Object.keys(results).length;

  return (
    <div style={{ maxWidth: 820, margin: "24px auto", fontFamily: "system-ui, Arial" }}>
      <h2 style={{ marginBottom: 6 }}>Mock Exam Quiz</h2>
      <div style={{ opacity: 0.8, marginBottom: 18 }}>
        Progress: {index + 1}/{questions.length} • Answered: {answered}/{questions.length} • Score: {score}
      </div>

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>
          Q{q.id}. {q.question}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {q.options.map((opt) => {
            const isSelected = selected === opt;
            const isCorrectOpt = checked && opt === q.correctAnswer;
            const isWrongSelected = checked && isSelected && opt !== q.correctAnswer;

            return (
              <label
                key={opt}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #e6e6e6",
                  cursor: checked ? "default" : "pointer",
                  background: isCorrectOpt ? "rgba(0,0,0,0.05)" : "transparent",
                  outline: isWrongSelected ? "2px solid rgba(0,0,0,0.18)" : "none",
                }}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={isSelected}
                  onChange={() => setSelected(opt)}
                  disabled={checked}
                  style={{ marginTop: 3 }}
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "center" }}>
          {!checked ? (
            <button onClick={onCheck} disabled={!selected}>
              Check
            </button>
          ) : (
            <div style={{ fontWeight: 700 }}>
              {selected === q.correctAnswer ? "✅ Correct" : `❌ Wrong — Correct: ${q.correctAnswer}`}
            </div>
          )}

          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button onClick={() => goTo(index - 1)} disabled={!checked || index === 0}>
              Previous
            </button>
            <button onClick={() => goTo(index + 1)} disabled={!checked || index === questions.length - 1}>
              Next
            </button>
          </div>
        </div>
      </div>

      {answered === questions.length && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 10, border: "1px solid #ddd" }}>
          <strong>Finished!</strong> Final score: {score}/{questions.length}
        </div>
      )}
    </div>
  );
}