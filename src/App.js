import "./App.css";
import React from "react";
import { previousWinningNumbers as allNumber } from "./PreviousWinningNumbers";

// 가장 자주 당첨된 번호 찾기
const findTopFrequentNumbers = (numbers, count) => {
  const frequency = {};
  numbers.forEach((set) => {
    set.forEach((num) => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
  });
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map((entry) => +entry[0]);
};

// 상위 빈도수 번호 조합 생성
const generateTopCombinations = (topNumbers, previousNumbersSet) => {
  const combinations = [];

  const generateCombinations = (arr, size, start, initialStuff, output) => {
    if (initialStuff.length >= size) {
      const combinationString = initialStuff.sort((a, b) => a - b).join(",");
      if (!previousNumbersSet.has(combinationString)) {
        output.push(initialStuff);
      }
      return;
    }

    for (let i = start; i < arr.length; ++i) {
      generateCombinations(arr, size, i + 1, [...initialStuff, arr[i]], output);
    }
  };

  generateCombinations(topNumbers, 6, 0, [], combinations);
  return combinations.slice(0, 10); // 상위 10개 조합만 반환
};

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

function App() {
  const [lottoNumbers] = React.useState(allNumber);
  const [resultByPosition, setResultByPosition] = React.useState([]);
  const [top6Frequent, setTop6Frequent] = React.useState([]);
  const [topCombinations, setTopCombinations] = React.useState([]);

  React.useEffect(() => {
    setResultByPosition(findMostFrequentByPosition(lottoNumbers));
    setTop6Frequent(findTop6FrequentNumbers(lottoNumbers));

    const previousNumbersSet = new Set(
      lottoNumbers.map((set) => set.sort((a, b) => a - b).join(","))
    );
    const topNumbers = findTopFrequentNumbers(lottoNumbers, 10); // 상위 10개 빈도수 번호
    const topCombos = generateTopCombinations(topNumbers, previousNumbersSet);
    setTopCombinations(topCombos);
  }, [lottoNumbers]);

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
      <div className="result-card">
        <h2>역대 한 번도 당첨되지 않은 번호 중 당첨 확률이 높은 조합</h2>
        <ul>
          {topCombinations.map((combination, index) => (
            <li key={index}>{combination.join(", ")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
