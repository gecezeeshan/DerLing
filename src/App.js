
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
          <div className="column left">
            <Game onCategorySelect={setSelectedCategory} />
          </div>
          <div className="column right">
            <DerTranslate />
          </div>
        </div>
        {selectedCategory &&
          <div className="row">
            <div className="column full">

              <>
                <DerList selectedCategory={selectedCategory} />
                <button className="restart-button" onClick={() => setSelectedCategory(null)}>
                  Restart
                </button>
              </>



            </div>
          </div>}
      </div>

    </>
  );
}
