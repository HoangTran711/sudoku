import React from 'react';
import Board from './board';
import PlayerName from './PlayerName/PlayerName'
import Rank from './Rank/Rank'
import {Button,Alert} from 'react-bootstrap'
import {
  Container,
  Row,
  Col,
  Button1,
  Modal,
  ModalBody,
  ModalHeader,
  FormRadio,
} from 'shards-react';
import MyContext from './data/MyContext'
import fn from '../helperFn/boardFunctions';
import cloneDeep from 'lodash.clonedeep';

const shuffled = [1, 2, 3, 4, 5, 6, 7, 8, 9];
class Game extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      openCredits: false,
      openDifficulty: false,
      openRules: false,
      openNewGame: false,
      difficulty: 'Normal',
      newGame: false,
      solvedButton: false,
      grid: [],
      copyGrid: [],
      name:'',
      submit:false,
      controlTime: {
        pause: ()=>{},
        reset: ()=>{},
        start: () =>{}
      },
      complete:false,
      count: 3,
      openSolve:false
      
    };
  }
  setControlTime = (value) => {
    this.setState({
      ...this.state,
      submit:true,
      controlTime:{
        pause:value.pause,
        reset:value.reset,
        start:value.start
      }
    })
  }
  setName = (name) => {
    this.setState({
      ...this.state,
      name: name
    })
  }
  
  changeDifficulty = diff => {
    this.setState(() => ({ difficulty: diff }));
  };
  
  newGameAccepted = () => {
    this.setState(() => ({
      newGame: true,
      openNewGame: !this.state.openNewGame,
    }));
    this.state.controlTime.reset();
    this.state.controlTime.start();
  };

  handleDifficultyClick = () => {
    this.setState(() => ({ openDifficulty: !this.state.openDifficulty }));
  };

  handleCreditsClick = () => {
    this.setState(() => ({ openCredits: !this.state.openCredits }));
  };

  handleRulesClick = () => {
    this.setState(() => ({ openRules: !this.state.openRules }));
  };

  handleNewGameClick = () => {
    this.setState(() => ({ openNewGame: !this.state.openNewGame }));
  };
  helpButton = () =>{
    this.setState({
      ...this.state,
      openSolve:true
    })
  }
  handleSudokuSolver = () => {
    
    let currentGrid = cloneDeep(this.state.grid);
    let gridCopy = cloneDeep(this.state.grid);
    gridCopy = gridCopy.map(row =>
      row.map(el => {
        return typeof el === 'string' ? null : el;
      }),
    );
    currentGrid = currentGrid.map(row =>
      row.map(el => {
        return typeof el === 'string' ? null : el;
      }),
    );
    fn.solve(gridCopy,shuffled)
    let count = 0;
    for(let row = 0 ; row < 9 ; row++ ){
      if(count > 0){
        break;
      }
      for(let col = 0 ; col <9; col++){
        let row1 = parseInt(Math.random()*10 -1);
        let col1 = parseInt(Math.random()*10 -1);
        if(currentGrid[row1][col1] === null){
          count++;
          currentGrid[row1][col1] = gridCopy[row1][col1];
          break;
        }
      }
      
    }
    this.setState({
      ...this.state,
      count: this.state.count-1,
      openSolve:false,
      grid: currentGrid,
      solvedButton: true
    });
  };
  populateGameGrid = grid => {
    this.setState({ grid: grid, solvedButton: false, newGame: false });
  };
  setCom = (value) => {
    this.setState({
      ...this.state,
      complete:value
    })
  }
  noSolve = () => {
    this.setState({
      ...this.state,
      openSolve:false
    })
  }
  changeName = () => {
    
    this.setState({
      submit:false,
      name:''
    })
  }
  render() {
    return (
      <MyContext.Provider value={{
        name:this.state.name,
        setName:this.setName,
        submit: this.state.submit,
        setControlTime:this.setControlTime,
        controlTime:this.state.controlTime,
        complete:this.state.complete,
      }}>
        <div className='game'>
        <div className='game-title'>
          <p className='title'>SUDOKU!</p>
        </div>
        
        {(this.state.submit)?<div className='game-board'>
            <Board
              difficulty={this.state.difficulty}
              newGame={this.state.newGame}
              populateGameGrid={this.populateGameGrid}
              solvedButton={this.state.solvedButton}
              solvedGrid={this.state.grid}
              pause ={this.state.controlTime.pause}
              complete = {this.state.complete}
              setCom = {this.setCom}
              
            />
        </div>:null}
        <PlayerName/>
        <Rank />
        <Container className='dr-example-container'>
          <Row>
            <Col>
              <Button onClick={this.handleDifficultyClick} className='navBar'>
                Difficulty
              </Button>
            </Col>
            <Col>
              {
                (this.state.submit)?<Button onClick={this.helpButton} className='navBar'>
                Solve
              </Button>:<Button className='navBar'>
                Solve
              </Button>
              }
            </Col>
            <Col>
              <Button onClick={this.handleRulesClick} className='navBar'>
                How To Play
              </Button>
            </Col>
            <Col>
              <Button onClick={this.handleNewGameClick} className='navBar'>
                New Game
              </Button>
            </Col>
          </Row>
        </Container>

        <Modal
          open={this.state.openDifficulty}
          toggle={this.handleDifficultyClick}
        >
          <ModalHeader>Change Difficulty</ModalHeader>
          <ModalBody>
            <FormRadio
              checked={this.state.difficulty === 'Beginner'}
              onChange={() => {
                this.changeDifficulty('Beginner');
              }}
            >
              Beginner
            </FormRadio>
            <FormRadio
              checked={this.state.difficulty === 'Easy'}
              onChange={() => {
                this.changeDifficulty('Easy');
              }}
            >
              Easy
            </FormRadio>
            <FormRadio
              checked={this.state.difficulty === 'Normal'}
              onChange={() => {
                this.changeDifficulty('Normal');
              }}
            >
              Normal
            </FormRadio>
            <FormRadio
              checked={this.state.difficulty === 'Hard'}
              onChange={() => {
                this.changeDifficulty('Hard');
              }}
            >
              Hard
            </FormRadio>
            <Button onClick={this.handleDifficultyClick}>Accept</Button>
          </ModalBody>
        </Modal>

        <Modal open={this.state.openRules} toggle={this.handleRulesClick}>
          <ModalHeader>Welcome to Sudoku!</ModalHeader>
          <ModalBody>
            <div className='rulesText'>
              <p>
                1. Only one number from 1-9 is allowed on each row<br></br>
              </p>
              <p>
                2. Only one number from 1-9 is allowed on each column<br></br>
              </p>
              <p>
                3. Only one number from 1-9 is allowed in each grid<br></br>
              </p>
              <p>
                The goal of the game is to find the missing numbers in the grid
                such that all three of these conditions are satisfied and if
                they are then you have successfully completed the puzzle.
                <br></br>
              </p>
              <p>
                If not, then you must backtrack and find out which numbers are
                inserted incorrectly.<br></br>
              </p>
              <p>
                You will know if the number is inserted incorrectly when the box
                is highlighted red.<br></br>
              </p>
            </div>
            <Button onClick={this.handleRulesClick}>Got it!</Button>
          </ModalBody>
        </Modal>

        <Modal open={this.state.openNewGame} toggle={this.handleNewGameClick}>
          <ModalBody>
            <div className='newGameText'>
              Are you sure?<br></br>
            </div>
            <div className='flexButtons'>
              <Button onClick={this.newGameAccepted}>Yes</Button>
              <Button onClick={this.handleNewGameClick}>No</Button>
            </div>
          </ModalBody>
        </Modal>
        <Modal open={this.state.openSolve} toggle={this.noSolve} >
          <ModalBody>
            <div className='newGameText'>
              {(this.state.count!=0)?<p>Are you sure? You have {this.state.count} times<br></br></p>:
              <Alert variant="danger">
                I can't help you from now!!
              </Alert>
            }
            </div>
            <div className='flexButtons'>
              {(this.state.count!= 0)?<Button onClick={this.handleSudokuSolver}>Yes</Button>:<Button onClick={this.noSolve}>No</Button>}
              <Button onClick={this.noSolve}>No</Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
      </MyContext.Provider>
    );
  }
}

export default Game;
