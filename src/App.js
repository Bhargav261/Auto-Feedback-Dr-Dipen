import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReviewRedirect from './components/ReviewRedirect';
import FeedbackList from './components/FeedbackList';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeedbackList />} />
        <Route path="/review" element={<ReviewRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
