import { Cell } from './types/Cell';
export type GameViewState = Partial<{
  isRunning: boolean;
  width: number;
  height: number;
  speed: number;
}>;

export interface IGameView {
  updateGameField(field: Cell[][]): void;
  updateGameState(state: {
    width?: number;
    height?: number;
    isRunning?: boolean;
    speed?: number;
  }): void;
  updateSingleCell(x: number, y: number): void;
  onCellClick(cb: (x: number, y: number) => void): void;
  onGameStateChange(cb: (newState: boolean) => void): void;
  onFieldSizeChange(cb: (width: number, height: number) => void): void;
  onGameSpeedChange(cb: (newSpeed: number) => void): void;
  onGameStateChangeCallback(newState: boolean): void;
  onFieldSizeChangeCallback(width: number, height: number): void;
  onCellClickCallback(x: number, y: number): void;
  onGameSpeedChangeCallback(speed: number): void;
  updateGameControls(): void;
  onRunButtonClick(ev: Event): void;
  onSizeChange(): void;
  onSpeedChange(): void;
  validateNumber(value: number | undefined, min: number, max: number): number;
  el: HTMLElement;
  gameFieldEl: HTMLElement;
  gameControlsEl: HTMLElement;
  gameViewState: GameViewState;
}

export class GameView implements IGameView {
  public el: HTMLElement;
  public gameFieldEl: HTMLElement;
  public gameControlsEl: HTMLElement;
  public onGameStateChangeCallback(newState: boolean): void {}
  public onFieldSizeChangeCallback(width: number, height: number): void {}
  public onGameSpeedChangeCallback(speed: number): void {}
  public onCellClickCallback(x: number, y: number): void {}
  public gameViewState: GameViewState = {
    isRunning: false,
    width: 0,
    height: 0,
    speed: 1000,
  };

  constructor(el: HTMLElement) {
    this.el = el;
    this.gameFieldEl = document.createElement('table');
    this.gameFieldEl.setAttribute('class', 'gameField');
    this.el.appendChild(this.gameFieldEl);
    this.gameControlsEl = document.createElement('div');
    this.gameControlsEl.setAttribute('class', 'gameControls');
    this.el.appendChild(this.gameControlsEl);
    this.updateGameControls();
  }

  onCellClick(cb: (x: number, y: number) => void) {
    this.onCellClickCallback = cb;
  }
  updateSingleCell(x: number, y: number): void {
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

  updateGameField(field: Cell[][]): void {
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
  validateNumber(value: number | undefined, min: number, max: number): number {
    if (value === undefined || isNaN(value)) {
      return min;
    }
    return Math.min(Math.max(value, min), max);
  }

  updateGameControls() {
    const isRunning = Boolean(this.gameViewState.isRunning);
    const height = this.validateNumber(this.gameViewState?.height, 1, 100);
    const width = this.validateNumber(this.gameViewState?.width, 1, 100);
    const speed = this.validateNumber(this.gameViewState?.speed, 1, 10000);
    this.gameControlsEl.innerHTML = `
      <button class="run-button run-button--${
        isRunning ? 'runned' : 'stopped'
      }">${isRunning ? 'Stop' : 'Play'}</button>
      <input type="number" class="field-size field-size--width" value="${
        width
      }" /> 
      <input type="number" class="field-size field-size--height" value="${
        height
      }" />
      <input type="number" class="speed" value="${speed}">
    `;
    const runButtonEl = this.gameControlsEl.querySelector('.run-button');
    if (runButtonEl != null) {
      if (runButtonEl != null) {
        runButtonEl.removeEventListener('click', this.onRunButtonClick);
        runButtonEl.addEventListener('click', this.onRunButtonClick.bind(this));
      }
    }
    const widthEl = this.gameControlsEl.querySelector(
      '.field-size--width',
    ) as HTMLInputElement;
    const heightEl = this.gameControlsEl.querySelector(
      '.field-size--height',
    ) as HTMLInputElement;
    if (widthEl != null && heightEl != null) {
      widthEl.removeEventListener('change', this.onSizeChange);
      heightEl.removeEventListener('change', this.onSizeChange);
      widthEl.addEventListener('change', this.onSizeChange.bind(this));
      heightEl.addEventListener('change', this.onSizeChange.bind(this));
    }
    const speedEl = this.gameControlsEl.querySelector(
      '.speed',
    ) as HTMLInputElement;
    speedEl.removeEventListener('change', this.onSpeedChange);
    speedEl.addEventListener('change', this.onSpeedChange.bind(this));
  }
  onRunButtonClick(ev: Event) {
    const newState = !(ev.target as HTMLElement).matches('.run-button--runned');
    this.onGameStateChangeCallback(newState);
    this.updateGameState({ isRunning: newState });
  }
  onSpeedChange() {
    const speedEl = this.gameControlsEl.querySelector(
      '.speed',
    ) as HTMLInputElement;
    if (speedEl != null) {
      const speed = Number(speedEl.value);
      if (!isNaN(speed)) {
        this.onGameSpeedChangeCallback(speed);
      }
    }
  }

  onSizeChange() {
    const widthEl = this.gameControlsEl.querySelector(
      '.field-size--width',
    ) as HTMLInputElement;
    const heightEl = this.gameControlsEl.querySelector(
      '.field-size--height',
    ) as HTMLInputElement;
    if (widthEl != null && heightEl != null) {
      const width = Number(widthEl.value);
      const height = Number(heightEl.value);
      if (!isNaN(width) && !isNaN(height)) {
        this.onFieldSizeChangeCallback(width, height);
      }
    }
  }

  updateGameState(state: GameViewState): void {
    this.gameViewState = { ...this.gameViewState, ...state };
    this.updateGameControls();
  }

  onGameStateChange(cb: (newState: boolean) => void) {
    this.onGameStateChangeCallback = cb;
  }
  onFieldSizeChange(cb: (width: number, height: number) => void) {
    this.onFieldSizeChangeCallback = cb;
  }
  onGameSpeedChange(cb: (newSpeed: number) => void) {
    this.onGameSpeedChangeCallback = cb;
  }
}
