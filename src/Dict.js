
import { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import DerList from './DerList'; // Make sure it's imported
import Game from './Game';
export default function Dict() {
  // const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // const startGame = () => {
  //   setGameStarted(true);
  // };


  const styles = {

    button: {
      margin: '10px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer'
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="column left">
            <Game onCategorySelect={setSelectedCategory} />
          </div>
          {/* <div className="column right">
            <DerTranslate />
          </div> */}
        </div>
        {selectedCategory &&
          <div className="row">
            <div className="column full">

              <>
                <DerList selectedCategory={selectedCategory} className="der-list-scroll" />
                <button className="restart-button" onClick={() => setSelectedCategory(null)}>
                  Restart
                </button>
              </>



            </div>
          </div>}
        <button onClick={() => navigate('/')} style={styles.button}>Home</button>
      </div>

    </>
  );

}
