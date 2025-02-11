/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./srcjs/styles.css":
/*!**************************!*\
  !*** ./srcjs/styles.css ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://lesson-19-homework/./srcjs/styles.css?");

/***/ }),

/***/ "./srcjs/Game.js":
/*!***********************!*\
  !*** ./srcjs/Game.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Game = void 0;\nclass Game {\n  constructor(gameField, gameView, intervalTime) {\n    this.gameField = gameField;\n    this.gameView = gameView;\n    this.field = gameField.getState();\n    if (!intervalTime) {\n      this.intervalTime = 1000;\n    } else {\n      this.intervalTime = intervalTime;\n    }\n    const initialState = {\n      width: this.field[0].length,\n      height: this.field.length,\n      isRunning: false,\n    };\n    this.gameView.updateGameField(this.field);\n    this.gameView.updateGameState(initialState);\n    this.gameView.onCellClick((x, y) => {\n      this.gameField.toggleCellState(x, y);\n      this.field = this.gameField.getState();\n      this.gameView.updateGameField(this.field);\n    });\n    this.gameView.onFieldSizeChange((width, height) => {\n      this.gameField.setSize(width, height);\n      const newField = this.gameField.getState();\n      this.gameView.updateGameField(newField);\n      this.gameView.updateGameState({\n        width,\n        height,\n        isRunning: false,\n      });\n    });\n    this.gameView.onGameStateChange((isRunning) => {\n      if (isRunning) {\n        this.startGame();\n      } else {\n        this.stopGame();\n      }\n    });\n  }\n  startGame() {\n    this.gameView.updateGameState({ isRunning: true });\n    if (!this.intervalId) {\n      this.intervalId = setInterval(() => {\n        this.updateGame();\n        if (this.checkStopConditionZero()) {\n          this.stopGame();\n        }\n      }, this.intervalTime);\n    }\n  }\n  stopGame() {\n    this.gameView.updateGameState({ isRunning: false });\n    if (this.intervalId) {\n      clearInterval(this.intervalId);\n    }\n  }\n  updateGame() {\n    this.gameField.nextGeneration();\n    this.field = this.gameField.getState();\n    this.gameView.updateGameField(this.field);\n  }\n  checkStopConditionZero() {\n    let count = 0;\n    for (let i = 0; i < this.field.length; i++) {\n      for (let j = 0; j < this.field[i].length; j++) {\n        if (this.field[i][j] !== 0) {\n          count = +1;\n        }\n      }\n    }\n    return count === 0;\n  }\n}\nexports.Game = Game;\n\n\n//# sourceURL=webpack://lesson-19-homework/./srcjs/Game.js?");

/***/ }),

/***/ "./srcjs/GameField.js":
/*!****************************!*\
  !*** ./srcjs/GameField.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.GameField = void 0;\nclass GameField {\n  constructor(width = 0, height = 1) {\n    //Construct field\n    const arr = [];\n    for (let i = 0; i < height; i++) {\n      arr.push([]);\n      for (let j = 0; j < width; j++) {\n        arr[i].push(0);\n      }\n    }\n    this.field = arr;\n  }\n  getState() {\n    return this.field;\n  }\n  toggleCellState(x, y) {\n    this.field[y][x] = this.field[y][x] === 0 ? 1 : 0;\n  }\n  nextGeneration() {\n    const directions = [\n      [0, 1],\n      [1, 0],\n      [0, -1],\n      [-1, 0],\n      [1, 1],\n      [-1, -1],\n      [1, -1],\n      [-1, 1],\n    ];\n    for (let i = 0; i < this.field.length; i++) {\n      for (let j = 0; j < this.field[0].length; j++) {\n        let neighbors = 0;\n        for (const [dx, dy] of directions) {\n          const x = i + dx;\n          const y = j + dy;\n          if (\n            x >= 0 &&\n            x < this.field.length &&\n            y >= 0 &&\n            y < this.field[0].length &&\n            (this.field[x][y] === 1 || this.field[x][y] === 10)\n          ) {\n            neighbors++;\n          }\n        }\n        if (this.field[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {\n          this.field[i][j] = 10;\n        }\n        if (this.field[i][j] === 0 && neighbors === 3) {\n          this.field[i][j] = 11;\n        }\n      }\n    }\n    for (let i = 0; i < this.field.length; i++) {\n      for (let j = 0; j < this.field[0].length; j++) {\n        if (this.field[i][j] == 11) {\n          this.field[i][j] = 1;\n        }\n        if (this.field[i][j] == 10) {\n          this.field[i][j] = 0;\n        }\n      }\n    }\n  }\n  setSize(width, height) {\n    const arrayCopy = this.field.map((element) => element);\n    const oldWidth = this.field[0].length;\n    const oldHeight = this.field.length;\n    if (oldHeight < height) {\n      for (let i = oldHeight; i < height; i++) {\n        arrayCopy.push([]);\n        for (let j = arrayCopy[i].length; j < arrayCopy[0].length; j++) {\n          arrayCopy[i].push(0);\n        }\n      }\n    }\n    if (oldWidth < width) {\n      for (let i = 0; i < height; i++) {\n        for (let j = oldWidth; j < width; j++) {\n          arrayCopy[i].push(0);\n        }\n      }\n    }\n    if (oldHeight > height) {\n      for (let i = 0; i < oldHeight - height; i++) {\n        arrayCopy.pop();\n      }\n    }\n    if (oldWidth > width) {\n      for (let i = 0; i < height; i++) {\n        for (let j = 0; j < oldWidth - width; j++) {\n          arrayCopy[i].pop();\n        }\n      }\n    }\n    this.field = arrayCopy;\n  }\n}\nexports.GameField = GameField;\n\n\n//# sourceURL=webpack://lesson-19-homework/./srcjs/GameField.js?");

/***/ }),

