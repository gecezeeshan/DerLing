
import { useState } from 'react';
import './App.css';
import DerList from './DerList'; // Make sure it's imported
import Game from './Game';
export default function Dict({ onShowList }) {
  // const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showList, setShowList] = useState(onShowList || false);
  // const startGame = () => {
  //   setGameStarted(true);
  // };


  return (
    <>
      <div className="container">
        <div className="row">
          <div className="column left">
            <Game onCategorySelect={setSelectedCategory} onShowList={setShowList} />
          </div>
          {/* <div className="column right">
            <DerTranslate />
          </div> */}
        </div>
        {selectedCategory && showList &&
          <div className="row">
            <div className="column full">

              <>
                <DerList selectedCategory={selectedCategory} className="der-list-scroll" />
              </>



            </div>
          </div>}

      </div>

    </>
  );

}
