
//import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Counter from './Counter';
import Dict from './Dict';
import Home from './Home';
import Quiz from './Quiz';
import Ocr from './Ocr';
// import KidsVocabularyTest from './KidsVocabularyTest';
// import KidsHangman from './KidsHangman';
// import AdditionQuiz from './AdditionQuiz';

function HomePage() {


  return (

    <>
      <Home></Home>

    </>
  );
}

export default function App() {



  return (

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/Counter" element={<Counter />} />
        <Route path="/Dict" element={<Dict />} />
        <Route path="/OCR" element={<Ocr />} />
        <Route path="/PMP" element={<Quiz />} />
        {/* <Route path="/Addition" element={<AdditionQuiz />} />
        <Route path="/KidsVocabulary" element={<KidsVocabularyTest />} />
        <Route path="/KidsHangman" element={<KidsHangman />} /> */}
      </Routes>
    </Router>
  );
}
