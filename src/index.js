import React from 'react';
import ReactDOM from 'react-dom';
//import Button from 'react-bootstrap/Button';
//import { Button } from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import './index.css';
import {Square,ActiveSquare} from './Components/square';
import {randomlyGeneratedValue} from './helperFn/boardFunctions';
  
  class Board extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        // https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
        grid: Array(9).fill(null).map(x=>Array(9).fill(null)),
      };
    }

    componentDidMount(){
      //var arr = Array(9).fill(null).map(x=>Array(9).fill(null));
      var arr = Array(9).fill(null);
      var entries = [1,2,3,4,5,6,7,8,9];
      this.generateInitialBox(arr,entries);

      var newGrid = Array(9).fill(null).map(x=>Array(9).fill(null));
      var boxGrid = Array(9).fill(null).map(x=>[]);
      var row = 0;
      var col = 0;

      while (row <= 6){
        while (col <= 6){
          if (row === 0 && col === 0){
            this.generateBox(row,col,arr,newGrid);
          } else {
            arr = this.generateValidEntries(boxGrid,entries,row,col,newGrid);
            if (arr.length === 0){
              row = 0;
              col = 0;
              this.generateInitialBox(arr,entries);
              newGrid = Array(9).fill(null).map(x=>Array(9).fill(null));
              continue;
            }
            this.generateBox(row,col,arr,newGrid);
          }
          boxGrid = Array(9).fill(null).map(x=>[]);
          col += 3;
        }
        row += 3;
        col = 0;
      }

      for (var box = 0; box < newGrid.length; box+=1){
          this.removingEntries(newGrid[box]);
      }

      this.setState(() => ({grid: newGrid}));
    }

    removingEntries(box){
      var entriesToRemove = randomlyGeneratedValue(2,10);
      var entriesRemoved = 0;
      var indexEntries = [0,1,2,3,4,5,6,7,8];

      while (entriesRemoved < entriesToRemove){
        var entryRemoved = this.randomlyGeneratedValue(0,10);
        box.splice(indexEntries[entryRemoved],1,null);
        indexEntries.splice(entryRemoved,1);
        entriesRemoved+=1;
      }
    }

    generateInitialBox(arr,entries) {
      var entryCopy = entries.slice();
      var i = 0;
      var cellsToFill = 9;
      while (i < cellsToFill){
        var toAdd = this.randomlyGeneratedArrayValue(0,entryCopy.length,entryCopy);
        arr[i] = toAdd;
        entryCopy.splice(entryCopy.indexOf(toAdd),1);
        i++;
      }
    }

    generateBox(beginRow,beginCol,arrEntries, newGrid){
      var indexing = 0;
      for (var row = beginRow; row < beginRow+3; row++){
        
        var col = beginCol;
        while (col < beginCol+3){
          newGrid[row].splice(col,1,arrEntries[indexing]);
          col+=1;
          indexing += 1;
        }
      }

      return newGrid;
    }    

    generateValidEntries(boxGrid, entries, beginRow, beginCol, newGrid){
      var columnInsert = false;
      var bothColumnRowInsert = false;

      if (newGrid[beginRow].every(function(x){
        return x === null;
      })) {
        columnInsert = true;
      } else if (this.checkColElementsExist(newGrid,beginCol)){
        bothColumnRowInsert = true;
      }

      var entryIndex;
      var boxIndex = 0;
      for (var row = beginRow; row < beginRow+3; row++){
        for (var col = beginCol; col < beginCol+3; col++){
          entryIndex = 0;
          while (entryIndex < 9) {
            if (this.checkConditions(entries[entryIndex],row,col,newGrid)){
                boxGrid[boxIndex].push(entries[entryIndex]);
            }
            entryIndex+=1;
          }
          if (boxGrid[boxIndex].length === 0){
            return [];
          }
          boxIndex += 1;
        }
      }

      var concatResult = [];
      var row1Entries;
      var row2Entries;
      var row3Entries;
      var concatRows;
      if (bothColumnRowInsert){
          var tempGrid = Array(9).fill(null);
          this.scanGrid(boxGrid,tempGrid);
          concatResult = tempGrid;
      }
      // Want to refactor this, looks ugly
      // boxGrid[0],boxGrid[3],boxGrid[6] is for row boxes
      // boxGrid[0],boxGrid[1],boxGrid[2] is for col boxes
      else if (!columnInsert) {
        if (boxGrid.every(function(x){
            return x.length === 3;
        })){
            tempGrid = Array(9).fill(null);
            this.scanGrid(boxGrid,tempGrid);
            concatResult = tempGrid;
        } else {
            row1Entries = this.intersectArrays(boxGrid[0],boxGrid[3]);
            row2Entries = this.intersectArrays(boxGrid[3],boxGrid[6]);
            concatRows = row1Entries.concat(row2Entries);
            row3Entries = entries.filter(x=>!concatRows.includes(x));
            concatResult = row1Entries.concat(row2Entries);
            concatResult = concatResult.concat(row3Entries);
        }
      } 
      else {
        if (boxGrid.every(function(x){
          return x.length === 3;
        })){
          tempGrid = Array(9).fill(null);
          this.scanGrid(boxGrid,tempGrid);
          concatResult = tempGrid;
        } else {
          row1Entries = this.intersectArrays(boxGrid[0],boxGrid[1]);
          row2Entries = this.intersectArrays(boxGrid[1],boxGrid[2]);
          concatRows = row1Entries.concat(row2Entries);
          row3Entries = entries.filter(x=>!concatRows.includes(x));
          for (var i = 0; i < 3; i++){
            concatResult.push(row1Entries[i]);
            concatResult.push(row2Entries[i]);
            concatResult.push(row3Entries[i]);
          }
        }
      }
      
      return concatResult;
    }

    arrayLengths(arr) {
      var arrResult = [];
      arr.forEach((v,i)=>{
        if (v === null){
          arrResult.push(0);
        } else {
          arrResult.push(v.length);
        }
      });
      return arrResult;
    }

    scanGrid(boxGrid, tempGrid){
      var arrOfLengths = this.arrayLengths(boxGrid);
      var index;
      var boxOfInterest;

      while (tempGrid.filter(x=>x !== null).length < 9) {
        index = arrOfLengths.findIndex(function(x){
          var tmp = arrOfLengths.filter(x=>x !== undefined);
          return x === Math.min(...tmp);
        });

        boxOfInterest = boxGrid[index];
        tempGrid[index] = boxOfInterest[0];
        this.updateBoxGrid(boxGrid,tempGrid[index],index);
        arrOfLengths = this.arrayLengths(boxGrid);
      }

      return tempGrid;
    }

    // intersecting two sets
    //concat = concat.filter((item, index) => concat.indexOf(item) !== index);
    intersectArrays(arr1,arr2){
      var concat = arr1.concat(arr2);
      concat = concat.filter((item, index) => concat.indexOf(item) !== index);
      return concat;
    }

    updateBoxGrid(boxGrid, valuetoInsert, indexToInsert) {
      boxGrid[indexToInsert] = valuetoInsert;
      for (var i = 0; i < boxGrid.length; i++){
        let box = boxGrid[i];
        if (box === null || box.length === undefined){
          continue;
        } else {
          if (box.indexOf(valuetoInsert) !== -1){
            box.splice(box.indexOf(valuetoInsert),1);
          }
          boxGrid[i] = box;
        }
      }
    }

    checkColElementsExist(grid,col){
      for (var row = 0; row < 9; row += 1) {
        if (grid[row][col] !== null) {
          return true;
        }
      }
      return false;
    }

    emptyArrays(x){
      return x.length === 0;
    }

    sortAscending(a,b){
      return a.length - b.length; 
    }

    intersectRowEntries(startIndex, boxGrid, rowIntersected) {
      for (var index = startIndex; index < startIndex+3; index += 1){
        var row1Entries = this.intersectArrays(boxGrid[index],boxGrid[index+3]);
        rowIntersected.push(row1Entries);
      }
    }

    updatingRowResultAndGrid(indexOfIntersect,rowIntersected,boxGrid,toInsert,rowResult){
      rowResult.splice(indexOfIntersect, 1, toInsert);
      rowIntersected[indexOfIntersect] = [];
      this.updateBoxGrid(rowIntersected, toInsert);
      this.updateBoxGrid(boxGrid, toInsert);
    }

    randomlyGeneratedArrayValue(min,max,arr){
      return arr[Math.floor(Math.random() * (max - min)) + min];
    }

    checkConditions(valueToAdd,rowNumber,colNumber,grid){
      if (!this.checkRow(grid,rowNumber,valueToAdd) || !this.checkCol(grid,colNumber,valueToAdd)){
        return false;
      }
      return true;
    }
    
    checkRow(grid, rowNumber, valueToAdd){
      if (grid[rowNumber].indexOf(valueToAdd) !== -1) {
        return false;
      }
      return true;
    }

    checkCol(grid, colNumber, valueToAdd){
      for (var row = 0; row < 9; row += 1) {
        if (grid[row][colNumber] === valueToAdd) {
          return false;
        }
      }

      return true;
    }

    renderSquare(i,j){
      if (this.state.grid[i][j] !== null){
        return (
          <Square
            number = {this.state.grid[i][j]}
          />
        );
      } else {
        return (
          <ActiveSquare
            number = {this.state.grid[i][j]}
          />
        )
      }
    }
  
    render() {
      return (
        <div className="sudoku">
            <div className="sudoku-row">
                <div className="sudoku-grid">
                    {this.renderSquare(8,0)}
                    {this.renderSquare(8,1)}
                    {this.renderSquare(8,2)}
                    {this.renderSquare(7,0)}
                    {this.renderSquare(7,1)}
                    {this.renderSquare(7,2)}
                    {this.renderSquare(6,0)}
                    {this.renderSquare(6,1)}
                    {this.renderSquare(6,2)}
                </div>
                <div className="sudoku-grid">
                    {this.renderSquare(8,3)}
                    {this.renderSquare(8,4)}
                    {this.renderSquare(8,5)}
                    {this.renderSquare(7,3)}
                    {this.renderSquare(7,4)}
                    {this.renderSquare(7,5)}
                    {this.renderSquare(6,3)}
                    {this.renderSquare(6,4)}
                    {this.renderSquare(6,5)}
                </div>
                <div className="sudoku-grid">
                    {this.renderSquare(8,6)}
                    {this.renderSquare(8,7)}
                    {this.renderSquare(8,8)}
                    {this.renderSquare(7,6)}
                    {this.renderSquare(7,7)}
                    {this.renderSquare(7,8)}
                    {this.renderSquare(6,6)}
                    {this.renderSquare(6,7)}
                    {this.renderSquare(6,8)}
                </div>
            </div>
            <div className="sudoku-row">
                <div className="sudoku-grid">
                    {this.renderSquare(5,0)}
                    {this.renderSquare(5,1)}
                    {this.renderSquare(5,2)}
                    {this.renderSquare(4,0)}
                    {this.renderSquare(4,1)}
                    {this.renderSquare(4,2)}
                    {this.renderSquare(3,0)}
                    {this.renderSquare(3,1)}
                    {this.renderSquare(3,2)}
                </div>
                <div className="sudoku-grid">
                    {this.renderSquare(5,3)}
                    {this.renderSquare(5,4)}
                    {this.renderSquare(5,5)}
                    {this.renderSquare(4,3)}
                    {this.renderSquare(4,4)}
                    {this.renderSquare(4,5)}
                    {this.renderSquare(3,3)}
                    {this.renderSquare(3,4)}
                    {this.renderSquare(3,5)}
                </div>
                <div className="sudoku-grid">
                    {this.renderSquare(5,6)}
                    {this.renderSquare(5,7)}
                    {this.renderSquare(5,8)}
                    {this.renderSquare(4,6)}
                    {this.renderSquare(4,7)}
                    {this.renderSquare(4,8)}
                    {this.renderSquare(3,6)}
                    {this.renderSquare(3,7)}
                    {this.renderSquare(3,8)}
                </div>
            </div>
            <div className="sudoku-row">
                <div className="sudoku-grid">
                    {this.renderSquare(2,0)}
                    {this.renderSquare(2,1)}
                    {this.renderSquare(2,2)}
                    {this.renderSquare(1,0)}
                    {this.renderSquare(1,1)}
                    {this.renderSquare(1,2)}
                    {this.renderSquare(0,0)}
                    {this.renderSquare(0,1)}
                    {this.renderSquare(0,2)}
                </div>
                <div className="sudoku-grid">
                    {this.renderSquare(2,3)}
                    {this.renderSquare(2,4)}
                    {this.renderSquare(2,5)}
                    {this.renderSquare(1,3)}
                    {this.renderSquare(1,4)}
                    {this.renderSquare(1,5)}
                    {this.renderSquare(0,3)}
                    {this.renderSquare(0,4)}
                    {this.renderSquare(0,5)}
                </div>
                <div className="sudoku-grid">
                    {this.renderSquare(2,6)}
                    {this.renderSquare(2,7)}
                    {this.renderSquare(2,8)}
                    {this.renderSquare(1,6)}
                    {this.renderSquare(1,7)}
                    {this.renderSquare(1,8)}
                    {this.renderSquare(0,6)}
                    {this.renderSquare(0,7)}
                    {this.renderSquare(0,8)}
                </div>
            </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol></ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );