import { useEffect, useMemo, useState } from "react";
import questionsData from "./QuestionSaa.json";

const STORAGE_KEY = "mock_exam_progress_v1";

export default function QuizSaa() {
  const questions = useMemo(() => questionsData, []);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});

  /* =========================
     Helper Functions
  ========================= */


  


  const arraysEqual = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;

    const sortedA = [...a].sort();
    const sortedB = [...b].sort();

    return sortedA.every((value, index) => value === sortedB[index]);
  };

  const getCorrectAnswers = (correctAnswer) => {
  return String(correctAnswer)
    .split(",")
    .map((x) => x.trim().toUpperCase());
};

const isQuestionCorrect = (question, selectedAnswers) => {
  const correctAnswers = getCorrectAnswers(
    question.correctAnswer
  );

  const selectedLetters = selectedAnswers
    .map((answer) => {
      const optionIndex =
        question.options.indexOf(answer);

      return String.fromCharCode(
        65 + optionIndex
      ); // A,B,C,D
    })
    .sort();

  return arraysEqual(
    selectedLetters,
    [...correctAnswers].sort()
  );
};

  /* =========================
     Load Saved Progress
  ========================= */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved && questions.length > 0) {
      const parsed = JSON.parse(saved);

      const savedIndex = parsed.index ?? 0;
      const savedResults = parsed.results ?? {};

      setIndex(savedIndex);
      setResults(savedResults);

      const currentQuestionId = questions[savedIndex]?.id;

      if (currentQuestionId && savedResults[currentQuestionId]) {
        setSelected(savedResults[currentQuestionId].selected ?? []);
        setChecked(true);
      } else {
        setSelected([]);
        setChecked(false);
      }
    }
  }, [questions]);

  /* =========================
     Save Progress
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        index,
        results
      })
    );
  }, [index, results]);

  if (!questions.length) {
    return <div>No questions found.</div>;
  }

  const q = questions[index];

  /* =========================
     Option Selection
  ========================= */
const isMultipleQuestion = (question) => {
  return String(question.correctAnswer).includes(",");
};


const toggleOption = (option) => {
  if (checked) return;

  if (isMultipleQuestion(q)) {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((x) => x !== option)
        : [...prev, option]
    );
  } else {
    setSelected([option]);
  }
};

  /* =========================
     Check Answer
  ========================= */

  const onCheck = () => {
    if (selected.length === 0) return;

    const isCorrect = isQuestionCorrect(q, selected);

    setResults((prev) => ({
      ...prev,
      [q.id]: {
        selected,
        isCorrect
      }
    }));

    setChecked(true);
  };

  /* =========================
     Navigation
  ========================= */

  const goTo = (i) => {
    const questionId = questions[i].id;
    const savedResult = results[questionId];

    setIndex(i);

    if (savedResult) {
      setSelected(savedResult.selected ?? []);
      setChecked(true);
    } else {
      setSelected([]);
      setChecked(false);
    }
  };

  /* =========================
     Reset Quiz
  ========================= */

  const resetQuiz = () => {
    if (
      window.confirm(
        "Are you sure you want to restart the quiz? All progress will be lost."
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);

      setIndex(0);
      setSelected([]);
      setChecked(false);
      setResults({});
    }
  };

  /* =========================
     Score
  ========================= */

  const score = Object.values(results).filter(
    (r) => r.isCorrect
  ).length;

  /* =========================
     Navigator Button Colors
  ========================= */

  const getBtnColor = (id) => {
    if (!results[id]) return "#bdbdbd"; // not attempted

    return results[id].isCorrect
      ? "#4caf50"
      : "#f44336";
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        maxWidth: 1300,
        margin: "20px auto",
        padding: 10
      }}
    >
      {/* =========================
          LEFT SIDE NAVIGATION
      ========================= */}

      <div
        style={{
          width: 160,
          height: "85vh",
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 10
        }}
      >
        <h4 style={{ marginTop: 0 }}>Questions</h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 6
          }}
        >
          {questions.map((question, i) => (
            <button
              key={question.id}
              onClick={() => goTo(i)}
              style={{
                padding: "8px 0",
                fontSize: 12,
                cursor: "pointer",
                color: "#fff",
                background: getBtnColor(question.id),
                border:
                  i === index
                    ? "3px solid #1976d2"
                    : "1px solid #999",
                borderRadius: 4
              }}
            >
              {question.id}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <div>
            🟩 Correct:{" "}
            {
              Object.values(results).filter(
                (r) => r.isCorrect
              ).length
            }
          </div>

          <div>
            🟥 Wrong:{" "}
            {
              Object.values(results).filter(
                (r) => !r.isCorrect
              ).length
            }
          </div>

          <div>
            ⬜ Remaining:{" "}
            {questions.length - Object.keys(results).length}
          </div>
        </div>
      </div>

      {/* =========================
          QUESTION AREA
      ========================= */}

      <div style={{ flex: 1 }}>
        <h2>AWS Mock Exam</h2>

        <div style={{ marginBottom: 15 }}>
          Question {index + 1} of {questions.length}
          {" | "}
          Score: {score}
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 20
          }}
        >
          <div
            style={{
              marginBottom: 15,
              fontSize: 18,
              fontWeight: "bold"
            }}
          >
            {q.question}
          </div>

          <div style={{ marginBottom: 20 }}>
            {q.options.map((opt) => (
              <label
                key={opt}
                style={{
                  display: "block",
                  marginBottom: 10,
                  cursor: checked ? "default" : "pointer"
                }}
              >
               <input
  type={
    isMultipleQuestion(q)
      ? "checkbox"
      : "radio"
  }
                  name={`question-${q.id}`}
                  checked={selected.includes(opt)}
                  disabled={checked}
                  onChange={() => toggleOption(opt)}
                />
                {" "}
                {opt}
              </label>
            ))}
          </div>

          {!checked ? (
            <button
              onClick={onCheck}
              disabled={selected.length === 0}
            >
              Check Answer
            </button>
          ) : (
            <div
              style={{
                marginBottom: 15,
                fontWeight: "bold",
                color:
                  results[q.id]?.isCorrect
                    ? "green"
                    : "red"
              }}
            >
              {results[q.id]?.isCorrect
                ? "✅ Correct"
                : `❌ Wrong — Correct Answer: ${
                    Array.isArray(q.correctAnswer)
                      ? q.correctAnswer.join(", ")
                      : q.correctAnswer
                  }`}
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
            >
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
              style={{
                marginLeft: 20,
                background: "#000",
                color: "#fff"
              }}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}