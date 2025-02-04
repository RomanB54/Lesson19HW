import { GameField, IGameField } from "./GameField";
import { GameView, IGameView } from "./GameView";
import { Cell } from "./types/Cell";

export interface IGame {
    
}

export class Game implements IGame {

    constructor(GameField: IGameField, GameView : IGameView, stepDurationMs? : number) {
        let state = GameField.getState()
        GameView.updateGameField(state);
       
        }
}