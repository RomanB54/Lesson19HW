import { GameView } from './GameView';

describe('GameView', () => {
  let el: HTMLElement;
  beforeEach(() => {
    el = document.createElement('div');
  });
  describe('public interface', () => {
    it('is a class', () => {
      expect(GameView).toBeInstanceOf(Function);
      expect(new GameView(el)).toBeInstanceOf(GameView);
    });

    it('renders some inital markup on construction', () => {
      new GameView(el);
      expect(el.querySelector('.gameField')).not.toBeNull();
      expect(el.querySelector('.gameControls')).not.toBeNull();
    });

    it('has public methods', () => {
      const gameView = new GameView(el);
      expect(gameView.updateGameField).toBeInstanceOf(Function);
      expect(gameView.updateGameState).toBeInstanceOf(Function);
      expect(gameView.updateSingleCell).toBeInstanceOf(Function);
      expect(gameView.onCellClick).toBeInstanceOf(Function);
      expect(gameView.onGameStateChange).toBeInstanceOf(Function);
      expect(gameView.onFieldSizeChange).toBeInstanceOf(Function);
      expect(gameView.onGameSpeedChange).toBeInstanceOf(Function);
    });
  });

  describe('functional interface', () => {
    let gameView: GameView;
    beforeEach(() => {
      gameView = new GameView(el);
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
    it('update cell state from .updateSingleCell', () => {
      gameView.updateGameField([
        [0, 1],
        [1, 0],
      ]);
      gameView.updateSingleCell(0, 0);
      expect(el.querySelectorAll('.cell').length).toBe(4);
      expect(el.querySelectorAll('.cell.cell--alive').length).toBe(3);
      expect(el.querySelectorAll('.cell.cell--dead').length).toBe(1);

      gameView.updateSingleCell(0, 1);
      expect(el.querySelectorAll('.cell').length).toBe(4);
      expect(el.querySelectorAll('.cell.cell--alive').length).toBe(2);
      expect(el.querySelectorAll('.cell.cell--dead').length).toBe(2);
    });

    it('calls function from .onCellClick on field interaction', () => {
      const onCellClick = jest.fn();
      gameView.onCellClick(onCellClick);
      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);
      el.querySelector('.cell.cell--alive')?.dispatchEvent(
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
      expect(
        el.querySelector('.run-button.run-button--stopped'),
      ).not.toBeNull();
      expect(
        el.querySelector('.run-button.run-button--stopped')?.innerHTML,
      ).toBe('Play');
      gameView.updateGameState({
        isRunning: true,
        width: 3,
        height: 3,
        speed: 2000,
      });
      expect(el.querySelector('.run-button.run-button--stopped')).toBeNull();
      expect(el.querySelector('.run-button.run-button--runned')).not.toBeNull();
      expect(
        el.querySelector('.run-button.run-button--runned')?.innerHTML,
      ).toBe('Stop');
      expect(
        Number(
          (
            el.querySelector(
              "input[type='number'].field-size.field-size--width",
            ) as HTMLInputElement
          ).value,
        ),
      ).toBe(3);
      expect(
        Number(
          (
            el.querySelector(
              "input[type='number'].field-size.field-size--height",
            ) as HTMLInputElement
          ).value,
        ),
      ).toBe(3);
      expect(
        Number(
          (el.querySelector("input[type='number'].speed") as HTMLInputElement)
            .value,
        ),
      ).toBe(2000);
      gameView.updateGameState({
        isRunning: false,
        width: 5,
        height: 6,
        speed: 12000,
      });
      expect(
        el.querySelector('.run-button.run-button--stopped'),
      ).not.toBeNull();
      expect(
        el.querySelector('.run-button.run-button--stopped')?.innerHTML,
      ).toBe('Play');
      expect(
        Number(
          (
            el.querySelector(
              "input[type='number'].field-size.field-size--width",
            ) as HTMLInputElement
          ).value,
        ),
      ).toBe(5);
      expect(
        Number(
          (
            el.querySelector(
              "input[type='number'].field-size.field-size--height",
            ) as HTMLInputElement
          ).value,
        ),
      ).toBe(6);
      expect(
        Number(
          (el.querySelector("input[type='number'].speed") as HTMLInputElement)
            .value,
        ),
      ).toBe(10000);
    });
    it('calls function from .onGameStateChange on control interaction', () => {
      const onGameStateChange = jest.fn();
      gameView.onGameStateChange(onGameStateChange);
      gameView.updateGameState({ isRunning: true, width: 2, height: 1 });
      el.querySelector('.run-button.run-button--runned')?.dispatchEvent(
        new Event('click', {
          bubbles: true,
        }),
      );
      expect(onGameStateChange).toHaveBeenCalledWith(false);
      gameView.updateGameState({ isRunning: false, width: 2, height: 1 });
      el.querySelector('.run-button.run-button--stopped')?.dispatchEvent(
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
        (
          el.querySelector(
            "input[type='number'].field-size.field-size--width",
          ) as HTMLInputElement
        ).value = `${width}`;
        (
          el.querySelector(
            "input[type='number'].field-size.field-size--height",
          ) as HTMLInputElement
        ).value = `${height}`;
        (
          el.querySelector(
            "input[type='number'].field-size.field-size--width",
          ) as HTMLInputElement
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
        (
          el.querySelector(
            "input[type='number'].field-size.field-size--width",
          ) as HTMLInputElement
        ).value = `${width}`;
        (
          el.querySelector(
            "input[type='number'].field-size.field-size--height",
          ) as HTMLInputElement
        ).value = `${height}`;
        (
          el.querySelector(
            "input[type='number'].field-size.field-size--height",
          ) as HTMLInputElement
        ).dispatchEvent(
          new Event('change', {
            bubbles: true,
          }),
        );
        expect(onFieldSizeChange).toHaveBeenCalledWith(width, height);
      });
    });
    it('check function to validate number for main parameters', () => {
      const temp = gameView.validateNumber(12000, 1, 10000);
      const temp2 = gameView.validateNumber(10, 20, 1000);
      const temp3 = gameView.validateNumber(undefined, 30, 1000);
      expect(temp).toBe(10000);
      expect(temp2).toBe(20);
      expect(temp3).toBe(30);
    });

    it('calls onGameSpeedChange on speed change interaction', () => {
      const onGameSpeedChange = jest.fn();
      gameView.onGameSpeedChange(onGameSpeedChange);

      [[1000], [2000], [3000]].forEach(([speed]) => {
        (
          el.querySelector("input[type='number'].speed") as HTMLInputElement
        ).value = `${speed}`;
        (
          el.querySelector("input[type='number'].speed") as HTMLInputElement
        ).dispatchEvent(
          new Event('change', {
            bubbles: true,
          }),
        );
        expect(onGameSpeedChange).toHaveBeenCalledWith(speed);
      });

      [[4000], [5000], [6000]].forEach(([speed]) => {
        (
          el.querySelector("input[type='number'].speed") as HTMLInputElement
        ).value = `${speed}`;
        (
          el.querySelector("input[type='number'].speed") as HTMLInputElement
        ).dispatchEvent(
          new Event('change', {
            bubbles: true,
          }),
        );
        expect(onGameSpeedChange).toHaveBeenCalledWith(speed);
      });
    });
  });
});
