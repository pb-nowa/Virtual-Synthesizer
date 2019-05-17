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
/******/ 	return __webpack_require__(__webpack_require__.s = "./virtual_synth.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./audio_context.js":
/*!**************************!*\
  !*** ./audio_context.js ***!
  \**************************/
/*! exports provided: c, master, masterbus, delay, hipass, lopass */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return c; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"master\", function() { return master; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"masterbus\", function() { return masterbus; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"delay\", function() { return delay; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hipass\", function() { return hipass; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"lopass\", function() { return lopass; });\nwindow.AudioContext = window.AudioContext || window.webkitAudioContext;\n\nconst c = new AudioContext();\nconst master = c.createGain();\nconst masterbus = c.createGain();\n\nconst delay = new DelayNode(c, {\n    delayTime: 0.4,\n    maxDelayTime: 0.4,\n});\n\nconst hipass = new BiquadFilterNode(c, {\n    type: 'highpass',\n    frequency: 0,\n});\n\nconst lopass = new BiquadFilterNode(c, {\n    type: 'lowpass',\n    frequency: 10000,\n});\n\n\n\nmasterbus.connect(master);\nmaster.connect(delay);\n// master.connect(reverb);\n\nmaster.connect(c.destination);\n// reverb.connect(c.destination);\ndelay.connect(c.destination);\n\n\n\n//# sourceURL=webpack:///./audio_context.js?");

/***/ }),

/***/ "./grain.js":
/*!******************!*\
  !*** ./grain.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _audio_context_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./audio_context.js */ \"./audio_context.js\");\n\n\nclass Grain {\n    constructor(buffer) {\n        this.now = _audio_context_js__WEBPACK_IMPORTED_MODULE_0__[\"c\"].currentTime;\n        this.source = _audio_context_js__WEBPACK_IMPORTED_MODULE_0__[\"c\"].createBufferSource();\n        this.source.buffer = buffer;\n        this.attack = Math.random() * 0.3;\n        this.sustain = Math.random() * 0.2;\n        this.release = Math.random() * 0.05;\n        this.playbackSampleStart = 25; //where in the audio file to start playing\n\n        this.bus = _audio_context_js__WEBPACK_IMPORTED_MODULE_0__[\"c\"].createGain();\n        this.source.connect(this.bus);\n        this.bus.connect(_audio_context_js__WEBPACK_IMPORTED_MODULE_0__[\"masterbus\"]);\n        // this.bus.connect(convolver);\n\n        this.playGrain();\n    }\n\n    playGrain() {\n        this.source.start(_audio_context_js__WEBPACK_IMPORTED_MODULE_0__[\"c\"].currentTime, Math.random() * 0.5 + this.playbackSampleStart, this.attack + this.sustain + this.release);\n        this.bus.gain.setValueAtTime(0, this.now);\n        // value, endtime\n        this.bus.gain.linearRampToValueAtTime(50, this.now + this.attack);\n        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.sustain + this.release - 0.01);\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Grain);\n\n//# sourceURL=webpack:///./grain.js?");

/***/ }),

/***/ "./virtual_synth.js":
/*!**************************!*\
  !*** ./virtual_synth.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _audio_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./audio_context */ \"./audio_context.js\");\n/* harmony import */ var _grain_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grain.js */ \"./grain.js\");\n\n\n\nwindow.onload = () => {\n    let buffer, source, data;\n\n    //brahms_3_mvt3\n    //import audio file\n    const request = new XMLHttpRequest();\n    request.open('GET', 'assets/audio/reverie.mp3', true);\n    request.responseType = \"arraybuffer\";\n    request.onload = function () {\n        _audio_context__WEBPACK_IMPORTED_MODULE_0__[\"c\"].decodeAudioData(request.response, function(b) {\n            buffer = b; \n            data = buffer.getChannelData(0);\n            console.log('loaded');\n\n        }, function () {\n            console.log('loading failed');\n        });\n    };\n    request.send();\n    \n    const playButton = document.getElementById(\"play\");\n    playButton.addEventListener('click', function(){\n            // scheduled start, audio start time, sample length\n            source = _audio_context__WEBPACK_IMPORTED_MODULE_0__[\"c\"].createBufferSource();\n            source.buffer = buffer;\n            source.connect(_audio_context__WEBPACK_IMPORTED_MODULE_0__[\"masterbus\"]);\n            source.start(_audio_context__WEBPACK_IMPORTED_MODULE_0__[\"c\"].currentTime, 6);\n            source.onended = () => {\n                console.log(\"file has ended\");\n            };\n            console.log('playing');\n    });\n\n    const grains = [];\n    let grainCount = 0;\n\n    const play = () => {\n        const grain = new _grain_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](buffer);\n        grains[grainCount] = grain;\n        grainCount += 1;\n        window.setTimeout(play, Math.random() * 275);\n    };\n\n    const grain = document.getElementById(\"grain\");\n    grain.addEventListener('click', function() {\n            play();\n            console.log('playing');\n    });\n\n    const changeVolume = (ele, node) => {\n        const volume = ele.value;\n        const fraction = parseInt(volume) / 100;\n        node.gain.value = fraction * fraction;\n    };\n\n    const changeGain = () => {\n        const masterGain = document.getElementById(\"master-gain\");\n        changeVolume(masterGain, master);\n    };\n\n    updateHipassFilter = () => {\n        const hifilter = document.getElementById(\"hipass\");\n        hipass.frequency.setValueAtTime(hifilter.value, _audio_context__WEBPACK_IMPORTED_MODULE_0__[\"c\"].currentTime);\n        console.log(hifilter.value);\n        console.log(hipass.frequency.value);\n    };\n\n    updateLopassFilter = () => {\n        const lowfilter = document.getElementById(\"lopass\");\n        lopass.frequency.setValueAtTime(lowfilter.value, _audio_context__WEBPACK_IMPORTED_MODULE_0__[\"c\"].currentTime);\n        console.log(lowfilter.value);\n        console.log(lopass.frequency.value);\n    };\n    \n    changeFreq = () => {\n        //the range of the range-input is from 0 - 100\n        oscProp.frequency = document.getElementById(\"freqslider\").value * Math.exp(2);\n        play();\n        play();\n    };\n};\n\n\n\n//# sourceURL=webpack:///./virtual_synth.js?");

/***/ })

/******/ });