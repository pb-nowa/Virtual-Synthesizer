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

/***/ "./grain.js":
/*!******************!*\
  !*** ./grain.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _virtual_synth_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./virtual_synth.js */ \"./virtual_synth.js\");\n\n\nclass Grain {\n    constructor(buffer) {\n        this.now = _virtual_synth_js__WEBPACK_IMPORTED_MODULE_0__[\"c\"].currentTime;\n        this.source = _virtual_synth_js__WEBPACK_IMPORTED_MODULE_0__[\"c\"].createBufferSource();\n        this.source.buffer = buffer;\n        this.attack = Math.random() * 0.3;\n        this.sustain = Math.random() * 0.2;\n        this.release = Math.random() * 0.05;\n        this.playbackSampleStart = 25; //where in the audio file to start playing\n\n        this.bus = _virtual_synth_js__WEBPACK_IMPORTED_MODULE_0__[\"c\"].createGain();\n        this.source.connect(this.bus);\n        this.bus.connect(_virtual_synth_js__WEBPACK_IMPORTED_MODULE_0__[\"masterbus\"]);\n        // this.bus.connect(convolver);\n\n        this.playGrain();\n    }\n\n    playGrain() {\n        this.source.start(_virtual_synth_js__WEBPACK_IMPORTED_MODULE_0__[\"c\"].currentTime, Math.random() * 0.5 + this.playbackSampleStart, this.attack + this.sustain + this.release);\n        this.bus.gain.setValueAtTime(0, this.now);\n        // value, endtime\n        this.bus.gain.linearRampToValueAtTime(50, this.now + this.attack);\n        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.sustain + this.release - 0.01);\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Grain);\n\n//# sourceURL=webpack:///./grain.js?");

/***/ }),

/***/ "./virtual_synth.js":
/*!**************************!*\
  !*** ./virtual_synth.js ***!
  \**************************/
