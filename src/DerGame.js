import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

const DerGame = ({ items, lang, roundCount, onRestart }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [translation, setTranslation] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {

    if (items && items.length > 0) {
      console.log("Items received in DerGame:", items);
      prepareQuestion(items);
    }
  }, [items]);
  
  
  

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  const getExampleSentence = async (word) => {
    try {
      const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=de&tl=en&q=${encodeURIComponent(word)}`;
      const response = await axios.get(url);
      return JSON.stringify(response.data[0]);
    } catch (error) {
      console.error("Translation error", error);
      return "Failed to translate.";
    }
  };

  const prepareQuestion = (items) => {
    console.log("Preparing question with items:", items); // 👈 log this
    if (!items || items.length < 3) {
      console.warn("Not enough items to prepare question.");
      return;
    }
  
    const correct = items[Math.floor(Math.random() * items.length)];
    const wrongChoices = [];
  
    while (wrongChoices.length < 2) {
      const randomWrong = items[Math.floor(Math.random() * items.length)];
      if (
        randomWrong.english !== correct.english &&
        !wrongChoices.includes(randomWrong)
      ) {
        wrongChoices.push(randomWrong);
      }
    }
  
    const optionList = [correct, ...wrongChoices];
    setOptions(shuffle(optionList));
    setCurrentQuestion(correct);
    setTranslation("");
    setCurrentAnswer("");
  };
  
  
  const handleNextQuestion = () => {
    if (currentRound < roundCount) {
      setCurrentRound(currentRound + 1);
      prepareQuestion(items);
    } else {
      setResult(`🎯 Game Over! You answered ${correctAnswers} out of ${roundCount} correctly.`);
    }
  };

  const handleAnswer = async (selectedOption) => {
    if (selectedOption.english === currentQuestion.english) {
      setCurrentAnswer("✅ Correct!");
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setCurrentAnswer(`❌ Incorrect! Correct answer: ${currentQuestion.english}`);
    }

    let _translate = await getExampleSentence(currentQuestion.usage);
    setTranslation(_translate.replace(/"/g, ""));
  };

  if (!currentQuestion) return <div>Loading question...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Round {currentRound} / {roundCount}</h1>
      {lang === "de" && <><h2>What is the meaning of the German word:</h2><h3 style={{ color: "#007bff" }}>{currentQuestion.german}</h3></>}
      {lang === "ar" && <><h2>What is the meaning of the Arabic word:</h2><h3 style={{ color: "#007bff" }}>{currentQuestion.arabic}</h3></>}

      {options.map((opt, idx) => (
        <button key={idx} onClick={() => handleAnswer(opt)} style={{ margin: 5, padding: 10 }}>{opt.english}</button>
      ))}

      {currentAnswer && (
        <div style={{ marginTop: 20 }}>
          <pre className="translation">{currentAnswer}</pre>
          <pre className="translation">{lang === "de" ? currentQuestion.usage : currentQuestion.arabicUsage}</pre>
          <pre className="translationEnglish">{translation}</pre>
          <button onClick={handleNextQuestion} style={{ margin: 5, padding: 10 }}>Next</button>
        </div>
      )}

      <button onClick={onRestart} style={{ margin: 5, padding: 10 }}>Restart</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          {result}
          <button onClick={onRestart} style={{ margin: 5, padding: 10 }}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default DerGame;
