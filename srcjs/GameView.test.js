'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const GameView_1 = require('./GameView');
describe('GameView', () => {
  let el;
  beforeEach(() => {
    el = document.createElement('div');
  });
  describe('public interface', () => {
    it('is a class', () => {
      expect(GameView_1.GameView).toBeInstanceOf(Function);
      expect(new GameView_1.GameView(el)).toBeInstanceOf(GameView_1.GameView);
    });
    it('renders some inital markup on construction', () => {
      new GameView_1.GameView(el);
      expect(el.querySelector('.gameField')).not.toBeNull();
      expect(el.querySelector('.gameControls')).not.toBeNull();
    });
    it('has public methods', () => {
      const gameView = new GameView_1.GameView(el);
      expect(gameView.updateGameField).toBeInstanceOf(Function);
      expect(gameView.updateGameState).toBeInstanceOf(Function);
      expect(gameView.onCellClick).toBeInstanceOf(Function);
      expect(gameView.onGameStateChange).toBeInstanceOf(Function);
      expect(gameView.onFieldSizeChange).toBeInstanceOf(Function);
    });
  });
  describe('functional interface', () => {
    let gameView;
    beforeEach(() => {
      gameView = new GameView_1.GameView(el);
    });
    it('renders field from .updateGameField', () => {
      gameView.updateGameField([
        [0, 1],
        [1, 0],
      ]);
      expect(el.querySelectorAll('.cell').length).toBe(4);
      expect(el.querySelectorAll('.cell.cell--alive').length).toBe(2);
      expect(el.querySelectorAll('.cell.cell--dead').length).toBe(2);
      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);
      expect(el.querySelectorAll('.cell').length).toBe(4);
      expect(el.querySelectorAll('.cell.cell--alive').length).toBe(1);
      expect(el.querySelectorAll('.cell.cell--dead').length).toBe(3);
      gameView.updateGameField([
        [0, 0, 1],
        [1, 0, 1],
      ]);
      expect(el.querySelectorAll('.cell').length).toBe(6);
      expect(el.querySelectorAll('.cell.cell--alive').length).toBe(3);
      expect(el.querySelectorAll('.cell.cell--dead').length).toBe(3);
    });
    it('calls funciton from .onCellClick on field interaction', () => {
      var _a;
      const onCellClick = jest.fn();
      gameView.onCellClick(onCellClick);
      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);
      (_a = el.querySelector('.cell.cell--alive')) === null || _a === void 0
        ? void 0
        : _a.dispatchEvent(
            new Event('click', {
              bubbles: true,
            }),
          );
      expect(onCellClick).toHaveBeenCalledWith(0, 1);
      el.querySelectorAll('.cell.cell--dead')[1].dispatchEvent(
        new Event('click', {
          bubbles: true,
        }),
      );
      expect(onCellClick).toHaveBeenCalledWith(1, 0);
    });
    it('renders correct game state on .updateGameState', () => {
      var _a, _b, _c;
      expect(
        el.querySelector('.run-button.run-button--stopped'),
      ).not.toBeNull();
      expect(
        (_a = el.querySelector('.run-button.run-button--stopped')) === null ||
          _a === void 0
          ? void 0
          : _a.innerHTML,
      ).toBe('Play');
      gameView.updateGameState({ isRunning: true, width: 3, height: 3 });
      expect(el.querySelector('.run-button.run-button--stopped')).toBeNull();
      expect(el.querySelector('.run-button.run-button--runned')).not.toBeNull();
      expect(
        (_b = el.querySelector('.run-button.run-button--runned')) === null ||
          _b === void 0
          ? void 0
          : _b.innerHTML,
      ).toBe('Stop');
      expect(
        Number(
          el.querySelector("input[type='number'].field-size.field-size--width")
            .value,
        ),
      ).toBe(3);
      expect(
        Number(
          el.querySelector("input[type='number'].field-size.field-size--height")
            .value,
        ),
      ).toBe(3);
      gameView.updateGameState({ isRunning: false, width: 5, height: 6 });
      expect(
        el.querySelector('.run-button.run-button--stopped'),
      ).not.toBeNull();
      expect(
        (_c = el.querySelector('.run-button.run-button--stopped')) === null ||
          _c === void 0
          ? void 0
          : _c.innerHTML,
      ).toBe('Play');
      expect(
        Number(
          el.querySelector("input[type='number'].field-size.field-size--width")
            .value,
        ),
      ).toBe(5);
      expect(
        Number(
          el.querySelector("input[type='number'].field-size.field-size--height")
            .value,
        ),
      ).toBe(6);
    });
    it('calls function from .onGameStateChange on control interaction', () => {
      var _a, _b;
      const onGameStateChange = jest.fn();
      gameView.onGameStateChange(onGameStateChange);
      gameView.updateGameState({ isRunning: true, width: 2, height: 1 });
      (_a = el.querySelector('.run-button.run-button--runned')) === null ||
      _a === void 0
        ? void 0
        : _a.dispatchEvent(
            new Event('click', {
              bubbles: true,
            }),
          );
      expect(onGameStateChange).toHaveBeenCalledWith(false);
      gameView.updateGameState({ isRunning: false, width: 2, height: 1 });
      (_b = el.querySelector('.run-button.run-button--stopped')) === null ||
      _b === void 0
        ? void 0
        : _b.dispatchEvent(
            new Event('click', {
              bubbles: true,
            }),
          );
      expect(onGameStateChange).toHaveBeenCalledWith(true);
    });
    it('calls onFieldSizeChange on field size change interaction', () => {
      const onFieldSizeChange = jest.fn();
      gameView.onFieldSizeChange(onFieldSizeChange);
      [
        [33, 66],
        [22, 12],
        [1, 2],
      ].forEach(([width, height]) => {
        el.querySelector(
          "input[type='number'].field-size.field-size--width",
        ).value = `${width}`;
        el.querySelector(
          "input[type='number'].field-size.field-size--height",
        ).value = `${height}`;
        el.querySelector(
          "input[type='number'].field-size.field-size--width",
        ).dispatchEvent(
          new Event('change', {
            bubbles: true,
          }),
        );
        expect(onFieldSizeChange).toHaveBeenCalledWith(width, height);
      });
      [
        [101, 103],
        [104, 105],
        [106, 107],
      ].forEach(([width, height]) => {
        el.querySelector(
          "input[type='number'].field-size.field-size--width",
        ).value = `${width}`;
        el.querySelector(
          "input[type='number'].field-size.field-size--height",
        ).value = `${height}`;
        el.querySelector(
          "input[type='number'].field-size.field-size--height",
        ).dispatchEvent(
          new Event('change', {
            bubbles: true,
          }),
        );
        expect(onFieldSizeChange).toHaveBeenCalledWith(width, height);
      });
    });
  });
});
