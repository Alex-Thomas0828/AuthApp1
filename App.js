import logo from './logo.svg';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import userInfo from './Components/userInfo'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/userinfo" element={<userInfo />} />
      </Routes>
    </Router>
  );
};

export default App;