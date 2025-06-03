import  { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
export default function Counter() {
  const [count, setCount] = useState(0);

  const handleClickAnywhere = () => {
    setCount(prev => prev + 1);
  };

  const resetCounter = (e) => {
    e.stopPropagation(); // Prevent reset button click from triggering the increment
    setCount(0);
  };
  
  const styles = {
  
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }
,
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    cursor: 'pointer'
  },
  counterText: {
    fontSize: '48px',
    marginBottom: '20px'
  },
  resetButton: {
    position: 'absolute',
    bottom: '60px',
    padding: '10px 20px',
    fontSize: '16px'
  }
};

  const navigate = useNavigate();

  return (
    <div style={styles.container} onClick={handleClickAnywhere}>
      <h1 style={styles.counterText}>Count: {count}</h1>
      <button onClick={resetCounter} style={styles.resetButton}>Reset</button>
        <button onClick={() => navigate('/')} style={styles.button}>Home</button>
    </div>
  );
}

