import React, { Component } from 'react';
import './App.css';
import Announcement from './Annoucement.jsx';
import ResetButton from './ResetButton.jsx';
import Tile from './Tile.jsx';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gameBoard: [
        "", "", "", "", "", "", "", "", ""
      ],
      currentTurn: "X",
      winner: null,
      maxPLayer: "X",
      minPlayer: "O"
    };
  }
  
  resetBoard(){
    this.setState({
      board: [
        "", "", "", "", "", "", "", "", ""
      ],
      currentTurn: "X",
      winner: null,
      maxPLayer: "X",
      minPlayer: "O"
    });
  }
  
  updateBoard(loc, player){
    
  }

  handleClick(index) {
    if(this.state.board[index] === "" && !this.state.winner) {
      this.state.board[index] = this.state.currentTurn;
      this.setState({
        board: this.state.board,
        currentTurn: this.state.currentTurn === this.state.PLAYER_ONE_SYMBOL ? this.state.PLAYER_TWO_SYMBOL : this.state.PLAYER_ONE_SYMBOL,
        winner: this.checkForWinner(),
      });
    }
  }

  // checkForWinner() {
  //   var currentTurn = this.state.currentTurn;
  //   var symbols = this.state.board;
  //   var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  //   return winningCombos.find(function(combo) {
  //     if(symbols[combo[0]] !== "" && symbols[combo[1]] !== ""  && symbols[combo[2]] !== ""  && symbols[combo[0]] === symbols[combo[1]] && symbols[combo[1]] === symbols[combo[2]]) {
  //       return currentTurn;
  //     } else {
  //       return false;
  //     }
  //   });
  // }
  
  tie(board){
    var moves = board.join('').replace(/ /g, '');
    if(moves.length === 9){
      return true;
    }
    return false;
  }

  winner(board, player){
  if (
        (board[0] === player && board[1] === player && board[2] === player) ||
        (board[3] === player && board[4] === player && board[5] === player) ||
        (board[6] === player && board[7] === player && board[8] === player) ||
        (board[0] === player && board[3] === player && board[6] === player) ||
        (board[1] === player && board[4] === player && board[7] === player) ||
        (board[2] === player && board[5] === player && board[8] === player) ||
        (board[0] === player && board[4] === player && board[8] === player) ||
        (board[2] === player && board[4] === player && board[6] === player)
        ) {
        return true;
    } else {
        return null;
    }
  }
  
  copyBoard(board){
    return board.slice(0);  
  }
  
  validBoard(move, player, board){
    var newBoard = this.copyBoard(board);
    if(newBoard[move] === ' '){
      newBoard[move] = player;
      return newBoard;
    } else{
      return null;
    }
  }
  
  findAiMove(board){
    var bestMoveScore = 100; //arbitrary high value
    let move = null;
    if(this.winner(board, 'X') || this.winner(board, 'O') || this.tie(board)){
      return null;
    }
    for(let i = 0; i < board.length; i++){
      let newBoard = this.validMove(i, this.state.minPlayer, board);
      if(newBoard){
        var moveScore = this.maxScore(newBoard);
        if(moveScore < bestMoveScore){
          bestMoveScore = moveScore;
          move = i;
        }
      }
    }
    return move;
  }
  
  minScore(board){
    if(this.winner(board, 'X')){
      return 10;
    } else if(this.winner(board, 'O')){
      return -10;
    } else if(this.tie(board)){
      return 0;
    } else {
      var bestMoveValue = 100;
      for(let i = 0; i < board.length; i++){
        var newBoard = this.validBoard(i, this.state.minPlayer, board);
        if(newBoard){
          var predictMoveValue = this.maxScore(newBoard);
          if(predictMoveValue < bestMoveValue){
            bestMoveValue = predictMoveValue;
          }
        }
      }
      return bestMoveValue;
    }
  }
  
  maxScore(board){
    if(this.winner(board, 'X')){
      return 10;
    } else if(this.winner(board, 'O')){
      return -10;
    } else if(this.tie(board)){
      return 0;
    } else {
      var bestMoveValue = -100;
      for(let i = 0; i < board.length; i++){
        var newBoard = this.validBoard(i, this.state.maxPlayer, board);
        if(newBoard){
          var predictMoveValue = this.minScore(newBoard);
          if(predictMoveValue > bestMoveValue){
            bestMoveValue = predictMoveValue;
          }
        }
      }
      return bestMoveValue;
    }
  }
  
  gameLoop(move){
    let player = this.state.turn;
    let currentGameBoard = this.validMove(move, player, this.state.gameBoard);
    if(this.winner(currentGameBoard, player)){
      this.setState({
        gameBoard: currentGameBoard,
        winner: player
      });
      return;
    }
    if(this.tie(currentGameBoard)){
      this.setState({
        gameBoard: currentGameBoard,
        winner: 'd'
      });
      return;
    }
    player = 'O';
    currentGameBoard = this.validMove(this.findAiMove(currentGameBoard), player, currentGameBoard);
    if(this.winner(currentGameBoard, player)){
      this.setState({
        gameBoard: currentGameBoard,
        winner: player //player already set to 'O'
      });
      return;      
    }
    if(this.tie(currentGameBoard)){
      this.setState({
        gameBoard: currentGameBoard,
        winner: 'd'
      });
      return;
    }
    this.setState({
      gameBoard: currentGameBoard
    });
  }
  
  render() {
    return (
      <div className="app-container">
      <div className="menu">
        <ResetButton />
      </div>
      <h1>Unbea-TOE-ble</h1>
      <Announcement /> //class
      
        {this.state.winner ? <h1>{`The winner is ${this.state.winner}`}</h1> : null}
        // map the state to return a tile
        {this.state.gameBoard.map((value, i)=>{
          return (
            <Tile
              key={1}
              loc={1}
              value={value}
              gameLoop={this.gameLoop.bind(this)}/>
          );
        })}
      </div>
    );
  }
}

export default App;

        // <div className="board">
        // {this.state.board.map((cell, index) => {
        //   return <div onClick={() => this.handleClick(index)} className="square">{cell}</div>;
        // })}
        // </div>