/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n// Generic sleep promise\r\nfunction sleep(miliseconds) {\r\n    return new Promise(resolve => setTimeout(resolve, miliseconds));\r\n}\r\nexports.sleep = sleep;\r\n// Log items to screen (instead of console.log)\r\nfunction screenlog(strs) {\r\n    let logdiv = document.getElementById(\"screenlog\");\r\n    if (logdiv === null) {\r\n        console.log(strs);\r\n        return;\r\n    }\r\n    let logitem = document.createElement(\"p\");\r\n    if (!Array.isArray(strs)) {\r\n        strs = [strs];\r\n    }\r\n    for (let str of strs) {\r\n        if (str === undefined) {\r\n            logitem.innerHTML += \"undefined\";\r\n        }\r\n        else if (typeof str === \"object\") {\r\n            logitem.innerHTML += JSON.stringify(str);\r\n        }\r\n        else {\r\n            logitem.innerHTML += str.toString();\r\n        }\r\n        logitem.innerHTML += ' ';\r\n    }\r\n    logdiv.appendChild(logitem);\r\n    logdiv.scrollTop = logdiv.scrollHeight;\r\n}\r\nexports.screenlog = screenlog;\r\n// animate from https://javascript.info/js-animation \r\n// under CC-BY-NC-SA with modifications\r\nfunction animate(duration, timing, draw) {\r\n    let start = performance.now();\r\n    requestAnimationFrame(function animate(time) {\r\n        // timeFraction goes from 0 to 1\r\n        let timeFraction = (time - start) / duration;\r\n        if (timeFraction > 1)\r\n            timeFraction = 1;\r\n        if (timeFraction < 0)\r\n            timeFraction = 0;\r\n        // calculate the current animation state\r\n        let progress = timing(timeFraction);\r\n        draw(progress); // draw it\r\n        if (timeFraction < 1)\r\n            requestAnimationFrame(animate);\r\n    });\r\n}\r\nfunction animawait(duration, timing, draw) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        animate(duration, timing, draw);\r\n        yield sleep(duration);\r\n    });\r\n}\r\nfunction parseTileTxt(tiletxt, tilecodes, chikincode) {\r\n    let pos = [0, 0];\r\n    let tiles = [];\r\n    let rows = tiletxt.split(\"\\n\");\r\n    let y;\r\n    for (y = 0; y < rows.length; y++) {\r\n        let row = rows[y].split(\"\");\r\n        if (row[0] === ':') {\r\n            break;\r\n        }\r\n        let chikinpos = row.indexOf(chikincode);\r\n        if (chikinpos >= 0) {\r\n            pos = [y, chikinpos];\r\n        }\r\n        tiles.push(row.map((c) => tilecodes[c]));\r\n    }\r\n    let fgtiles = [];\r\n    for (y++; y < rows.length; y++) {\r\n        let row = rows[y].split(\" \");\r\n        let code = row[0];\r\n        let coords = row[1].split(\",\").map((n) => parseInt(n, 10));\r\n        fgtiles.push([tilecodes[code], coords]);\r\n    }\r\n    return [tiles, fgtiles, pos];\r\n}\r\n// Set size of game area based on window size\r\nfunction updateSize() {\r\n    let gameArea = document.getElementById(\"game\");\r\n    if (gameArea === null) {\r\n        throw \"No game area\";\r\n    }\r\n    let tileProportion = 10;\r\n    let h = Math.floor(gameArea.clientHeight * 0.9);\r\n    let w = Math.floor(gameArea.clientWidth * 0.9);\r\n    let size = Math.min(h, w);\r\n    let style = gameArea.style;\r\n    style.setProperty(\"--proportion\", `${tileProportion}`);\r\n    style.setProperty(\"--size\", `${size}px`);\r\n}\r\n// Reformat tile data for lookups\r\nfunction getTileData(meta) {\r\n    let tiledata = meta.tiles;\r\n    let tilecodes = {};\r\n    for (let tiletype in tiledata) {\r\n        tilecodes[tiledata[tiletype].code] = tiletype;\r\n    }\r\n    return {\r\n        data: tiledata,\r\n        codes: tilecodes\r\n    };\r\n}\r\nfunction createTile(t, tiledata) {\r\n    let tile = emptyTile();\r\n    if (t in tiledata) {\r\n        let image = new Image();\r\n        image.src = tiledata[t].img;\r\n        tile.appendChild(image);\r\n        if (\"size\" in tiledata[t]) {\r\n            image.style.setProperty(\"height\", `calc(var(--tile) * ${tiledata[t].size[0]})`);\r\n            image.style.setProperty(\"width\", `calc(var(--tile) * ${tiledata[t].size[1]})`);\r\n        }\r\n    }\r\n    return tile;\r\n}\r\nfunction emptyTile() {\r\n    let tile = document.createElement(\"div\");\r\n    tile.classList.add(\"t\");\r\n    return tile;\r\n}\r\nfunction drawWorld(world, tiles, fgtiles, duration, tiledata) {\r\n    let domtiles = document.createElement(\"div\");\r\n    domtiles.classList.add(\"tileContainer\");\r\n    let fgdomtiles = document.createElement(\"div\");\r\n    fgdomtiles.classList.add(\"fgtiles\");\r\n    domtiles.appendChild(fgdomtiles);\r\n    for (let row of tiles) {\r\n        let domrow = document.createElement(\"div\");\r\n        domrow.classList.add(\"worldRow\");\r\n        for (let t of row) {\r\n            let tile = createTile(t, tiledata);\r\n            domrow.appendChild(tile);\r\n        }\r\n        domtiles.appendChild(domrow);\r\n    }\r\n    world.appendChild(domtiles);\r\n    for (let t of fgtiles) {\r\n        let code = t[0];\r\n        let coords = t[1];\r\n        let tile = createTile(code, tiledata);\r\n        tile.style.setProperty(`top`, `calc(var(--tile) * ${coords[0]})`);\r\n        tile.style.setProperty(`left`, `calc(var(--tile) * ${coords[1]})`);\r\n        fgdomtiles.appendChild(tile);\r\n    }\r\n    animate(duration, (t) => t, (progress) => {\r\n        domtiles.style.opacity = progress.toString();\r\n    });\r\n}\r\nfunction setPos(world, pos) {\r\n    world.style.setProperty(\"--y\", `calc(${-pos[0]} * var(--size) / var(--proportion))`);\r\n    world.style.setProperty(\"--x\", `calc(${-pos[1]} * var(--size) / var(--proportion))`);\r\n}\r\nfunction keydown(world, pressed, pos) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        while (pressed.length) {\r\n            // screenlog(pressed);\r\n            let ydif = 0;\r\n            let xdif = 0;\r\n            switch (pressed[0]) {\r\n                case \"w\":\r\n                case \"ArrowUp\":\r\n                    ydif = -1;\r\n                    break;\r\n                case \"s\":\r\n                case \"ArrowDown\":\r\n                    ydif = 1;\r\n                    break;\r\n                case \"a\":\r\n                case \"ArrowLeft\":\r\n                    xdif = -1;\r\n                    break;\r\n                case \"d\":\r\n                case \"ArrowRight\":\r\n                    xdif = 1;\r\n                    break;\r\n                default:\r\n                    return;\r\n            }\r\n            let oldpos = pos.slice();\r\n            yield animawait(180, (t) => t, (progress) => {\r\n                let newpos = [oldpos[0] + ydif * progress, oldpos[1] + xdif * progress];\r\n                setPos(world, newpos);\r\n            });\r\n            pos[0] += ydif;\r\n            pos[1] += xdif;\r\n        }\r\n    });\r\n}\r\n;\r\nfunction otheractions(key) {\r\n    switch (key) {\r\n        case \" \":\r\n        case \"Enter\":\r\n            animate(300, (t) => Math.abs(t * (t - 0.5) * (t - 1) * 3), (progress) => {\r\n                for (let chikin of document.getElementsByClassName(\"chikin\")) {\r\n                    chikin.style.setProperty(\"transform\", `translateY(calc(${-progress} * var(--tile)))`);\r\n                }\r\n            });\r\n            break;\r\n    }\r\n}\r\nfunction gameload(meta, tiletxt) {\r\n    return __awaiter(this, void 0, void 0, function* () {\r\n        // Deal with tile info\r\n        let datacodes = getTileData(meta);\r\n        let tiledata = datacodes.data;\r\n        let tilecodes = datacodes.codes;\r\n        // screenlog([\"tiledata:\", tiledata]);\r\n        let tilesandpos = parseTileTxt(tiletxt, tilecodes, meta.characters.chikin.code);\r\n        let tiles = tilesandpos[0];\r\n        let fgtiles = tilesandpos[1];\r\n        let pos = tilesandpos[2];\r\n        // Set up game area\r\n        updateSize();\r\n        window.addEventListener(\"resize\", updateSize);\r\n        let area = document.getElementById(\"game\");\r\n        if (area === null) {\r\n            throw \"No game area\";\r\n        }\r\n        let world = document.createElement(\"div\");\r\n        world.classList.add(\"world\");\r\n        area.innerHTML = \"\";\r\n        area.appendChild(world);\r\n        // Place chikin\r\n        setPos(world, pos);\r\n        let chikinImg = new Image();\r\n        chikinImg.src = meta.characters.chikin.img;\r\n        chikinImg.classList.add(\"chikin\");\r\n        chikinImg.alt = \"chikin\";\r\n        area.appendChild(chikinImg);\r\n        screenlog(\"Loaded game\");\r\n        // screenlog([\"tiles:\", tiles]);\r\n        // Fade in things\r\n        yield animawait(500, (t) => t, (progress) => {\r\n            chikinImg.style.opacity = progress.toString();\r\n        });\r\n        yield animate(1000, (t) => t, (progress) => {\r\n            world.style.opacity = progress.toString();\r\n        });\r\n        // Fade in world\r\n        drawWorld(world, tiles, fgtiles, 1000, tiledata);\r\n        screenlog(\"Done\");\r\n        // Keypress handlers\r\n        let pressed = [];\r\n        let running = false;\r\n        let usedkeys = new Set([\"w\", \"ArrowUp\", \"s\", \"ArrowDown\", \"a\", \"ArrowLeft\", \"d\", \"ArrowRight\"]);\r\n        window.onkeyup = (e) => {\r\n            let i = pressed.indexOf(e.key);\r\n            if (i >= 0) {\r\n                pressed.splice(i, 1);\r\n            }\r\n        };\r\n        window.onkeydown = function (e) {\r\n            return __awaiter(this, void 0, void 0, function* () {\r\n                console.log(\"\\\"\" + e.key + \"\\\"\");\r\n                otheractions(e.key);\r\n                if (pressed.indexOf(e.key) === -1) {\r\n                    if (usedkeys.has(e.key))\r\n                        pressed.push(e.key);\r\n                }\r\n                if (running) {\r\n                    return;\r\n                }\r\n                running = true;\r\n                yield keydown(world, pressed, pos);\r\n                running = false;\r\n            });\r\n        };\r\n    });\r\n}\r\nexports.gameload = gameload;\r\n\n\n//# sourceURL=webpack:///./src/game.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __importStar = (this && this.__importStar) || function (mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result[\"default\"] = mod;\r\n    return result;\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst game = __importStar(__webpack_require__(/*! ./game */ \"./src/game.ts\"));\r\n// Kickstart everything\r\nwindow.addEventListener(\"load\", () => {\r\n    let delayer = game.sleep(1000);\r\n    game.screenlog(\"Loaded page\");\r\n    Promise.all([metaPromise, tilesPromise, delayer]).then(list => {\r\n        game.gameload(list[0], list[1]);\r\n    });\r\n});\r\n// Promises for loading files\r\nlet metaPromise = fetch(\"meta.json\").then(resp => {\r\n    return resp.json();\r\n});\r\nlet tilesPromise = fetch(\"tiles.txt\").then(resp => {\r\n    return resp.text();\r\n});\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });