'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GameField = void 0;
class GameField {
  constructor(width = 0, height = 1) {
    //Construct field
    const arr = [];
    for (let i = 0; i < height; i++) {
      arr.push([]);
      for (let j = 0; j < width; j++) {
        arr[i].push(0);
      }
    }
    this.field = arr;
  }
  getState() {
    return this.field;
  }
  toggleCellState(x, y) {
    this.field[y][x] = this.field[y][x] === 0 ? 1 : 0;
  }
  nextGeneration() {
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ];
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[0].length; j++) {
        let neighbors = 0;
        for (const [dx, dy] of directions) {
          const x = i + dx;
          const y = j + dy;
          if (
            x >= 0 &&
            x < this.field.length &&
            y >= 0 &&
            y < this.field[0].length &&
            (this.field[x][y] === 1 || this.field[x][y] === 10)
          ) {
            neighbors++;
          }
        }
        if (this.field[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
          this.field[i][j] = 10;
        }
        if (this.field[i][j] === 0 && neighbors === 3) {
          this.field[i][j] = 11;
        }
      }
    }
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[0].length; j++) {
        if (this.field[i][j] == 11) {
          this.field[i][j] = 1;
        }
        if (this.field[i][j] == 10) {
          this.field[i][j] = 0;
        }
      }
    }
  }
  setSize(width, height) {
    const arrayCopy = this.field.map((element) => element);
    const oldWidth = this.field[0].length;
    const oldHeight = this.field.length;
    if (oldHeight < height) {
      for (let i = oldHeight; i < height; i++) {
        arrayCopy.push([]);
        for (let j = arrayCopy[i].length; j < arrayCopy[0].length; j++) {
          arrayCopy[i].push(0);
        }
      }
    }
    if (oldWidth < width) {
      for (let i = 0; i < height; i++) {
        for (let j = oldWidth; j < width; j++) {
          arrayCopy[i].push(0);
        }
      }
    }
    if (oldHeight > height) {
      for (let i = 0; i < oldHeight - height; i++) {
        arrayCopy.pop();
      }
    }
    if (oldWidth > width) {
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < oldWidth - width; j++) {
          arrayCopy[i].pop();
        }
      }
    }
    this.field = arrayCopy;
  }
}
exports.GameField = GameField;
