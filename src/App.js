import React from 'react';
import ExpectedValueCalculator from './ExpectedValueCalculator';
import ExpectedValueCalculator2 from './ExpectedValueCalculator2';
import ProbabilityDensitySimulator from './ProbabilityDensitySimulator';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1 className="title">ポケポケランクマッチ期待値計算ツール</h1>
      <div className="calculators-wrapper">
        <div className="component-container">
          <ExpectedValueCalculator />
        </div>
        <div className="component-container">
          <ExpectedValueCalculator2 />
        </div>
        <div className="component-container">
          <ProbabilityDensitySimulator />
        </div>
      </div>
    </div>
  );
};

export default App;
