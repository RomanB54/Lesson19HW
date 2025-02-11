'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Game = void 0;
class Game {
  constructor(gameField, gameView, intervalTime) {
    this.gameField = gameField;
    this.gameView = gameView;
    this.field = gameField.getState();
    if (!intervalTime) {
      this.intervalTime = 1000;
    } else {
      this.intervalTime = intervalTime;
    }
    const initialState = {
      width: this.field[0].length,
      height: this.field.length,
      isRunning: false,
    };
    this.gameView.updateGameField(this.field);
    this.gameView.updateGameState(initialState);
    this.gameView.onCellClick((x, y) => {
      this.gameField.toggleCellState(x, y);
      this.field = this.gameField.getState();
      this.gameView.updateGameField(this.field);
    });
    this.gameView.onFieldSizeChange((width, height) => {
      this.gameField.setSize(width, height);
      const newField = this.gameField.getState();
      this.gameView.updateGameField(newField);
      this.gameView.updateGameState({
        width,
        height,
        isRunning: false,
      });
    });
    this.gameView.onGameStateChange((isRunning) => {
      if (isRunning) {
        this.startGame();
      } else {
        this.stopGame();
      }
    });
  }
  startGame() {
    this.gameView.updateGameState({ isRunning: true });
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.updateGame();
        if (this.checkStopConditionZero()) {
          this.stopGame();
        }
      }, this.intervalTime);
    }
  }
  stopGame() {
    this.gameView.updateGameState({ isRunning: false });
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  updateGame() {
    this.gameField.nextGeneration();
    this.field = this.gameField.getState();
    this.gameView.updateGameField(this.field);
  }
  checkStopConditionZero() {
    let count = 0;
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (this.field[i][j] !== 0) {
          count = +1;
        }
      }
    }
    return count === 0;
  }
}
exports.Game = Game;