/***/ "./srcjs/GameView.js":
/*!***************************!*\
  !*** ./srcjs/GameView.js ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.GameView = void 0;\nclass GameView {\n  onCellClickCallback(x, y) {}\n  constructor(el) {\n    this.onGameStateChangeCallback = () => {};\n    this.onFieldSizeChangeCallback = () => {};\n    this.gameViewState = {};\n    this.el = el;\n    this.gameFieldEl = document.createElement('table');\n    this.gameFieldEl.setAttribute('class', 'gameField');\n    this.el.appendChild(this.gameFieldEl);\n    this.gameControlsEl = document.createElement('div');\n    this.gameControlsEl.setAttribute('class', 'gameControls');\n    this.el.appendChild(this.gameControlsEl);\n    this.updateGameControls();\n  }\n  onCellClick(cb) {\n    this.onCellClickCallback = cb;\n  }\n  updateGameField(field) {\n    this.gameFieldEl.innerHTML = '';\n    field.forEach((row, y) => {\n      const trElement = document.createElement('tr');\n      this.gameFieldEl.appendChild(trElement);\n      row.forEach((cell, x) => {\n        const cellElement = document.createElement('td');\n        cellElement.classList.add('cell');\n        if (cell === 1) {\n          cellElement.classList.add('cell--alive');\n        } else {\n          cellElement.classList.add('cell--dead');\n        }\n        cellElement.addEventListener('click', () => {\n          this.onCellClickCallback(x, y);\n        });\n        trElement.appendChild(cellElement);\n      });\n    });\n  }\n  updateGameControls() {\n    var _a, _b, _c, _d, _e;\n    const isRunning = Boolean(\n      (_a = this.gameViewState) === null || _a === void 0\n        ? void 0\n        : _a.isRunning,\n    );\n    this.gameControlsEl.innerHTML = `\n      <button class=\"run-button run-button--${isRunning ? 'runned' : 'stopped'}\">${isRunning ? 'Stop' : 'Play'}</button>\n      <input type=\"number\" class=\"field-size field-size--width\" value=\"${(_c = (_b = this.gameViewState) === null || _b === void 0 ? void 0 : _b.width) !== null && _c !== void 0 ? _c : 0}\" /> \n      <input type=\"number\" class=\"field-size field-size--height\" value=\"${(_e = (_d = this.gameViewState) === null || _d === void 0 ? void 0 : _d.height) !== null && _e !== void 0 ? _e : 0}\" />\n    `;\n    const runButtonEl = this.gameControlsEl.querySelector('.run-button');\n    if (runButtonEl != null) {\n      runButtonEl.addEventListener('click', (ev) => {\n        this.onGameStateChangeCallback(\n          !ev.target.matches('.run-button--runned'),\n        );\n      });\n    }\n    const widthEl = this.gameControlsEl.querySelector('.field-size--width');\n    const heightEl = this.gameControlsEl.querySelector('.field-size--height');\n    if (widthEl != null && heightEl != null) {\n      const onSizeChange = () => {\n        this.onFieldSizeChangeCallback(\n          Number(widthEl.value),\n          Number(heightEl.value),\n        );\n      };\n      widthEl.addEventListener('change', onSizeChange);\n      heightEl.addEventListener('change', onSizeChange);\n    }\n  }\n  updateGameState(state) {\n    this.gameViewState = state;\n    this.updateGameControls();\n  }\n  onGameStateChange(cb) {\n    this.onGameStateChangeCallback = cb;\n  }\n  onFieldSizeChange(cb) {\n    this.onFieldSizeChangeCallback = cb;\n  }\n}\nexports.GameView = GameView;\n\n\n//# sourceURL=webpack://lesson-19-homework/./srcjs/GameView.js?");

/***/ }),

/***/ "./srcjs/index.js":
/*!************************!*\
  !*** ./srcjs/index.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Game_1 = __webpack_require__(/*! ./Game */ \"./srcjs/Game.js\");\nconst GameField_1 = __webpack_require__(/*! ./GameField */ \"./srcjs/GameField.js\");\nconst GameView_1 = __webpack_require__(/*! ./GameView */ \"./srcjs/GameView.js\");\n__webpack_require__(/*! ./styles.css */ \"./srcjs/styles.css\");\nconst el = document.getElementById('app');\nconst gameView = new GameView_1.GameView(el);\nconst gameField = new GameField_1.GameField(5, 5);\nnew Game_1.Game(gameField, gameView, 1000);\n\n\n//# sourceURL=webpack://lesson-19-homework/./srcjs/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./srcjs/index.js");
/******/ 	
/******/ })()
;