
import './App.css';
import { useNavigate } from 'react-router-dom'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Counter from './Counter';
import Dict from './Dict';
import AdditionQuiz from './AdditionQuiz';
const styles = {
 
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
            <button onClick={() => navigate('/Addition')} style={styles.button}>Addition</button>
      <button onClick={() => navigate('/Counter')} style={styles.button}>Counter</button>
      <button onClick={() => navigate('/Dict')} style={styles.button}>Dictionary</button>
    </div>
  );
}

export default function App() {



  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Addition" element={<AdditionQuiz />} />
        <Route path="/Counter" element={<Counter />} />
        <Route path="/Dict" element={<Dict />} />
      </Routes>
    </Router>
  );
}
