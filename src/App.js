import "./App.css";
import React from "react";
import { previousWinningNumbers as allNumber } from "./PreviousWinningNumbers";

/* 
    todo : 역대 당첨되지 않은 조합찾는 로직 : Maximum call stack size exceeded => 재귀 호출 너무 많음 약 8백만 번 호출 필요  
*/
function App() {
  const [lottoNumbers] = React.useState(allNumber);
  const [resultByPosition, setResultByPosition] = React.useState([]);
  const [top6Frequent, setTop6Frequent] = React.useState([]);
  const [neverDrawnNumbers, setNeverDrawnNumbers] = React.useState([]);

  // 자리 별 가장 많이 당첨된 번호
  const findMostFrequentByPosition = (numbers) => {
    const frequency = Array(6)
      .fill(null)
      .map(() => ({}));

    numbers.forEach((set) => {
      set.forEach((num, idx) => {
        frequency[idx][num] = (frequency[idx][num] || 0) + 1;
      });
    });

    return frequency.map((freq) => {
      const sortedEntries = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      return sortedEntries.length > 0 ? +sortedEntries[0][0] : null;
    });
  };

  // 자리 관계없이 가장 많이 당첨된 번호
  const findTop6FrequentNumbers = (numbers) => {
    const frequency = {};
    numbers.forEach((set) => {
      set.forEach((num) => {
        frequency[num] = (frequency[num] || 0) + 1;
      });
    });
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map((entry) => +entry[0])
      .sort((a, b) => a - b);
  };

  const calculate = React.useCallback(() => {
    setResultByPosition(findMostFrequentByPosition(lottoNumbers));
    setTop6Frequent(findTop6FrequentNumbers(lottoNumbers));
  }, [lottoNumbers]);

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <div className="analyzer-container">
      <div className="result-card">
        <h2>자리 별 가장 많이 당첨된 번호</h2>
        <p>{resultByPosition.join(", ")}</p>
      </div>
      <div className="result-card">
        <h2>자리 관계없이 가장 많이 당첨된 번호</h2>
        <p>{top6Frequent.join(", ")}</p>
      </div>
    </div>
  );
}

export default App;
