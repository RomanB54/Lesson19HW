'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Game = void 0;
class Game {
  constructor(gameField, gameView, intervalTime) {
    this.intervalId = null;
    this.isRunning = false;
    this.gameField = gameField;
    this.gameView = gameView;
    this.field = gameField.getState();
    if (!intervalTime) {
      this.intervalTime = 1000;
    } else {
      this.intervalTime = intervalTime;
    }
    this.width = this.field[0].length;
    this.height = this.field.length;
    gameView.updateGameField(this.field);
    gameView.updateGameState({
      width: this.width,
      height: this.height,
      speed: this.intervalTime,
      isRunning: false,
    });
    gameView.onCellClick((x, y) => {
      gameField.toggleCellState(x, y);
      this.field = gameField.getState();
      gameView.updateSingleCell(x, y);
    });
    gameView.onFieldSizeChange((widthX, heightY) => {
      gameField.setSize(widthX, heightY);
      const newField = gameField.getState();
      this.width = newField[0].length;
      this.height = newField.length;
      gameView.updateGameField(newField);
      gameView.updateGameState({
        width: this.width,
        height: this.height,
        speed: this.intervalTime,
        isRunning: this.isRunning,
      });
    });
    gameView.onGameSpeedChange((newSpeed) => {
      this.intervalTime = newSpeed;
      gameView.updateGameState({
        width: this.width,
        height: this.height,
        speed: this.intervalTime,
        isRunning: this.isRunning,
      });
    });
    gameView.onGameStateChange((isRunning) => {
      if (isRunning) {
        gameView.updateGameState({
          isRunning: true,
          width: this.width,
          height: this.height,
        });
        this.startGame();
        this.isRunning = true;
      } else {
        gameView.updateGameState({
          isRunning: false,
          width: this.width,
          height: this.height,
        });
        this.stopGame();
        this.isRunning = false;
      }
    });
  }
  startGame() {
    this.stopGame();
    this.intervalId = setInterval(() => {
      this.updateGame();
    }, this.intervalTime);
  }
  stopGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.field = this.gameField.getState();
      this.gameView.updateGameField(this.field);
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
          count += 1;
        }
      }
    }
    return count === 0;
  }
}
exports.Game = Game;
