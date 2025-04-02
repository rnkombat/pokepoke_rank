import React, { useState } from 'react';
import './ExpectedValueCalculator.css';

const ExpectedValueCalculator = () => {
  const [winRate, setWinRate] = useState(0.5);
  const [expectedValue, setExpectedValue] = useState(null);
  const [error, setError] = useState('');

  const calculateExpectedValue = (p) => {
    if (p < 0 || p > 1) {
      setError('勝率 p は 0 以上 1 以下の値である必要があります。');
      return null;
    }
    
    const E1 = p * (1 - p) * 10;
    const E2 = Math.pow(p, 2) * (1 - p) * 13;
    const E3 = Math.pow(p, 3) * (1 - p) * 16;
    const E4 = Math.pow(p, 4) * (1 - p) * 19;
    const E5 = Math.pow(p, 5) * 22;
    const E6 = (1 - p) * (-5);
    
    return E1 + E2 + E3 + E4 + E5 + E6;
  };

  const handleCalculate = () => {
    setError('');
    const result = calculateExpectedValue(parseFloat(winRate));
    if (result !== null) {
      setExpectedValue(result);
    }
  };

  const handleInputChange = (e) => {
    setWinRate(e.target.value);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">計算しよう！</h1>
      
      <div className="mb-6">
        <div className="mb-2 text-sm text-gray-600">
          <p>一勝: +10pt</p>
          <p>二連勝: +13pt</p>
          <p>三連勝: +16pt</p>
          <p>四連勝: +19pt</p>
          <p>五連勝以上: +22pt</p>
          <p>負け: -5pt</p>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          勝率 p (0～1の値):
        </label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={winRate}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        onClick={handleCalculate}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        計算する
      </button>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {expectedValue !== null && !error && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h2 className="font-bold mb-2">計算結果:</h2>
          <p className="text-lg">
            期待値: <span className="font-medium">{expectedValue.toFixed(4)}</span> pt
          </p>
          {expectedValue > 0 ? (
            <p className="text-green-600 mt-2">期待値プラスだ！</p>
          ) : expectedValue < 0 ? (
            <p className="text-red-600 mt-2">期待値マイナス……頑張ろう……！</p>
          ) : (
            <p className="text-gray-600 mt-2">ある意味ラッキー！？奇跡の０！！！</p>
          )}
        </div>
      )}
      
    </div>
  );
};

export default ExpectedValueCalculator;