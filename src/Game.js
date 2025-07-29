import { useEffect, useState } from "react";
import CategorySelector from "./CategorySelector";
import DerGame from "./DerGame";
import FlipCardGame from "./FlipCardGame";
import { useNavigate } from 'react-router-dom';

export default function Game({ onCategorySelect , onShowList }) {
  const [data, setData] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [roundCount, setRoundCount] = useState(5);
  const [lang, setLang] = useState("de");
  const [gameStarted, setGameStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/data.json");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  const startGame = (selectedLang, showList = false) => {
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
    // if (!showList) {
    setGameStarted(true);
    // }

    // Notify parent about selected category
    if (onCategorySelect) {
      onCategorySelect(selectedCategoryName);
    }
  };

  const handleRestart = () => {
    setGameStarted(false);
  };

  const handleFinish = (result) => {
    //alert(`🎉 Finished!\n\n✅ Known: ${result.known}\n❌ Don't Know: ${result.unknown}\n📚 Total: ${result.total}`);
    onCategorySelect(null); // Reset selected category
    setGameStarted(false);

  };

  return (
    <>
      {!gameStarted ? (
        <CategorySelector
          data={data}
          categoryIndex={categoryIndex}
          setCategoryIndex={setCategoryIndex}
          onShowList={onShowList}
          roundCount={roundCount}
          setRoundCount={setRoundCount}
          onStart={startGame}
        />
      ) : (
        <>
          {/* <DerGame
            items={allItems}
            lang={lang}
            roundCount={roundCount}
            onRestart={handleRestart}
          /> */}


          <FlipCardGame
            items={allItems}
            lang={lang}
            roundCount={roundCount}
            onRestart={handleRestart}
            onFinish={handleFinish}></FlipCardGame>

        </>
      )}
    </>
  );
}
