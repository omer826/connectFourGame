import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }
  // cretae the board
  createBoard(rows, cols) {
    let board = []
    for (var i = 0; i < rows; i++) {
      board[i] = [];
      for (var j = 0; j < cols; j++) {
        board[i][j] = { isSelected: false };
      }
    }
    return board;
  }

  setHeader(player, hasWinner = false) {
    let header = ''
    let playerLable = player === 'r' ? 'Red' : 'Yellow';
    if (!hasWinner) {
      header = `${playerLable} Player Turn`;
    } else {
      header = `'${playerLable}' PLAYER IS THE WINNER!!`
    }
    return header;
  }

  playSound() {
    var audio = new Audio('../assets/victorySound.mp3');
    audio.play();
  }


  setCellClass = (cell) => {
    let currClass = ''
    if (cell.isSelected) {
      currClass = `board-col-selected-${cell.color}`
    }
    if (cell.fourInRow) {
      currClass += ' fourInRow'
    }
    return currClass
  };

}
