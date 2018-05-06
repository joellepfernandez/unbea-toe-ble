import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      board: [
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
  
  render() {
    return (
      <div className="app-container">
      <h1>Unbea-TOE-ble</h1>
        {this.state.winner ? <h1>{`The winner is ${this.state.winner}`}</h1> : null}
        <div className="board">
        {this.state.board.map((cell, index) => {
          return <div onClick={() => this.handleClick(index)} className="square">{cell}</div>;
        })}
        </div>
      </div>
    );
  }
}

export default App;