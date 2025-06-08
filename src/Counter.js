import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Counter.css'; // Import external styles

export default function Counter() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const handleClickAnywhere = () => {
    setCount(prev => prev + 1);
  };

  const resetCounter = (e) => {
    e.stopPropagation(); // Prevent reset button click from incrementing
    setCount(0);
  };

  return (
    <div className="container" onClick={handleClickAnywhere}>
      <h1 className="counterText">{count}</h1>
      <button className="resetButton" onClick={resetCounter}>Reset</button>
      <button
        className="homeButton"
        onClick={(e) => {
          e.stopPropagation();
          navigate('/');
        }}
      >
        Home
      </button>
    </div>
  );

  comst styles ={
.container {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
}

.counterText {
  font-size: 48px;
  margin-bottom: 20px;
}

.resetButton,
.homeButton {
  position: absolute;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: none;
  border: 1px solid #ccc;
  outline: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow: none;
  touch-action: manipulation;
}

/* Position-specific styles */
.resetButton {
  bottom: 80px;
}

.homeButton {
  bottom: 20px;
}

.resetButton:focus,
.resetButton:active,
.homeButton:focus,
.homeButton:active {
  outline: none;
  box-shadow: none;
  background-color: transparent;
}


    
  }
}
