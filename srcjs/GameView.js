'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GameView = void 0;
class GameView {
  onCellClickCallback(x, y) {}
  constructor(el) {
    this.onGameStateChangeCallback = () => {};
    this.onFieldSizeChangeCallback = () => {};
    this.gameViewState = {};
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
  updateGameField(field) {
    this.gameFieldEl.innerHTML = '';
    field.forEach((row, y) => {
      const trElement = document.createElement('tr');
      this.gameFieldEl.appendChild(trElement);
      row.forEach((cell, x) => {
        const cellElement = document.createElement('td');
        cellElement.classList.add('cell');
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
  updateGameControls() {
    var _a, _b, _c, _d, _e;
    const isRunning = Boolean(
      (_a = this.gameViewState) === null || _a === void 0
        ? void 0
        : _a.isRunning,
    );
    this.gameControlsEl.innerHTML = `
      <button class="run-button run-button--${isRunning ? 'runned' : 'stopped'}">${isRunning ? 'Stop' : 'Play'}</button>
      <input type="number" class="field-size field-size--width" value="${(_c = (_b = this.gameViewState) === null || _b === void 0 ? void 0 : _b.width) !== null && _c !== void 0 ? _c : 0}" /> 
      <input type="number" class="field-size field-size--height" value="${(_e = (_d = this.gameViewState) === null || _d === void 0 ? void 0 : _d.height) !== null && _e !== void 0 ? _e : 0}" />
    `;
    const runButtonEl = this.gameControlsEl.querySelector('.run-button');
    if (runButtonEl != null) {
      runButtonEl.addEventListener('click', (ev) => {
        this.onGameStateChangeCallback(
          !ev.target.matches('.run-button--runned'),
        );
      });
    }
    const widthEl = this.gameControlsEl.querySelector('.field-size--width');
    const heightEl = this.gameControlsEl.querySelector('.field-size--height');
    if (widthEl != null && heightEl != null) {
      const onSizeChange = () => {
        this.onFieldSizeChangeCallback(
          Number(widthEl.value),
          Number(heightEl.value),
        );
      };
      widthEl.addEventListener('change', onSizeChange);
      heightEl.addEventListener('change', onSizeChange);
    }
  }
  updateGameState(state) {
    this.gameViewState = state;
    this.updateGameControls();
  }
  onGameStateChange(cb) {
    this.onGameStateChangeCallback = cb;
  }
  onFieldSizeChange(cb) {
    this.onFieldSizeChangeCallback = cb;
  }
}
exports.GameView = GameView;
