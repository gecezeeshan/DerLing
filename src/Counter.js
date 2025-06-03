import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const styles = {
    container: {
      position: 'relative',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#dcdcdc',
      cursor: 'pointer',
      overflow: 'hidden'
    },
    counterText: {
      fontSize: '48px',
      marginBottom: '20px'
    },
    resetButton: {
      position: 'absolute',
      bottom: '80px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer'
    },
    button: {
      position: 'absolute',
      bottom: '20px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container} onClick={handleClickAnywhere}>
      <h1 style={styles.counterText}> {count}</h1>
      <button onClick={resetCounter} style={styles.resetButton}>Reset</button>
      <button onClick={(e) => { e.stopPropagation(); navigate('/'); }} style={styles.button}>
        Home
      </button>
    </div>
  );
}
