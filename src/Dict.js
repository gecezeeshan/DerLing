
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

  const onShowListHandler = (showList) => {
    setShowList(showList);
  }


  const onCategorySelectHandler = (category) => {
    setSelectedCategory(category);
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="column left">
            <Game onCategorySelect={onCategorySelectHandler} onShowList={onShowListHandler} />

          </div>
          {/* <div className="column right">
            <DerTranslate />
          </div> */}
        </div>
        {showList &&
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
