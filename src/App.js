import React, { Component } from 'react';
import './App.css';
import Announcement from './Announcement.jsx';
import ResetButton from './ResetButton.jsx';
import Tile from './Tile.jsx';

class App extends Component {
  
  constructor(props) {
    super();
    this.state = {
      gameBoard: [
        '', '', '', '', '', '', '', '', ''
      ],
      turn: 'x',
      winner: null,
      maxPlayer: 'x',
      minPlayer: 'o'
    };
  }
  
  resetBoard(){
    this.setState({
      gameBoard: [
        '', '', '', '', '', '', '', '', ''
      ],
      turn: 'x',
      winner: null,
      maxPlayer: 'x',
      minPlayer: 'o'
    });
  }
  
  draw(board){
    let moves = board.join('').replace(/ /g, '');
    if(moves.length === 9){
      return true;
    }
    return false;
  }
  
  winner(board, player){
    if(
      (board[0] === player && board[1] === player && board[2] === player) ||
      (board[3] === player && board[4] === player && board[5] === player) ||
      (board[6] === player && board[7] === player && board[8] === player) ||
      (board[0] === player && board[3] === player && board[6] === player) ||
      (board[1] === player && board[4] === player && board[7] === player) ||
      (board[2] === player && board[5] === player && board[8] === player) ||
      (board[0] === player && board[4] === player && board[8] === player) ||
      (board[2] === player && board[4] === player && board[6] === player)
      ){
        return true;
        
    } else {
        return false;
    }
  }
  
  copyBoard(board){
    return board.slice(0);  
  }
  
  validMove(move, player, board){
    let newBoard = this.copyBoard(board);
    if(newBoard[move] === ''){
      newBoard[move] = player;
      return newBoard;
    } else {
      return false;
    }
  }
  
  // function for Ai moves 
  computer(board){
    let bestScore = 100; //arbitrary high value
    let move = null;
    // test possible moves
    if(this.winner(board, 'x') || this.winner(board, 'o') || this.draw(board)){
      return null;
    }
    for(let i = 0; i < board.length; i++){
      let newBoard = this.validMove(i, this.state.minPlayer, board);
      if(newBoard){
        let moveScore = this.maxScore(newBoard);
        if(moveScore < bestScore){
          bestScore = moveScore;
          move = i;
        }
      }
    }
    return move;
  }
  
  minScore(board){
    if(this.winner(board, 'x')){
      return 10;
    } else if(this.winner(board, 'o')){
      return -10; 
    } else if(this.draw(board)){
      return 0;
    } else {
      let bestMove = 100;
      for(let i = 0; i < board.length; i++){
        let newBoard = this.validMove(i, this.state.minPlayer, board);
        if(newBoard){
          let predictedMove = this.maxScore(newBoard);
          if(predictedMove < bestMove){
            bestMove = predictedMove;
          }
        }
      }
      return bestMove;
    }
  }
  
  maxScore(board){
    if(this.winner(board, 'x')){
      return 10;
    } else if(this.winner(board, 'o')){
      return -10;
    } else if(this.draw(board)){
      return 0;
    } else {
      let bestMove = -100;
      for(let i = 0; i < board.length; i++){
        let newBoard = this.validMove(i, this.state.maxPlayer, board);
        if(newBoard){
          let predictedMove = this.minScore(newBoard);
          if(predictedMove > bestMove){
            bestMove = predictedMove;
          }
        }
      }
      return bestMove;
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
    if(this.draw(currentGameBoard)){
      this.setState({
        gameBoard: currentGameBoard,
        winner: 'd'
      });
      return;
    }
    player = 'o';
    currentGameBoard = this.validMove(this.computer(currentGameBoard), player, currentGameBoard);
    if(this.winner(currentGameBoard, player)){
      this.setState({
        gameBoard: currentGameBoard,
        winner: player //player already set to 'o'
      });
      return;      
    }
    if(this.draw(currentGameBoard)){
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
      <div className="container">
        <h1>Unbea-TOE-ble</h1>
        <ResetButton reset={this.resetBoard.bind(this)}/>
        <Announcement winner={this.state.winner}/>
        {this.state.gameBoard.map((value, i) =>{
          return (
            <Tile
              key={i}
              loc={i}
              value={value}
              gameLoop={this.gameLoop.bind(this)} />
          );
        })}
      </div>
    );
  }
}

export default App;

