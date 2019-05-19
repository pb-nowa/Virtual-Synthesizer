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

/***/ "./get_buffer.js":
/*!***********************!*\
  !*** ./get_buffer.js ***!
  \***********************/
/*! exports provided: getBuffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getBuffer\", function() { return getBuffer; });\nconst getBuffer = (ctx, impulseURL) => {\n    return fetch(impulseURL)\n    .then( res => res.arrayBuffer())\n    .then( arrayBuffer => ctx.decodeAudioData(arrayBuffer)\n    );\n};\n\n\n\n//# sourceURL=webpack:///./get_buffer.js?");

/***/ }),

/***/ "./grain.js":
/*!******************!*\
  !*** ./grain.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Grain {\n    constructor(c, buffer, masterbus) {\n        this.context = c;\n        this.now = this.context.currentTime;\n        this.source = this.context.createBufferSource();\n        this.source.buffer = buffer;\n        this.attack = Math.random() * 0.3;\n        this.sustain = Math.random() * 0.2;\n        this.release = Math.random() * 0.05;\n        this.playbackSampleStart = 25; //where in the audio file to start playing\n\n        this.bus = this.context.createGain();\n        this.source.connect(this.bus);\n        this.bus.connect(masterbus);\n        // this.bus.connect(convolver);\n\n        this.playGrain();\n    }\n\n    playGrain() {\n        this.source.start(this.now, Math.random() * 0.5 + this.playbackSampleStart, this.attack + this.sustain + this.release);\n        this.bus.gain.setValueAtTime(0, this.now);\n        // value, endtime\n        this.bus.gain.linearRampToValueAtTime(50, this.now + this.attack);\n        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.sustain + this.release - 0.01);\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Grain);\n\n//# sourceURL=webpack:///./grain.js?");

/***/ }),

