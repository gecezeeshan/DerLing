import { useEffect, useState } from "react";
import CategorySelector from "./CategorySelector";
import DerGame from "./DerGame";

export default function Game({ onCategorySelect }) {
  const [data, setData] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [roundCount, setRoundCount] = useState(5);
  const [lang, setLang] = useState("de");
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/data.json");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  const startGame = (selectedLang) => {
    setLang(selectedLang);
    let items = [];
    let selectedCategoryName = "";
  
    if (categoryIndex === 0) {
      data.forEach((cat) => (items = [...items, ...cat.items]));
      selectedCategoryName = "All";
    } else {
      const category = data[categoryIndex - 1];
      items = category.items;
      selectedCategoryName = category.category;
    }
  
    setAllItems(items);
    setGameStarted(true);
  
    // Notify parent about selected category
    if (onCategorySelect) {
      onCategorySelect(selectedCategoryName);
    }
  };

  const handleRestart = () => {
    setGameStarted(false);
  };

  return (
    <>
      {!gameStarted ? (
        <CategorySelector
          data={data}
          categoryIndex={categoryIndex}
          setCategoryIndex={setCategoryIndex}
          roundCount={roundCount}
          setRoundCount={setRoundCount}
          onStart={startGame}
        />
      ) : (
        <DerGame
          items={allItems}
          lang={lang}
          roundCount={roundCount}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}
