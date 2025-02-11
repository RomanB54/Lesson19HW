import { Cell } from './types/Cell';
export type GameViewState = Partial<{
  isRunning: boolean;
  width: number;
  height: number;
}>;

export interface IGameView {
  updateGameField(field: Cell[][]): void;
  updateGameState(state: {
    width?: number;
    height?: number;
    isRunning?: boolean;
  }): void;
  onCellClick(cb: (x: number, y: number) => void): void;
  onGameStateChange(cb: (newState: boolean) => void): void;
  onFieldSizeChange(cb: (width: number, height: number) => void): void;
  onGameStateChangeCallback: (newState: boolean) => void;
  onFieldSizeChangeCallback: (width: number, height: number) => void;
  onCellClickCallback(x: number, y: number): void;
  updateGameControls(): void;
  el: HTMLElement;
  gameFieldEl: HTMLElement;
  gameControlsEl: HTMLElement;
  gameViewState: GameViewState;
}

export class GameView implements IGameView {
  public el: HTMLElement;
  public gameFieldEl: HTMLElement;
  public gameControlsEl: HTMLElement;
  public onGameStateChangeCallback: (newState: boolean) => void = () => {};
  public onFieldSizeChangeCallback: (width: number, height: number) => void =
    () => {};
  public onCellClickCallback(x: number, y: number): void {}
  public gameViewState: GameViewState = {};

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

  updateGameField(field: Cell[][]): void {
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
    const isRunning = Boolean(this.gameViewState?.isRunning);
    this.gameControlsEl.innerHTML = `
      <button class="run-button run-button--${
        isRunning ? 'runned' : 'stopped'
      }">${isRunning ? 'Stop' : 'Play'}</button>
      <input type="number" class="field-size field-size--width" value="${
        this.gameViewState?.width ?? 0
      }" /> 
      <input type="number" class="field-size field-size--height" value="${
        this.gameViewState?.height ?? 0
      }" />
    `;
    const runButtonEl = this.gameControlsEl.querySelector('.run-button');
    if (runButtonEl != null) {
      runButtonEl.addEventListener('click', (ev) => {
        this.onGameStateChangeCallback(
          !(ev.target as HTMLElement).matches('.run-button--runned'),
        );
      });
    }
    const widthEl = this.gameControlsEl.querySelector(
      '.field-size--width',
    ) as HTMLInputElement;
    const heightEl = this.gameControlsEl.querySelector(
      '.field-size--height',
    ) as HTMLInputElement;
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

  updateGameState(state: GameViewState): void {
    this.gameViewState = state;
    this.updateGameControls();
  }

  onGameStateChange(cb: (newState: boolean) => void) {
    this.onGameStateChangeCallback = cb;
  }
  onFieldSizeChange(cb: (width: number, height: number) => void) {
    this.onFieldSizeChangeCallback = cb;
  }
}
