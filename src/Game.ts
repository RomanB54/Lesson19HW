import { GameField, IGameField } from './GameField';
import { GameView, IGameView } from './GameView';
import { Cell } from './types/Cell';

export interface IGame {
  startGame(): void;
  stopGame(): void;
  updateGame(): void;
  checkStopConditionZero(arg: number[][]): boolean;
}
export class Game implements IGame {
  private gameField: GameField;
  private gameView: GameView;
  private field: Cell[][];
  private intervalId?: NodeJS.Timeout | null = null;
  private intervalTime: number;
  private isRunning: boolean = false;
  private width: number;
  private height: number;

  constructor(
    gameField: IGameField,
    gameView: IGameView,
    intervalTime?: number,
  ) {
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

    gameView.onCellClick((x: number, y: number) => {
      gameField.toggleCellState(x, y);
      this.field = gameField.getState();
      gameView.updateSingleCell(x, y);
    });
    gameView.onFieldSizeChange((widthX: number, heightY: number) => {
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
    gameView.onGameSpeedChange((newSpeed: number) => {
      this.intervalTime = newSpeed;
      gameView.updateGameState({
        width: this.width,
        height: this.height,
        speed: this.intervalTime,
        isRunning: this.isRunning,
      });
    });

    gameView.onGameStateChange((isRunning: boolean) => {
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
    let count: number = 0;
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
