import React, { useState } from "react";

const AdditionQuiz = () => {
  const [rounds, setRounds] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [num1, setNum1] = useState(null);
  const [num2, setNum2] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [feedback, setFeedback] = useState(""); // ✅ new

  const generateRandom = () => Math.floor(Math.random() * 10) + 1;

  const generateQuestion = () => {
    setNum1(generateRandom());
    setNum2(generateRandom());
    setUserAnswer("");
    setFeedback("");
  };

  const startQuiz = () => {
    setScore(0);
    setCurrentRound(1);
    setQuizStarted(true);
    setQuizEnded(false);
    generateQuestion();
  };

  const handleAnswer = () => {
    const correctAnswer = num1 + num2;
    const isCorrect = parseInt(userAnswer) === correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Incorrect! Correct Answer: ${correctAnswer}`);
    }

    // Wait 1.2 seconds before next question or ending quiz
    setTimeout(() => {
      if (currentRound < rounds) {
        setCurrentRound(currentRound + 1);
        generateQuestion();
      } else {
        setQuizEnded(true);
        setQuizStarted(false);
      }
    }, 1200);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "40px" }}>➕ Addition Quiz (1–10)</h1>

      {!quizStarted && !quizEnded && (
        <>
          <p style={{ fontSize: "24px" }}>How many rounds do you want?</p>
          <input
            type="number"
            value={rounds}
            onChange={(e) => setRounds(parseInt(e.target.value))}
            min="1"
            max="100"
            style={{
              fontSize: "24px",
              padding: "10px",
              width: "100px",
              textAlign: "center"
            }}
          />
          <br /><br />
          <button
            onClick={startQuiz}
            disabled={rounds <= 0}
            style={{
              fontSize: "24px",
              padding: "15px 40px",
              cursor: "pointer"
            }}
          >
            Start Quiz
          </button>
        </>
      )}

      {quizStarted && (
        <div>
          <h2 style={{ fontSize: "32px" }}>
            Round {currentRound} of {rounds}
          </h2>
          <p style={{ fontSize: "36px" }}>
            What is <strong>{num1}</strong> + <strong>{num2}</strong>?
          </p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={feedback !== ""} // disable input while showing feedback
            style={{
              fontSize: "28px",
              padding: "10px",
              width: "150px",
              textAlign: "center"
            }}
          />
          <br /><br />
          <button
            onClick={handleAnswer}
            disabled={userAnswer === "" || feedback !== ""}
            style={{
              fontSize: "24px",
              padding: "15px 40px",
              cursor: "pointer"
            }}
          >
            Submit Answer
          </button>

          {/* ✅ Show feedback */}
          {feedback && (
            <p style={{ fontSize: "28px", marginTop: "20px", color: feedback.includes("Correct") ? "green" : "red" }}>
              {feedback}
            </p>
          )}
        </div>
      )}

      {quizEnded && (
        <div>
          <h2 style={{ fontSize: "32px" }}>🎉 Quiz Completed!</h2>
          <p style={{ fontSize: "28px" }}>
            You got <strong>{score}</strong> out of <strong>{rounds}</strong> correct.
          </p>
          <button
            onClick={() => {
              setQuizEnded(false);
              setRounds(0);
              setUserAnswer("");
            }}
            style={{
              fontSize: "24px",
              padding: "15px 40px",
              cursor: "pointer"
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default AdditionQuiz;
