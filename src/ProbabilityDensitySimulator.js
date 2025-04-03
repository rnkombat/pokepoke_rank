import React, { useState, useEffect } from 'react';
import './ProbabilityDensitySimulator.css';

const Card = ({ className, children, ...props }) => (
    <div className={`rounded-lg border bg-white shadow ${className}`} {...props}>
      {children}
    </div>
  );
  
  const CardHeader = ({ className, children, ...props }) => (
    <div className={`p-6 pb-0 ${className}`} {...props}>
      {children}
    </div>
  );
  
  const CardTitle = ({ className, children, ...props }) => (
    <h3 className={`text-xl font-semibold ${className}`} {...props}>
      {children}
    </h3>
  );
  
  const CardContent = ({ className, children, ...props }) => (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );

const ProbabilityDensitySimulator = () => {
  const [winRate, setWinRate] = useState(0.55);
  const [initialPoints, setInitialPoints] = useState(0);
  const [targetPoints, setTargetPoints] = useState(1000);
  const [numSimulations, setNumSimulations] = useState(1000);
  const [simResults, setSimResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');
  
  const runSimulation = () => {
    setError('');
    
    if (winRate < 0 || winRate > 1) {
      setError('勝率は0から1の間で設定してください。');
      return;
    }
    
    if (initialPoints < 0) {
      setError('初期ポイントは0以上で設定してください。');
      return;
    }
    
    if (targetPoints <= initialPoints) {
      setError('目標ポイントは初期ポイントより大きく設定してください。');
      return;
    }
    
    setIsCalculating(true);
    
    // 非同期で計算を実行
    setTimeout(() => {
      const results = [];
      const maxGameLimit = 2000; // 無限ループ防止
      
      for (let i = 0; i < numSimulations; i++) {
        let points = initialPoints;
        let consecutiveWins = 0;
        let games = 0;
        
        while (points < targetPoints && games < maxGameLimit) {
          games++;
          
          // 勝率に基づいて勝敗を決定
          const isWin = Math.random() < winRate;
          
          if (isWin) {
            consecutiveWins++;
            
            if (points < 710) {
              // 710pt未満の場合の連勝ボーナス
              switch (consecutiveWins) {
                case 1: points += 10; break;
                case 2: points += 13; break;
                case 3: points += 16; break;
                case 4: points += 19; break;
                default: points += 22; break;
              }
            } else {
              // 710pt以上の場合
              points += 10;
            }
          } else {
            // 負けた場合
            consecutiveWins = 0;
            if (points < 710) {
              points -= 5;
            } else {
              points -= 7;
            }
            
            // ポイントが0未満にならないようにする
            if (points < 0) points = 0;
          }
        }
        
        // 最大ゲーム数に達した場合は無視
        if (games < maxGameLimit) {
          results.push(games);
        }
      }
      
      // 結果を集計
      let sum = 0;
      
      results.forEach(games => {
        sum += games;
      });
      
      // 最大と最小の値を取得
      const minGames = Math.min(...results);
      const maxGames = Math.max(...results);
      
      // 累積分布を計算
      const distribution = {};
      results.forEach(games => {
        distribution[games] = (distribution[games] || 0) + 1;
      });
      
      const histogramData = [];
      for (let i = 1; i <= maxGames; i++) {
        histogramData.push({
          games: i,
          count: distribution[i] || 0,
          percentage: ((distribution[i] || 0) / results.length) * 100
        });
      }
      
      let cumulativeCount = 0;
      const cumulativeData = histogramData.map(item => {
        cumulativeCount += item.count;
        return {
          games: item.games,
          count: cumulativeCount,
          percentage: (cumulativeCount / results.length) * 100
        };
      });
      
      // パーセンタイルの計算
      const sortedResults = [...results].sort((a, b) => a - b);
      const percentiles = {};
      [10, 25, 50, 75, 90].forEach(p => {
        const index = Math.floor(sortedResults.length * (p / 100));
        percentiles[p] = sortedResults[index];
      });
      
      setSimResults({
        cumulativeData,
        average: sum / results.length,
        median: sortedResults[Math.floor(sortedResults.length / 2)],
        percentiles,
        minGames,
        maxGames,
        totalSimulations: results.length
      });
      
      setIsCalculating(false);
    }, 100);
  };
  
  useEffect(() => {
    // 初回レンダリング時にシミュレーションを実行
    if (!simResults) {
      runSimulation();
    }
  }, []);
  
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>ポイント到達確率分布シミュレーター</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">勝率 (0～1):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={winRate}
                onChange={(e) => setWinRate(parseFloat(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">初期ポイント:</label>
              <input
                type="number"
                min="0"
                value={initialPoints}
                onChange={(e) => setInitialPoints(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">目標ポイント:</label>
              <input
                type="number"
                min="1"
                value={targetPoints}
                onChange={(e) => setTargetPoints(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">シミュレーション回数:</label>
              <input
                type="number"
                min="100"
                max="10000"
                value={numSimulations}
                onChange={(e) => setNumSimulations(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={runSimulation}
            disabled={isCalculating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isCalculating ? '計算中...' : 'シミュレーション実行'}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
        
        {simResults && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">シミュレーション結果</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-sm">平均試合数</div>
                  <div className="text-xl font-bold">{simResults.average.toFixed(1)}</div>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-sm">中央値（50%タイル）</div>
                  <div className="text-xl font-bold">{simResults.percentiles[50]}</div>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-sm">25%タイル</div>
                  <div className="text-xl font-bold">{simResults.percentiles[25]}</div>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <div className="text-sm">75%タイル</div>
                  <div className="text-xl font-bold">{simResults.percentiles[75]}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">累積分布関数（目標到達確率）</h3>
              <div className="h-64 relative border border-gray-200 bg-gray-50">
                {/* X軸 */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-400"></div>
                
                {/* 5分割のY軸グリッド線 */}
                {[0.2, 0.4, 0.6, 0.8].map(ratio => (
                  <div 
                    key={ratio} 
                    className="absolute left-0 right-0 h-px bg-gray-200"
                    style={{ bottom: `${ratio * 100}%` }}
                  ></div>
                ))}
                
                {/* Y軸ラベル */}
                {[0, 20, 40, 60, 80, 100].map(value => (
                  <div 
                    key={value} 
                    className="absolute left-0 text-xs text-gray-500"
                    style={{ bottom: `${value}%`, transform: 'translateY(50%)' }}
                  >
                    {value}%
                  </div>
                ))}
                
                {/* X軸の目盛り（5等分） - 位置を調整 */}
                {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                  const value = Math.round(simResults.minGames + (simResults.maxGames - simResults.minGames) * ratio);
                  return (
                    <div 
                      key={ratio} 
                      className="absolute bottom-0 h-2 w-px bg-gray-400"
                      style={{ left: `${ratio * 100}%` }}
                    >
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                        {value}
                      </div>
                    </div>
                  );
                })}
                
                {/* 累積分布関数 */}
                <svg 
                  className="absolute inset-0 h-full w-full" 
                  viewBox="0 0 100 100" 
                  preserveAspectRatio="none"
                >
                  {(() => {
                    const points = simResults.cumulativeData
                      .filter((_, i) => i % Math.max(1, Math.floor(simResults.cumulativeData.length / 200)) === 0)
                      .map(point => {
                        const x = ((point.games - simResults.minGames) / (simResults.maxGames - simResults.minGames)) * 100;
                        const y = 100 - point.percentage;
                        return `${x},${y}`;
                      }).join(' ');
                    
                    return (
                      <>
                        <polyline
                          points={points}
                          fill="none"
                          stroke="rgb(0, 100, 200)"
                          strokeWidth="2"
                        />
                        <polygon
                          points={`0,100 ${points} 100,0 0,0`}
                          fill="rgba(0, 100, 200, 0.1)"
                          stroke="none"
                        />
                      </>
                    );
                  })()}
                </svg>
                
                {/* パーセンタイルの垂直線 */}
                {[25, 50, 75].map(percentile => {
                  const x = ((simResults.percentiles[percentile] - simResults.minGames) / 
                           (simResults.maxGames - simResults.minGames)) * 100;
                  return (
                    <div 
                      key={percentile}
                      className="absolute bottom-0 top-0 w-px bg-gray-400 dashed"
                      style={{ 
                        left: `${x}%`,
                        borderLeftStyle: 'dashed'
                      }}
                    >
                      <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-3 text-xs bg-blue-100 px-1 rounded">
                        {percentile}%
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-center mt-8">
                試合数
              </div>
              <div className="text-sm text-center mt-2">
                ※曲線はX試合以内に目標達成できる確率を表しています
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">代表的なパーセンタイル</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">パーセンタイル</th>
                      <th className="border border-gray-300 p-2">試合数</th>
                      <th className="border border-gray-300 p-2">意味</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[10, 25, 50, 75, 90].map(percentile => (
                      <tr key={percentile}>
                        <td className="border border-gray-300 p-2 text-center">{percentile}%</td>
                        <td className="border border-gray-300 p-2 text-center">
                          {simResults.percentiles[percentile]}試合
                        </td>
                        <td className="border border-gray-300 p-2">
                          {percentile < 50 
                            ? `プレイヤーの${percentile}%が${simResults.percentiles[percentile]}試合以内に目標達成`
                            : `プレイヤーの${100-percentile}%が${simResults.percentiles[percentile]}試合以上かかる`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">ポイントルール</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium mb-2">710pt未満の場合</div>
                  <ul className="text-sm">
                    <li>一勝: +10pt</li>
                    <li>二連勝: +13pt</li>
                    <li>三連勝: +16pt</li>
                    <li>四連勝: +19pt</li>
                    <li>五連勝以上: +22pt</li>
                    <li>負け: -5pt</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="font-medium mb-2">710pt以上の場合</div>
                  <ul className="text-sm">
                    <li>勝ち: +10pt</li>
                    <li>負け: -7pt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProbabilityDensitySimulator;