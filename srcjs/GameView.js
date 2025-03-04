'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GameView = void 0;
class GameView {
  onGameStateChangeCallback(newState) {}
  onFieldSizeChangeCallback(width, height) {}
  onGameSpeedChangeCallback(speed) {}
  onCellClickCallback(x, y) {}
  constructor(el) {
    this.gameViewState = {
      isRunning: false,
      width: 0,
      height: 0,
      speed: 1000,
    };
    this.el = el;
    this.gameFieldEl = document.createElement('table');
    this.gameFieldEl.setAttribute('class', 'gameField');
    this.el.appendChild(this.gameFieldEl);
    this.gameControlsEl = document.createElement('div');
    this.gameControlsEl.setAttribute('class', 'gameControls');
    this.el.appendChild(this.gameControlsEl);
    this.updateGameControls();
  }
  onCellClick(cb) {
    this.onCellClickCallback = cb;
  }
  updateSingleCell(x, y) {
    const cellElement = this.gameFieldEl.querySelector(`.pos--${y}--${x}`);
    if (cellElement) {
      if (cellElement.classList.contains('cell--dead')) {
        cellElement.classList.remove('cell--dead');
        cellElement.classList.add('cell--alive');
      } else {
        cellElement.classList.remove('cell--alive');
        cellElement.classList.add('cell--dead');
      }
    }
  }
  updateGameField(field) {
    this.gameFieldEl.innerHTML = '';
    field.forEach((row, y) => {
      const trElement = document.createElement('tr');
      trElement.classList.add(`row${y}`);
      this.gameFieldEl.appendChild(trElement);
      row.forEach((cell, x) => {
        const cellElement = document.createElement('td');
        cellElement.classList.add('cell');
        cellElement.classList.add(`pos--${y}--${x}`);
        if (cell === 1) {
          cellElement.classList.add('cell--alive');
        } else {
          cellElement.classList.add('cell--dead');
        }
        cellElement.addEventListener('click', () => {
          this.onCellClickCallback(x, y);
        });
        trElement.appendChild(cellElement);
      });
    });
  }
  validateNumber(value, min, max) {
    if (value === undefined || isNaN(value)) {
      return min;
    }
    return Math.min(Math.max(value, min), max);
  }
  updateGameControls() {
    var _a, _b, _c;
    const isRunning = Boolean(this.gameViewState.isRunning);
    const height = this.validateNumber(
      (_a = this.gameViewState) === null || _a === void 0 ? void 0 : _a.height,
      1,
      100,
    );
    const width = this.validateNumber(
      (_b = this.gameViewState) === null || _b === void 0 ? void 0 : _b.width,
      1,
      100,
    );
    const speed = this.validateNumber(
      (_c = this.gameViewState) === null || _c === void 0 ? void 0 : _c.speed,
      1,
      10000,
    );
    this.gameControlsEl.innerHTML = `
      <button class="run-button run-button--${isRunning ? 'runned' : 'stopped'}">${isRunning ? 'Stop' : 'Play'}</button>
      <input type="number" class="field-size field-size--width" value="${width}" /> 
      <input type="number" class="field-size field-size--height" value="${height}" />
      <input type="number" class="speed" value="${speed}">
    `;
    const runButtonEl = this.gameControlsEl.querySelector('.run-button');
    if (runButtonEl != null) {
      if (runButtonEl != null) {
        runButtonEl.removeEventListener('click', this.onRunButtonClick);
        runButtonEl.addEventListener('click', this.onRunButtonClick.bind(this));
      }
    }
    const widthEl = this.gameControlsEl.querySelector('.field-size--width');
    const heightEl = this.gameControlsEl.querySelector('.field-size--height');
    if (widthEl != null && heightEl != null) {
      widthEl.removeEventListener('change', this.onSizeChange);
      heightEl.removeEventListener('change', this.onSizeChange);
      widthEl.addEventListener('change', this.onSizeChange.bind(this));
      heightEl.addEventListener('change', this.onSizeChange.bind(this));
    }
    const speedEl = this.gameControlsEl.querySelector('.speed');
    speedEl.removeEventListener('change', this.onSpeedChange);
    speedEl.addEventListener('change', this.onSpeedChange.bind(this));
  }
  onRunButtonClick(ev) {
    const newState = !ev.target.matches('.run-button--runned');
    this.onGameStateChangeCallback(newState);
    this.updateGameState({ isRunning: newState });
  }
  onSpeedChange() {
    const speedEl = this.gameControlsEl.querySelector('.speed');
    if (speedEl != null) {
      const speed = Number(speedEl.value);
      if (!isNaN(speed)) {
        this.onGameSpeedChangeCallback(speed);
      }
    }
  }
  onSizeChange() {
    const widthEl = this.gameControlsEl.querySelector('.field-size--width');
    const heightEl = this.gameControlsEl.querySelector('.field-size--height');
    if (widthEl != null && heightEl != null) {
      const width = Number(widthEl.value);
      const height = Number(heightEl.value);
      if (!isNaN(width) && !isNaN(height)) {
        this.onFieldSizeChangeCallback(width, height);
      }
    }
  }
  updateGameState(state) {
    this.gameViewState = Object.assign(
      Object.assign({}, this.gameViewState),
      state,
    );
    this.updateGameControls();
  }
  onGameStateChange(cb) {
    this.onGameStateChangeCallback = cb;
  }
  onFieldSizeChange(cb) {
    this.onFieldSizeChangeCallback = cb;
  }
  onGameSpeedChange(cb) {
    this.onGameSpeedChangeCallback = cb;
  }
}
exports.GameView = GameView;
