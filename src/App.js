import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

export default function VocabGame() {
  const [data, setData] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [setCategoryIndex] = useState(null);
  const [roundCount] = useState(5);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [translation, setTranslation] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [result, setResult] = useState("");
  const [translate, setTranslate] = useState("");
  //const [round, setRound] = useState("");

  const [translated, setTranslated] = useState("");
  const [debouncedText, setDebouncedText] = useState(translate);
  // Debounce effect
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedText(translate);
  //   }, 500);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [translate]);

  // // API Call effect
  // useEffect(() => {
  //   async function fetchData() {
  //     if (debouncedText) {
  //       if (translate !== "") {
  //         let _translate = await getExampleSentence(translate);
  //         setTranslated(_translate);
  //       } else {
  //         setTranslated("Please enter a word to translate.");
  //       }
  //     }
  //   }
  //   fetchData();
  // }, [debouncedText]);

  ///////
  useEffect(() => {
    const fetchTranslation = async () => {
      if (debouncedText) {
        if (translate) {
          let _translate = await getExampleSentence(translate);
          setTranslated(_translate);
        } else {
          setTranslated("Please enter a word to translate.");
        }
      }
    };
    fetchTranslation();
  }, [debouncedText, translate]); // ✅ include both


  /////


  // Load data.json
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/data.json");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  const selectCategory = (index) => {
    setCategoryIndex(index);

    let items = [];
    if (index === 0) {
      // All categories
      data.forEach((category) => {
        items = [...items, ...category.items];
      });
    } else {
      items = data[index - 1].items;
    }
    setAllItems(items);
    setGameStarted(true);
    prepareQuestion(items);
  };

  const prepareQuestion = (items) => {
    const correct = items[Math.floor(Math.random() * items.length)];
    const wrongChoices = [];

    while (wrongChoices.length < 2) {
      const randomWrong = items[Math.floor(Math.random() * items.length)];
      if (randomWrong.english !== correct.english && !wrongChoices.includes(randomWrong)) {
        wrongChoices.push(randomWrong);
      }
    }

    const optionList = [correct, ...wrongChoices];
    setOptions(shuffle(optionList));
    setCurrentQuestion(correct);
    setTranslation("");
    setCurrentAnswer("");
  };

  const shuffle = (arr) => {
    return arr.sort(() => Math.random() - 0.5);
  };

  const handleNextQuestion = () => {

    if (currentRound < roundCount) {
      setCurrentRound(currentRound + 1);
      prepareQuestion(allItems);
    } else {
      setResult(`🎯 Game Over! You answered ${correctAnswers} out of ${roundCount} correctly.`);

    }

  }

  const handleAnswer = async (selectedOption) => {
    if (selectedOption.english === currentQuestion.english) {

      setCurrentAnswer("✅ Correct! ")
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setCurrentAnswer(`❌ Incorrect! Correct answer: ${currentQuestion.english}`);
    }

    let _translate = await getExampleSentence(currentQuestion.usage);
    setTranslation(_translate);


  };

  const resetGame = () => {
    setCategoryIndex(null);
    setGameStarted(false);
    setCurrentRound(1);
    setCorrectAnswers(0);
    setCurrentQuestion(null);
    setOptions([]);
    setTranslation("");
  };
  const handleRestart = () => {
    resetGame();
    setResult("");
  };
  const handleTranslate = async () => {
    if (translate) {
      let _translate = await getExampleSentence(translate);
      setTranslated(_translate);
    } else {
      setTranslated("Please enter a word to translate.");
    }
  };


  const getExampleSentence = async (word) => {
    try {
      const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=de&tl=en&q=${encodeURIComponent(word)}`;
      const response = await axios.get(url);
      return JSON.stringify(response.data[0]);
      //setTranslation();
    } catch (error) {
      console.error("Translation error", error);
      return "Failed to translate.";
      //setTranslation("Failed to translate.");
    }
  };

  if (!gameStarted) {
    return (
      <div style={{ padding: 20 }}>
        <h1> Vocabia</h1>
        <h2>Select a Category</h2>
        {data.map((cat, idx) => (
          <p key={idx} style={{ float: "left", margin: 10 }}>
            <button onClick={() => selectCategory(idx + 1)}>{cat.category}</button>
          </p>
        ))}
        <button onClick={() => selectCategory(0)}>All Categories</button>
      </div>
    );
  }

  if (!currentQuestion) return <div>Loading question...</div>;

  return (
    <>

      <div className="container">
        <div className="row">
          <div className="column">
            <div style={{ padding: 20 }}>
              <h1>Round {currentRound} / {roundCount}</h1>
              <h2>What is the meaning of the German word:</h2>
              <h3 style={{ color: "#007bff" }}>{currentQuestion.german}</h3>

              {options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(opt)} style={{ margin: 5, padding: 10 }}>
                  {opt.english}
                </button>
              ))}
              <div style={{ marginTop: 20 }}>
                {(
                  <>
                    <pre>{currentAnswer}</pre>
                  </>
                )}
              </div>


              <div style={{ marginTop: 20 }}>
                {currentAnswer &&
                  <pre>{currentQuestion.usage}</pre>}
                {translation && (
                  <>
                    <pre>{translation}</pre>
                  </>
                )}
              </div>
              {currentAnswer &&
                (<><button onClick={() => handleNextQuestion()} style={{ margin: 5, padding: 10 }}>
                  Next
                </button>

                </>)}
              <button onClick={() => { handleRestart() }} style={{ margin: 5, padding: 10 }}>
                Restart
              </button>


            </div>



            <div style={{ marginTop: 20 }}>
              {result}
              {result &&
                <button onClick={() => handleRestart()} style={{ margin: 5, padding: 10 }}>
                  Restart
                </button>}

            </div>
          </div>
          <div className="column">

            <div className="">Quick Translate</div>
            <textarea className="input" value={translate} onChange={(e) => setTranslate(e.target.value)} style={{ width: "80%" }} >

            </textarea>
            {/* <input type="text" className="input" value={translate} onChange={(e) => setTranslate(e.target.value)} /> */}

            <button onClick={() => handleTranslate()} style={{ margin: 5, padding: 10 }}>
              Translate
            </button>
            {translated && (
              <>
                <pre>{translated}</pre>
              </>
            )}


          </div>
        </div>
      </div>


    </>
  );
}
