import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Counter.css';

export default function Counter() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const handleClickAnywhere = () => {
    setCount(prev => prev + 1);
  };

  const resetCounter = (e) => {
    e.stopPropagation();
    setCount(0);
  };

  return (
    <div className="container" onClick={handleClickAnywhere}>
      <div className="topButtons">
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
      <h1 className="counterText">{count}</h1>
    </div>
  );
}
