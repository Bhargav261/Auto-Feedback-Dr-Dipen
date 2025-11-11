import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import ReviewRedirect from './components/ReviewRedirect';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/review" element={<ReviewRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
