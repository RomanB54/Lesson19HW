import { Game } from './Game';
import { IGameField } from './GameField';
import { IGameView } from './GameView';
import { Cell } from './types/Cell';

const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

describe('Game', () => {
  const stepDurationMs = 10;
  let state: Cell[][];
  let gameField: IGameField;
  let gameView: IGameView;
  let onGameStateChange = jest.fn();
  let onFieldSizeChange = jest.fn();
  let onGameSpeedChange = jest.fn();
  let onCellClick = jest.fn();

  const getGameField = (): IGameField => ({
    getState: jest.fn(() => state),
    toggleCellState: jest.fn(),
    nextGeneration: jest.fn(),
    setSize: jest.fn(),
    field: state,
  });

  const getGameView = (): IGameView => ({
    updateGameField: jest.fn(),
    updateSingleCell: jest.fn(),
    updateGameState: jest.fn(),
    validateNumber: jest.fn(),
    onGameSpeedChangeCallback: jest.fn(),
    onRunButtonClick: jest.fn(),
    onSizeChange: jest.fn(),
    onSpeedChange: jest.fn(),
    onCellClick: jest.fn((cb) => {
      onCellClick = jest.fn(cb);
    }),
    onGameStateChange: jest.fn((cb) => {
      onGameStateChange = jest.fn(cb);
    }),
    onGameSpeedChange: jest.fn((cb) => {
      onGameSpeedChange = jest.fn(cb);
    }),
    onFieldSizeChange: jest.fn((cb) => {
      onFieldSizeChange = jest.fn(cb);
    }),
    updateGameControls: jest.fn(),
    onGameStateChangeCallback: jest.fn(),
    onFieldSizeChangeCallback: jest.fn(),
    onCellClickCallback: jest.fn(),
    el: document.createElement('div'),
    gameFieldEl: document.createElement('table'),
    gameControlsEl: document.createElement('div'),
    gameViewState: new Object(),
  });

  beforeEach(() => {
    state = [
      [Math.random(), Math.random()],
      [Math.random(), Math.random()],
      [Math.random(), Math.random()],
    ];
    gameView = getGameView();
    gameField = getGameField();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is a class', () => {
    expect(Game).toBeInstanceOf(Function);
    expect(new Game(gameField, gameView)).toBeInstanceOf(Game);
  });

  describe('functionality', () => {
    let game: Game;
    beforeEach(() => {
      game = new Game(gameField, gameView, stepDurationMs);
    });

    it('renders initial state on instantiating', () => {
      expect(gameField.getState).toHaveBeenCalled();
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
      expect(gameView.updateGameState).toHaveBeenCalledWith({
        isRunning: false,
        width: state[0].length,
        height: state.length,
        speed: stepDurationMs,
      });
    });

    it('calls field.toggleCellState on view.onCellClick and renders with updated state', () => {
      state = [[1, 2, 3]];
      onCellClick(0, 1);
      expect(gameField.toggleCellState).toHaveBeenCalledWith(0, 1);
      expect(gameView.updateSingleCell).toHaveBeenCalledWith(0, 1);
    });

    it('calls field.setSize on view.onFieldSizeChange and renders with updated state', () => {
      state = [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ];
      const width = state[0].length;
      const height = state.length;
      onFieldSizeChange(width, height);
      expect(gameField.setSize).toHaveBeenCalledWith(width, height);
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
      expect(gameView.updateGameState).toHaveBeenCalledWith(
        expect.objectContaining({
          width,
          height,
        }),
      );
    });

    it('is able to start/stop game with onGameStateChange', async () => {
      // https://github.com/codesandbox/codesandbox-client/issues/513
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      await sleep(stepDurationMs);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      await sleep(stepDurationMs);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);

      onGameStateChange(true);
      await sleep(stepDurationMs);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameField.getState).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameField.getState).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(4);
      // expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      onGameStateChange(false);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);
      expect(gameField.getState).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      // expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
      expect(gameField.getState).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      await sleep(stepDurationMs);
      // expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
      expect(gameField.getState).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);

      onGameStateChange(true);
      await sleep(stepDurationMs);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);
      expect(gameField.getState).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(6);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);
      expect(gameField.getState).toHaveBeenCalledTimes(7);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(7);
      await sleep(stepDurationMs);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameField.getState).toHaveBeenCalledTimes(8);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(8);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      onGameStateChange(false);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
      await sleep(stepDurationMs);
      expect(gameField.getState).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(9);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      await sleep(stepDurationMs);
      expect(gameField.getState).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
    });
  });
});