/***/ "./virtual_synth.js":
/*!**************************!*\
  !*** ./virtual_synth.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _grain_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grain.js */ \"./grain.js\");\n/* harmony import */ var _get_buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get_buffer */ \"./get_buffer.js\");\n\n\n\nwindow.AudioContext = window.AudioContext || window.webkitAudioContext;\n\nconst c = new AudioContext();\nconst master = c.createGain();\nconst masterbus = c.createGain();\nlet Q = 12;\n\nconst delay = new DelayNode(c, {\n    delayTime: 0.4,\n    maxDelayTime: 0.4,\n});\n\nconst bandpass = new BiquadFilterNode(c, {\n    type: 'bandpass',\n    // frequency: 10,\n    Q: Q\n});\n\nconst hipass = new BiquadFilterNode(c, {\n    type: 'highpass',\n    frequency: 0,\n});\n\nconst lopass = new BiquadFilterNode(c, {\n    type: 'lowpass',\n    frequency: 10000,\n});\n\nlet lfo = new OscillatorNode(c, {\n    type: 'sine',\n    frequency: 1.5,\n});\n\nconst analyser = new AnalyserNode(c, {\n    fftSize: 2048,\n    maxDecibles: -30,\n    minDecibels: -100,\n    smoothingTimeConstant: 0.97\n});\n\nlet convolver;\n\nasync function setReverb() {\n    convolver = c.createConvolver();\n    convolver.buffer = await Object(_get_buffer__WEBPACK_IMPORTED_MODULE_1__[\"getBuffer\"])(c, '/assets/audio/large_hall.wav');\n    masterbus.connect(convolver).connect(bandpass).connect(master);\n}\n\nsetReverb();\n\n// masterbus.connect(master);\n\nlfo.connect(master.gain);\n// lfo.start();\nmaster.connect(analyser);\nmaster.connect(c.destination);\n\n\n\nwindow.onload = () => {\n    let buffer, source;\n\n    async function initBuffer() {\n        buffer = await Object(_get_buffer__WEBPACK_IMPORTED_MODULE_1__[\"getBuffer\"])(c, '/assets/audio/reverie.mp3'); \n        Array.prototype.reverse.call(buffer.getChannelData(0));\n        Array.prototype.reverse.call(buffer.getChannelData(1));\n        console.log('loaded');\n    }\n\n    initBuffer();\n    \n    const playButton = document.getElementById(\"play\");\n    playButton.addEventListener('click', function(){\n            // scheduled start, audio start time, sample length\n            source = c.createBufferSource();\n            source.buffer = buffer;\n            source.connect(masterbus);\n            source.start(c.currentTime, 30);\n            source.onended = () => {\n                console.log(\"file has ended\");\n            };\n            console.log('playing');\n    });\n\n    const grains = [];\n    let grainCount = 0;\n\n    const play = () => {\n        const grain = new _grain_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](c, buffer, masterbus);\n        grains[grainCount] = grain;\n        grainCount += 1;\n        window.setTimeout(play, Math.random() * 275);\n    };\n\n    const grain = document.getElementById(\"grain\");\n    grain.addEventListener('click', function() {\n            play();\n            console.log('playing');\n    });\n\n    const changeVolume = (ele, node) => {\n        const volume = ele.value;\n        const fraction = parseInt(volume) / 100;\n        node.gain.value = fraction * fraction;\n    };\n\n    const changeGain = () => {\n        const masterGain = document.getElementById(\"master-gain\");\n        changeVolume(masterGain, master);\n    };\n\n    updateHipassFilter = () => {\n        const hifilter = document.getElementById(\"hipass\");\n        hipass.frequency.setValueAtTime(hifilter.value, c.currentTime);\n        console.log(hifilter.value);\n        console.log(hipass.frequency.value);\n    };\n\n    updateLopassFilter = () => {\n        const lowfilter = document.getElementById(\"lopass\");\n        lopass.frequency.setValueAtTime(lowfilter.value, c.currentTime);\n        console.log(lowfilter.value);\n        console.log(lopass.frequency.value);\n    };\n    \n    changeFreq = () => {\n        //the range of the range-input is from 0 - 100\n        oscProp.frequency = document.getElementById(\"freqslider\").value * Math.exp(2);\n        play();\n        play();\n    };\n};\n/////////////////////////////////////////////////////////\nconst canvas = document.getElementById(\"sphere\");\n\nlet width = canvas.offsetWidth;\nlet height = canvas.offsetHeight;\n\n\nconst ctx = canvas.getContext('2d');\n\nfunction onResize() {\n    width = canvas.offsetWidth;\n    height = canvas.offsetHeight;\n    // If the screen device has a pixel ratio over 1\n    // We render the canvas twice bigger to make it sharper (e.g. Retina iPhone)\n    if (window.devicePixelRatio > 1) {\n        canvas.width = canvas.clientWidth * 2;\n        canvas.height = canvas.clientHeight * 2;\n        ctx.scale(2, 2);\n    } else {\n        canvas.width = width;\n        canvas.height = height;\n    }\n}\n\nwindow.addEventListener('resize', onResize);\nonResize();\n\nlet PERSPECTIVE = width * 0.7;\nlet PROJECTION_CENTER_X = width / 2;\nlet PROJECTION_CENTER_Y = height / 2;\nconst PARTICLE_RADIUS = 1.6;\n// let GLOBE_RADIUS = width / 3;\nlet GLOBE_RADIUS = 40;\nlet particles = [];\n\nclass Particle {\n    constructor(analyser, theta, phi, x, y, z) {\n        this.analyser = analyser;\n\n        this.theta = theta || Math.random() * 2 * Math.PI;\n        //multiply MathRandom by acos so that the partcles don't clump near the poles\n        this.phi = phi || Math.acos((Math.random() * 2) - 1);\n\n        this.x = x || 0;\n        this.y = y || 0;\n        this.z = z || 0;\n\n        this.xProjected = x || 0; \n        this.yProjected = y || 0;\n        this.scaleProjected = z || 0;\n    }\n\n    // Projection translation from 2d to 3d from:\n    // https://www.basedesign.com/blog/how-to-render-3d-in-2d-canvas\n    project() {\n        const timeFrequencyData = new Uint8Array(this.analyser.fftSize);\n        const timeFloatData = new Float32Array(this.analyser.fftSize);\n        const dataArray = new Float32Array(this.analyser.frequencyBinCount);\n\n        this.analyser.getByteTimeDomainData(timeFrequencyData);\n        this.analyser.getFloatTimeDomainData(timeFloatData);\n        this.analyser.getFloatFrequencyData(dataArray);\n\n        const rad = Math.pow(dataArray[Q] + 100, 3/2); \n        GLOBE_RADIUS = rad < 0 ? 40 : rad;\n        \n       \n        this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);\n        this.y = GLOBE_RADIUS * Math.cos(this.phi);\n        this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_RADIUS;\n\n        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);\n        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;\n        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;\n    }\n\n    draw() {\n        this.project();\n        //opacity based on distance\n        ctx.globalAlpha = Math.abs(1 - this.z / width);\n\n        ctx.beginPath();\n        //x, y ,r, angle-start, angle-end\n        ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);\n        const r = 70;\n        const g = 255;\n        const b = 140;\n\n        const rgbString = \"rgba(\" + r + \",\" + g + \",\" + b + \")\";\n        ctx.fillStyle = 'rgb(0, 212, 212)';\n        ctx.fill();\n    }\n\n}\n\nlet density = 1600;\nfunction render() {\n    ctx.clearRect(0, 0, width, height);\n    if (!particles.length) {\n        for (let i = 0; i < density; i++) {\n            particles.push(new Particle(analyser));\n        }\n    } else {\n        const preParticles = Array.from(particles);\n        particles = [];\n        for (let i = 0; i < density; i++) {\n            particles.push(new Particle(\n                analyser, \n                preParticles[i].theta,\n                preParticles[i].phi,\n                preParticles[i].x, \n                preParticles[i].y, \n                preParticles[i].z)\n            );\n        }  \n    }\n\n    for (let i = 0; i < particles.length; i++){\n        particles[i].project();\n    }\n\n    //sort particles by their z index \n    particles.sort((dot1, dot2) => {\n        return dot1.sizeProjection - dot2.sizeProjection;\n    });\n\n    for (let i = 0; i < particles.length; i++) {\n        particles[i].draw();\n    }\n\n    window.requestAnimationFrame(render);\n}\n\nfunction init() {\n    window.requestAnimationFrame(render);\n}\n\ninit();\n\n\n//# sourceURL=webpack:///./virtual_synth.js?");

/***/ })

/******/ });