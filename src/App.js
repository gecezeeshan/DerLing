
import './App.css';
import { useNavigate } from 'react-router-dom'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Counter from './Counter';
import Dict from './Dict';
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
      <button onClick={() => navigate('/Counter')} style={styles.button}>Go to Counter</button>
      <button onClick={() => navigate('/Dict')} style={styles.button}>Go to Dictionary</button>
    </div>
  );
}

export default function App() {



  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Counter" element={<Counter />} />
        <Route path="/Dictionary" element={<Dict />} />
      </Routes>
    </Router>
  );
}
