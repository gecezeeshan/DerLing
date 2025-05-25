
import { useState } from 'react';
import './App.css';
import DerTranslate from './DerTranslate';
import DerList from './DerList'; // Make sure it's imported
import Game from './Game';
export default function App() {
  // const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // const startGame = () => {
  //   setGameStarted(true);
  // };


  return (
    <>
      <div className="container">
        <div className="row">
          <div className="column">
            <Game onCategorySelect={setSelectedCategory} />  
          </div>
          <div className="column">
            <DerTranslate />
          </div>
        </div>

        <div className="row">
          <div className="column">
            {selectedCategory && <DerList selectedCategory={selectedCategory} />}
          </div></div>
      </div></>
  );
}
