'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const Game_1 = require('./Game');
const sleep = (x) => new Promise((resolve) => setTimeout(resolve, x));
describe('Game', () => {
  const stepDurationMs = 10;
  let state;
  let gameField;
  let gameView;
  let onGameStateChange = jest.fn();
  let onFieldSizeChange = jest.fn();
  let onGameSpeedChange = jest.fn();
  let onCellClick = jest.fn();
  const getGameField = () => ({
    getState: jest.fn(() => state),
    toggleCellState: jest.fn(),
    nextGeneration: jest.fn(),
    setSize: jest.fn(),
    field: state,
  });
  const getGameView = () => ({
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
    expect(Game_1.Game).toBeInstanceOf(Function);
    expect(new Game_1.Game(gameField, gameView)).toBeInstanceOf(Game_1.Game);
  });
  describe('functionality', () => {
    let game;
    beforeEach(() => {
      game = new Game_1.Game(gameField, gameView, stepDurationMs);
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
    it('is able to start/stop game with onGameStateChange', () =>
      __awaiter(void 0, void 0, void 0, function* () {
        // https://github.com/codesandbox/codesandbox-client/issues/513
        expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
        expect(gameField.getState).toHaveBeenCalledTimes(1);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
        yield sleep(stepDurationMs);
        expect(gameField.getState).toHaveBeenCalledTimes(1);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
        yield sleep(stepDurationMs);
        expect(gameField.getState).toHaveBeenCalledTimes(1);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
        expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
        onGameStateChange(true);
        yield sleep(stepDurationMs);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(1);
        expect(gameView.updateGameState).toHaveBeenCalledTimes(2);
        yield sleep(stepDurationMs);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
        expect(gameField.getState).toHaveBeenCalledTimes(3);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
        yield sleep(stepDurationMs);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
        expect(gameField.getState).toHaveBeenCalledTimes(4);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(4);
        // expect(gameView.updateGameState).toHaveBeenCalledTimes(4);
        onGameStateChange(false);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
        expect(gameView.updateGameState).toHaveBeenCalledTimes(3);
        yield sleep(stepDurationMs);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
        expect(gameView.updateGameState).toHaveBeenCalledTimes(3);
        expect(gameField.getState).toHaveBeenCalledTimes(5);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
        yield sleep(stepDurationMs);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
        // expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
        expect(gameField.getState).toHaveBeenCalledTimes(5);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
        yield sleep(stepDurationMs);
        // expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
        expect(gameField.getState).toHaveBeenCalledTimes(5);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
        onGameStateChange(true);
        yield sleep(stepDurationMs);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
        expect(gameView.updateGameState).toHaveBeenCalledTimes(4);
        expect(gameField.getState).toHaveBeenCalledTimes(6);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(6);
        yield sleep(stepDurationMs);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(5);
        expect(gameView.updateGameState).toHaveBeenCalledTimes(4);
        expect(gameField.getState).toHaveBeenCalledTimes(7);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(7);
        yield sleep(stepDurationMs);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
        expect(gameField.getState).toHaveBeenCalledTimes(8);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(8);
        expect(gameView.updateGameState).toHaveBeenCalledTimes(4);
        onGameStateChange(false);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
        expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
        yield sleep(stepDurationMs);
        expect(gameField.getState).toHaveBeenCalledTimes(9);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(9);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
        yield sleep(stepDurationMs);
        expect(gameField.getState).toHaveBeenCalledTimes(9);
        expect(gameView.updateGameField).toHaveBeenCalledTimes(9);
        expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
        expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      }));
  });
});
