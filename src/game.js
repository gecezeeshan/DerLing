import React from 'react'

const game = () => {
    const [data, setData] = useState([]);
      const [allItems, setAllItems] = useState([]);
      // eslint-disable-next-line
      const [categoryIndex, setCategoryIndex] = useState(0);
    
    
      const [roundCount, setRoundCount] = useState(null);
    
      const [currentRound, setCurrentRound] = useState(1);
    
      const [currentQuestion, setCurrentQuestion] = useState(null);
      const [options, setOptions] = useState([]);
      const [correctAnswers, setCorrectAnswers] = useState(0);
      const [gameStarted, setGameStarted] = useState(false);
      const [translation, setTranslation] = useState("");
      const [currentAnswer, setCurrentAnswer] = useState("");
      const [result, setResult] = useState("");

      
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
    return (
        <>

            <div style={{ padding: 20, textAlign: "center" }}>
                <h1> Vocabia</h1>

                <div style={{ marginBottom: 10 }}>
                    <label>Select Category: </label>
                    <select onChange={(e) => setCategoryIndex(parseInt(e.target.value))}>
                        <option value="0">All Categories</option>
                        {data.sort((a, b) => a.category.localeCompare(b.category))
                            .map((cat, idx) => (
                                <option key={idx} value={idx + 1}>{cat.category}</option>
                            ))}
                    </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                    <label>Number of Rounds: </label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={roundCount || ""}
                        onChange={(e) => setRoundCount(parseInt(e.target.value))}
                    />
                </div>

                <button
                    disabled={!roundCount}
                    onClick={() => selectCategory(categoryIndex || 0)}
                >
                    Start Game
                </button>

            </div>
        </>
    )
}

export default game