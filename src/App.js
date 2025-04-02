import React from 'react';
import ExpectedValueCalculator from './ExpectedValueCalculator';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1 className="title">ポケポケランクマッチ期待値計算ツール</h1>
      <ExpectedValueCalculator />
    </div>
  );
};

export default App;
