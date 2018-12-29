import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { ThrowStmt } from '@angular/compiler';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(private gameService: GameService) { }

  currentPlayer = 'r';
  gameMove = 0;
  gameOver = false;
  cols = 7;
  rows = 6;
  gamesTotalMoves = (this.cols * this.rows);
  headerLable = 'Strat to play';
  winner = null;
  board = [];
  loadin = true;

  ngOnInit() {
    this.init();
  }

  init() {
    this.board = this.gameService.createBoard(this.rows, this.cols);
    this.gameMove = 0;
    this.headerLable = 'strat to play';
    this.currentPlayer = 'r';
    this.gameOver = false;
    this.loadin = false;
    this.winner = null;
  }

  onCellClick(x, y) {
    if (!this.gameOver) {
      this.gameMove = 1;
      let selctedCell = {};
      // find the empty cell
      selctedCell = this.findEmptyCell(x, y)

      // send function to checkWinner

      this.checkWinner(selctedCell, this.currentPlayer);
      // set next player
      let player = this.currentPlayer === 'r' ? 'y' : 'r';

      // change the header by the player
      this.headerLable = this.gameService.setHeader(player);

      this.currentPlayer = player;

      if (this.gameMove === this.gamesTotalMoves) {
        this.gameOver = true;
      }
    }
  };

  findEmptyCell(x, y) {
    let currColor = this.currentPlayer;
    let selctedCell = {};
    for (var i = this.board.length - 1; i >= 0; i--) {

      let currRow = this.board[i];
      let clickedRow = currRow[y];
      if (!clickedRow.isSelected) {
        this.board[i][y].isSelected = true;
        this.board[i][y].color = currColor;
        selctedCell = { x: i, y: y };
        break;
      }
    };
    return selctedCell;
  }


  checkWinner(cell, player) {
    // vertical
    this.checkRowHorizontalVertical(cell, player, this.rows, 'vr');
    // horizontal
    this.checkRowHorizontalVertical(cell, player, this.cols, 'hr');
    // diagonal
    this.checkDiag(cell, player);

  }

  setWinner = (winner) => {
    setTimeout(() => {
      this.currentPlayer = winner;
      this.headerLable = this.gameService.setHeader(this.currentPlayer, true);
    }, 100);
    this.gameOver = true;
    this.winner = true;
    this.gameService.playSound();
  }

  // set css class to the cells
  setClass = (cell) => {
    return this.gameService.setCellClass(cell)
  };

  checkRowHorizontalVertical(obj, player, len, type) {
    if (!this.gameOver) {
      let { x, y } = obj;
      let totalCellSelected = 0;
      let selectedCellArr = [];
      let selectedCellObj = {};
      for (var i = 0; i < len; i++) {

        if (totalCellSelected >= 4) {
          break;
        }

        let currCell = null;

        if (type === 'hr') {
          currCell = this.board[x][i];
          selectedCellObj = { i: x, j: i }
        } else {
          currCell = this.board[i][y];
          selectedCellObj = { i: i, j: y };
        }

        if (currCell.isSelected && currCell['color'] === player) {
          totalCellSelected++;
          selectedCellArr.push(selectedCellObj)
        } else {
          totalCellSelected = 0;
          selectedCellArr = [];
        }

      }

      let hasWinner = totalCellSelected >= 4 ? player : null;
      if (totalCellSelected >= 4) {
        this.markedCell(selectedCellArr);
        this.setWinner(hasWinner);
      }

    }

  }

  checkDiag(obj, player) {
    let totalCellSelected = 0;
    let { x, y } = obj;
    let minPos = x;
    let testx = x
    let testy = y
    let selectedCellArr = [];
    let selectedCellObj = {};
    try {
      if ((y === 0 || y === this.cols - 1) && (x >= 3)) {
        return;
      }
      // check down-left direction

      let downRes = this.checkDiagDownDirection(x, y, player);
      totalCellSelected = downRes.total;
      selectedCellArr = downRes.selectedArr;


      let isGameOver = this.checkWinnerInDiag(totalCellSelected, player, selectedCellArr);
      if (isGameOver) {
        return
      } else {
        let upRes = this.checkDiagUpDirection(x, y, player);
        totalCellSelected = upRes.total;
        selectedCellArr = upRes.selectedArr;
        this.checkWinnerInDiag(totalCellSelected, player, selectedCellArr);
      }

    }

    catch (e) {
      console.log(e);

    }

  }

  checkDiagDownDirection(x, y, player) {
    let totalCellSelected = 0;
    let posX = x;
    let posY = y;
    let minPos = x;
    let selectedCellObj = {};
    let selectedCellArr = [];

    // down
    // get the min pos
    if (y !== 0 && (x !== 0)) {
      minPos = Math.min(x, y);
      posX = x - minPos;
      posY = y - minPos;

    }
    while (posX < this.rows || posY > this.cols) {
      if (posY >= this.cols) {
        break;
      }
      let curCell = this.board[posX][posY];
      if (totalCellSelected >= 4) {
        break;
      }
      selectedCellObj = { i: posX, j: posY }
      if (curCell['color'] === player) {
        totalCellSelected++;
        selectedCellArr.push(selectedCellObj)
      } else {
        totalCellSelected = 0;
        selectedCellArr = [];
      }
      posY++;
      posX++;
    }
    let res = { selectedArr: selectedCellArr, total: totalCellSelected }
    return res;
  }

  // check up
  checkDiagUpDirection(x, y, player) {
    let totalCellSelected = 0;
    let posX = x;
    let posY = y;
    let selectedCellObj = {};
    let selectedCellArr = [];

    //  up
    let colsNum = this.cols - 1;
    let rowsNum = this.rows - 1;
    if (y !== colsNum) {
       let minPos = Math.min((colsNum - y), x);
      posX = x - minPos;
      posY = y + minPos;
    }

    while (posX < colsNum || posY >= 0) {
      if (posX > rowsNum || posY < 0) {
        break;
      }
      let curCell = this.board[posX][posY];
      selectedCellObj = { i: posX, j: posY }
      if (totalCellSelected >= 4) {
        break;
      }
      if (curCell['color'] === player) {
        totalCellSelected++;
        selectedCellArr.push(selectedCellObj)
      } else {
        totalCellSelected = 0;
        selectedCellArr = [];
      }
      posY--;
      posX++;
    }

    let res = { selectedArr: selectedCellArr, total: totalCellSelected }
    return res;
  }

  checkWinnerInDiag(total, player, arr) {
    let res = false;
    let hasWinner = total >= 4 ? player : null;
    if (total >= 4) {
      this.markedCell(arr);
      this.setWinner(hasWinner);
      res = true;
    }
    return res;
  }

  // add propto the selected cell in the winner row
  markedCell(arr) {
    let currArr = arr.slice();
    currArr.forEach(item => {
      let { i, j } = item;
      this.board[i][j].fourInRow = true;
    });
  }

  restart = () => {
    this.init();
  }
}


