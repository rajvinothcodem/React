import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, NavLink, Routes, Route } from 'react-router-dom';
import Content from './page/Content'
function App() {
  return (
    <div className="App">
      <div className="page-content">
        <Content />
      </div>
    </div>
  );
}

export default App;
