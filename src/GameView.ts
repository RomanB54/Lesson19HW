import { Cell } from "./types/Cell";

export interface IGameView {
  updateGameField(field: Cell[][]):void;
  updateGameState(state: {
    width?: number;
    height?: number;
    isRunning?: boolean;
  }) : void;
  onCellClick(cb: (x: number, y: number) => void):void;
  onGameStateChange(cb: (newState: boolean) => void):void;
  onFieldSizeChange(cb: (width: number, height: number) => void):void;
}

export class GameView implements IGameView {
  private el: HTMLElement;
  private gameField: HTMLElement;
  private gameControls: HTMLElement;
  private onCellClickCallback (x: number, y: number):void {
    
  }
  
  constructor (el : HTMLElement) {
    this.el = el;
    this.gameField = document.createElement('table');
    this.gameField.setAttribute("class", "gameField");
    this.el.appendChild(this.gameField);
    this.gameControls = document.createElement('div');
    this.gameControls.setAttribute("class", "gameControls");
    this.el.appendChild(this.gameControls);
  }

  onCellClick(cb: (x: number, y: number) => void) {
    this.onCellClickCallback = cb;
  };

  updateGameField(field: Cell[][]):void {
    this.gameField.innerHTML = '';
    field.forEach((row,y) => {
      const trElement = document.createElement('tr');
      this.gameField.appendChild(trElement);
      row.forEach((cell,x) => {
        const cellElement = document.createElement('td');
        cellElement.classList.add('cell');
        if (cell === 1) {
          cellElement.classList.add('cell--alive');
        } else { 
          cellElement.classList.add('cell--dead');
        }
        cellElement.addEventListener('click', () => {this.onCellClickCallback(x,y)})
        trElement.appendChild(cellElement);
      })
    })
  };
  updateGameState(state: {
    width?: number;
    height?: number;
    isRunning?: boolean;
  }) : void {};

  onGameStateChange(cb: (newState: boolean) => void){
    this.onGameStateChangeCallback = cb;
  };
  onFieldSizeChange(cb: (width: number, height: number) => void){
     this.onFieldSizeChangeCallback = cb;
  };
}