/*! exports provided: c, master, masterbus, delay, hipass, lopass, reverb */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return c; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"master\", function() { return master; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"masterbus\", function() { return masterbus; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"delay\", function() { return delay; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hipass\", function() { return hipass; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"lopass\", function() { return lopass; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"reverb\", function() { return reverb; });\n/* harmony import */ var _grain_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grain.js */ \"./grain.js\");\n\n// import Particle from './particle.js';\n\nwindow.AudioContext = window.AudioContext || window.webkitAudioContext;\n\nconst c = new AudioContext();\nconst master = c.createGain();\nconst masterbus = c.createGain();\n\nconst delay = new DelayNode(c, {\n    delayTime: 0.4,\n    maxDelayTime: 0.4,\n});\n\nconst hipass = new BiquadFilterNode(c, {\n    type: 'highpass',\n    frequency: 0,\n});\n\nconst lopass = new BiquadFilterNode(c, {\n    type: 'lowpass',\n    frequency: 10000,\n});\n\nconst reverb = c.createConvolver();\nlet source, hallBuffer;\n\nconst request = new XMLHttpRequest();\nrequest.open('GET', 'assets/audio/large_hall.wav', true);\nrequest.responseType = \"arraybuffer\";\nrequest.onload = function () {\n    c.decodeAudioData(request.response, function (buffer) {\n        hallBuffer = buffer;\n        source = c.createBufferSource();\n        source.buffer = hallBuffer;\n        console.log('reverb loaded');\n    }, function (e) {\n        console.log('loading failed' + e.err);\n    });\n};\nrequest.send();\n\nreverb.buffer = hallBuffer;\n\nmasterbus.connect(reverb);\nmasterbus.connect(c.destination);\nreverb.connect(master);\n\n// master.connect(c.destination);\nmaster.connect(c.destination);\n// delay.connect(c.destination);\n\nwindow.onload = () => {\n    let buffer, source, data;\n\n    //brahms_3_mvt3\n    //import audio file\n    const request = new XMLHttpRequest();\n    request.open('GET', 'assets/audio/reverie.mp3', true);\n    request.responseType = \"arraybuffer\";\n    request.onload = function () {\n        c.decodeAudioData(request.response, function(b) {\n            buffer = b; \n            data = buffer.getChannelData(0);\n            console.log('loaded');\n\n        }, function () {\n            console.log('loading failed');\n        });\n    };\n    request.send();\n    \n    const playButton = document.getElementById(\"play\");\n    playButton.addEventListener('click', function(){\n            // scheduled start, audio start time, sample length\n            source = c.createBufferSource();\n            source.buffer = buffer;\n            source.connect(c.destination);\n            source.start(c.currentTime, 6);\n            source.onended = () => {\n                console.log(\"file has ended\");\n            };\n            console.log('playing');\n    });\n\n    const grains = [];\n    let grainCount = 0;\n\n    const play = () => {\n        const grain = new _grain_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](buffer);\n        grains[grainCount] = grain;\n        grainCount += 1;\n        window.setTimeout(play, Math.random() * 275);\n    };\n\n    const grain = document.getElementById(\"grain\");\n    grain.addEventListener('click', function() {\n            play();\n            console.log('playing');\n    });\n\n    const changeVolume = (ele, node) => {\n        const volume = ele.value;\n        const fraction = parseInt(volume) / 100;\n        node.gain.value = fraction * fraction;\n    };\n\n    const changeGain = () => {\n        const masterGain = document.getElementById(\"master-gain\");\n        changeVolume(masterGain, master);\n    };\n\n    updateHipassFilter = () => {\n        const hifilter = document.getElementById(\"hipass\");\n        hipass.frequency.setValueAtTime(hifilter.value, c.currentTime);\n        console.log(hifilter.value);\n        console.log(hipass.frequency.value);\n    };\n\n    updateLopassFilter = () => {\n        const lowfilter = document.getElementById(\"lopass\");\n        lopass.frequency.setValueAtTime(lowfilter.value, c.currentTime);\n        console.log(lowfilter.value);\n        console.log(lopass.frequency.value);\n    };\n    \n    changeFreq = () => {\n        //the range of the range-input is from 0 - 100\n        oscProp.frequency = document.getElementById(\"freqslider\").value * Math.exp(2);\n        play();\n        play();\n    };\n};\n/////////////////////////////////////////////////////////\nconst canvas = document.getElementById(\"sphere\");\n\n\nlet width = canvas.offsetWidth;\nlet height = canvas.offsetHeight;\n\n\nconst ctx = canvas.getContext('2d');\n\n//https://www.basedesign.com/blog/how-to-render-3d-in-2d-canvas\n// If the screen device has a pixel ratio over 1\n// We render the canvas twice bigger to make it sharper (e.g. Retina iPhone)\nif (window.devicePixelRatio > 1) {\n    canvas.width = canvas.clientWidth * 2;\n    canvas.height = canvas.clientHeight * 2;\n    ctx.scale(2, 2);\n} else {\n    canvas.width = width;\n    canvas.height = height;\n}\n\nlet PERSPECTIVE = width * 0.3;\nlet PROJECTION_CENTER_X = width / 2;\nlet PROJECTION_CENTER_Y = height / 2;\nconst PARTICLE_RADIUS = 4;\nlet GLOBE_RADIUS = width / 3;\nconst particles = [];\nclass Particle {\n    constructor() {\n        this.theta = Math.random() * 2 * Math.PI;\n        //multiply MathRandom by acos so that the partcles don't clump near the poles\n        this.phi = Math.acos((Math.random() * 2) - 1);\n\n        this.x = 0;\n        this.y = 0;\n        this.z = 0;\n\n        this.xProjected = 0; // x coordinate on the 2D world\n        this.yProjected = 0; // y coordinate on the 2D world\n        this.scaleProjected = 0;\n    }\n\n    //transforms the 3d coordinates into 2d coordinates\n    project() {\n        this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);\n        this.y = GLOBE_RADIUS * Math.cos(this.phi);\n        this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_RADIUS;\n\n        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);\n        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;\n        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;\n    }\n\n    draw() {\n        this.project();\n        //opacity based on distance\n        ctx.globalAlpha = Math.abs(1 - this.z / width);\n\n        ctx.beginPath();\n        //x, y ,r, angle-start, angle-end\n        ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);\n        const r = 70;\n        const g = 255;\n        const b = 140;\n\n        const rgbString = \"rgba(\" + r + \",\" + g + \",\" + b + \")\";\n        ctx.fillStyle = 'rgb(0, 212, 212)';\n        ctx.fill();\n    }\n\n}\n\nfunction render() {\n    ctx.clearRect(0, 0, width, height);\n\n    for (let i = 0; i < 1500; i++) {\n        particles.push(new Particle());\n    }\n\n    for (let i = 0; i < particles.length; i++){\n        particles[i].project();\n    }\n    //sort particles by their z index \n    particles.sort((dot1, dot2) => {\n        return dot1.sizeProjection - dot2.sizeProjection;\n    });\n\n    for (let i = 0; i < particles.length; i++) {\n        particles[i].draw();\n    }\n    window.requestAnimationFrame(render);\n\n}\n    // window.setInterval(render(), 80);\n\nfunction init() {\n    window.requestAnimationFrame(render);\n}\ninit();\n\n\n//# sourceURL=webpack:///./virtual_synth.js?");

/***/ })

/******/ });