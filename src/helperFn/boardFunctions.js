import {useState} from 'react';
function randomlyGeneratedValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
const removingEntries = (newGrid, difficulty) => {
  
  let minToRemove;
  let maxToRemove;
  if (difficulty === 'Beginner') {
    minToRemove = 1;
    maxToRemove = 1;
  } else if (difficulty === 'Easy') {
    minToRemove = 3;
    maxToRemove = 3;
  } else if (difficulty === 'Normal') {
    minToRemove = 4;
    maxToRemove = 6;
  } else if (difficulty === 'Hard') {
    minToRemove = 7;
    maxToRemove = 10;
  }

  for (let row = 0; row < newGrid.length; row += 1) {
    let entriesToRemove = randomlyGeneratedValue(minToRemove, maxToRemove);
    let entriesRemoved = 0;
    let indexEntries = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    while (entriesRemoved < entriesToRemove) {
      let entryRemoved = randomlyGeneratedValue(0, indexEntries.length);
      newGrid[row].splice(indexEntries[entryRemoved], 1, null);
      indexEntries.splice(entryRemoved, 1);
      entriesRemoved += 1;
    }
  }
};

const createGrid = () => {
  let arr = [];

  for (let i = 0; i < 9; i++) {
    let innerArr = [];
    for (let j = 0; j < 9; j++) {
      innerArr.push(null);
    }
    arr.push(innerArr);
  }

  return arr;
};

// I could be wrong here, but we only need to check one condition
// If this condition fails, then they all fail
const verifyRow = (grid, row, val = null) => {
  const rowOfNums = Array.from(grid[row], x => Number(x));
  if (!val) {
    let verifyArr = [];
    rowOfNums.forEach(row => {
      if (!verifyArr.includes(row)) {
        verifyArr.push(row);
      }
    });
    return verifyArr.length === grid[row].length;
  } else {
    if (rowOfNums.includes(Number(val))) {
      return false;
    }
    return true;
  }
};

const verifyCol = (grid, col, val = null) => {
  for (let row = 0; row < 9; row++) {
    if (Number(grid[row][col]) === Number(val)) {
      return false;
    }
  }
  return true;
};

const verifyBox = (grid, row, col, val = null) => {
  let startRow = parseInt(row / 3) * 3;
  let startCol = parseInt(col / 3) * 3;

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (Number(grid[r][c]) === Number(val)) {
        return false;
      }
    }
  }
  return true;
};

const isValid = (grid, row, col, num = null) => {
  if (
    verifyBox(grid, row, col, num) &&
    verifyCol(grid, col, num) &&
    verifyRow(grid, row, num)
  ) {
    return true;
  }
  return false;
};

const verifySudoku = grid => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!isValid(grid, row, col)) {
        return false;
      }
    }
  }
  return true;
};

const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const solve = (grid, shuffled) => {

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        shuffled.forEach(choice => {
          if (isValid(grid, row, col, choice)) {
            grid[row][col] = choice;
            solve(grid,shuffled)
            if (!verifySudoku(grid)) {
              grid[row][col] = null
            } else {
              return grid;
            }
          }
        });
        return grid ;
      }
    }
  }
  
  
};


export default {
  randomlyGeneratedValue,
  verifyRow,
  verifyCol,
  verifyBox,
  removingEntries,
  createGrid,
  isValid,
  verifySudoku,
  shuffle,
  solve
};
