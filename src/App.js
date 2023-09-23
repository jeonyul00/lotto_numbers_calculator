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
  // const [notDrawnCombinations, setNotDrawnCombinations] = React.useState([]);

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

  // 자리 별 당첨되지 않은 번호
  const findNeverDrawnNumbersByPosition = (numbers) => {
    const numbersByPosition = Array(6)
      .fill(null)
      .map(() => new Set());
    numbers.forEach((set) => {
      set.forEach((num, idx) => {
        numbersByPosition[idx].add(num);
      });
    });

    return numbersByPosition.map((positionSet) => {
      const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
      return allNumbers.filter((num) => !positionSet.has(num));
    });
  };

  /* 1~45 사이의 모든 6자리 조합 중 역대 당첨되지 않은 조합 찾기    
    const findNotDrawnCombinations = useCallback(() => {
      function getCombinations(arr, selectNumber) {
        const results = [];
        if (selectNumber === 1) return arr.map((value) => [value]);
        arr.forEach((fixed, index, origin) => {
          const rest = origin.slice(index + 1);
          const combinations = getCombinations(rest, selectNumber - 1);
          const attached = combinations.map((combination) => [
            fixed,
            ...combination,
          ]);
          results.push(...attached);
        });
        return results;
      }

      const allCombinations = getCombinations(
        Array.from({ length: 45 }, (_, i) => i + 1),
        6
      );
      return allCombinations.filter(
        (combination) =>
          !lottoNumbers.some(
            (drawnNumbers) =>
              JSON.stringify(drawnNumbers) === JSON.stringify(combination)
          )
      );
    }, [lottoNumbers]);
*/

  const calculate = React.useCallback(() => {
    setResultByPosition(findMostFrequentByPosition(lottoNumbers));
    setTop6Frequent(findTop6FrequentNumbers(lottoNumbers));
    setNeverDrawnNumbers(findNeverDrawnNumbersByPosition(lottoNumbers));
    // setNotDrawnCombinations(findNotDrawnCombinations());
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
      <div className="result-card">
        <h2>자리 별 당첨되지 않은 번호</h2>
        <p>
          {neverDrawnNumbers.map((nums, idx) => (
            <span key={idx}>
              {idx + 1}번 자리 : {nums.join(", ")}
              <p />
            </span>
          ))}
        </p>
      </div>
      {/* <div className="result-card">
        <h2>역대 당첨되지 않은 번호</h2>
        <p>{notDrawnCombinations.length}개의 조합이 당첨되지 않았습니다.</p>
      </div> */}
    </div>
  );
}

export default App;
