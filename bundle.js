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

/***/ "./reverb.js":
/*!*******************!*\
  !*** ./reverb.js ***!
  \*******************/
/*! exports provided: mergeParams, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"mergeParams\", function() { return mergeParams; });\n// Implementation of Manfred Schoeder's Freeverb algorithmic reverb\n// inspired by this article https://itnext.io/algorithmic-reverb-and-web-audio-api-e1ccec94621a\n// Uses lowpass \"comb\" filters to simulate delay lines and allpass filters\n// to simulate diffusion through the air\n\n// First, define a composite node class to allow for multiple nodes to \n// be bundled together as one\nclass CompositeAudioNode {\n    constructor(ctx, options) {\n        this.context = ctx;\n        this.input = ctx.createGain();\n        this.output = this.context.createGain();\n    }\n\n    connect(connection) {\n        this.output.connect(connection);\n    }\n\n    disconnect() {\n        this.output.disconnect.apply(this.output, arguments);\n    }\n}\n\n// Utility function for controlling multiple audio params as if they were one\n// credit to https://gist.github.com/miselaytes-anton/7d795d6efcc7774b136c2b73dc38ed32\n\nfunction mergeParams(params) {\n    const singleParam = params[0];\n    const parameter = {};\n    const audioNodeMethods = Object.getOwnPropertyNames(AudioParam.prototype)\n        .filter(prop => typeof singleParam[prop] === 'function');\n\n    audioNodeMethods.forEach(method => {\n        parameter[method] = (...argums) => {\n            const args = Array.prototype.slice.call(argums);\n            params.forEach((param) => {\n                singleParam[method].apply(param, args);\n            });\n\n        };\n    });\n\n    Object.defineProperties(parameter, {\n        value: {\n            get: function () {\n                return singleParam.value;\n            },\n            set: function (value) {\n                params.forEach(param => {\n                    param.value = value;\n                });\n            }\n        }\n    });\n\n    return parameter;\n}\n\nclass LowPassComb extends CompositeAudioNode {\n    constructor(ctx, options) {\n        super(ctx, options);\n        const { delayTime, resonance: gainValue, dampening: frequency } = options;\n        this.lowPass = new BiquadFilterNode(ctx, { type: 'lowpass', frequency, Q: -3.0102999566398125 });\n        this.delay = new DelayNode(ctx, { delayTime });\n        this.gain = ctx.createGain();\n        this.gain.gain.value = gainValue;\n\n        this.input.connect(this.delay)\n            .connect(this.lowPass)\n            .connect(this.gain)\n            .connect(this.input)\n            .connect(this.output);\n    }\n\n    get resonance() {\n        return this.gain.gain;\n    }\n\n    get dampening() {\n        return this.delay.delayTime;\n    }\n\n    get delayTime() {\n        return this.delay.delayTime;\n    }\n}\n\n// https://github.com/Louis-C-Leon/SympleSynth/blob/master/synthesizer/reverb.js\nclass Reverb extends CompositeAudioNode {\n    constructor(ctx, options) {\n        super(ctx, options);\n        const { roomSize: resonance, dampening, wetGain, dryGain } = options;\n        const SAMPLE_RATE = 44100;\n        const COMB_FILTER_TUNINGS = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116]\n            .map(delayPerSecond => delayPerSecond / SAMPLE_RATE);\n        const ALLPASS_FREQUENCIES = [225, 556, 441, 341];\n\n        this.wet = ctx.createGain();\n        this.wet.gain.setValueAtTime(wetGain, ctx.currentTime);\n        this.dry = ctx.createGain();\n        this.dry.gain.setValueAtTime(dryGain, ctx.currentTime);\n        this.merger = ctx.createChannelMerger(2);\n        this.splitter = ctx.createChannelSplitter(2);\n\n        this.combFilters = COMB_FILTER_TUNINGS\n            .map(delayTime => new LowPassComb(ctx, { dampening, resonance, delayTime }));\n        const combLeft = this.combFilters.slice(0, 4);\n        const combRight = this.combFilters.slice(4);\n        this.allPassFilters = ALLPASS_FREQUENCIES\n            .map(frequency => new BiquadFilterNode(ctx, { type: 'allpass', frequency }));\n        this.input.connect(this.wet).connect(this.splitter);\n        this.input.connect(this.dry).connect(this.output);\n\n        combLeft.forEach(comb => {\n            this.splitter.connect(comb.input, 0).connect(this.merger, 0, 0)\n        });\n        combRight.forEach(comb => {\n            this.splitter.connect(comb.input, 1).connect(this.merger, 0, 1)\n        });\n\n        this.merger.connect(this.allPassFilters[0])\n            .connect(this.allPassFilters[1])\n            .connect(this.allPassFilters[2])\n            .connect(this.allPassFilters[3])\n            .connect(this.output);\n\n        this.output.gain.value = 0.3;\n    }\n\n    get wetGain() {\n        return this.wet.gain;\n    }\n    get dryGain() {\n        return this.dry.gain;\n    }\n    get roomSize() {\n        return mergeParams(this.combFilters.map(comb => comb.resonance));\n    }\n    get dampening() {\n        return mergeParams(this.combFilters.map(comb => comb.dampening));\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Reverb);\n\n//# sourceURL=webpack:///./reverb.js?");

/***/ }),

/***/ "./virtual_synth.js":
/*!**************************!*\
  !*** ./virtual_synth.js ***!
  \**************************/
/*! exports provided: c, master, masterbus, delay, hipass, lopass, convolver */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return c; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"master\", function() { return master; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"masterbus\", function() { return masterbus; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"delay\", function() { return delay; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hipass\", function() { return hipass; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"lopass\", function() { return lopass; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"convolver\", function() { return convolver; });\n/* harmony import */ var _grain_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grain.js */ \"./grain.js\");\n/* harmony import */ var _reverb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reverb.js */ \"./reverb.js\");\n\n\n// import { request } from './request.js';\n// import Particle from './particle.js';\n\nwindow.AudioContext = window.AudioContext || window.webkitAudioContext;\n\nconst c = new AudioContext();\nconst master = c.createGain();\nconst masterbus = c.createGain();\n\nconst delay = new DelayNode(c, {\n    delayTime: 0.4,\n    maxDelayTime: 0.4,\n});\n\nconst hipass = new BiquadFilterNode(c, {\n    type: 'highpass',\n    frequency: 0,\n});\n\nconst lopass = new BiquadFilterNode(c, {\n    type: 'lowpass',\n    frequency: 10000,\n});\n\nconst convolver = c.createConvolver();\nlet source, hallBuffer;\n\nlet lfo = new OscillatorNode(c, {\n    type: 'sine',\n    frequency: 1.5,\n});\n\nconst analyser = new AnalyserNode(c, {\n    fftSize: 2048,\n    maxDecibles: -30,\n    minDecibels: -100,\n    smoothingTimeConstant: 0.97\n});\n\nconst reverb = new _reverb_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](c, { \n    roomSize: 0.9, \n    dampening: 3000, \n    wetGain: 0.8, \n    dryGain: 0.2 \n});\n\n// const analyser = c.createAnalyser();\n\nconst request = new XMLHttpRequest();\nrequest.open('GET', 'assets/audio/large_hall.wav', true);\nrequest.responseType = \"arraybuffer\";\nrequest.onload = function () {\n    c.decodeAudioData(request.response, function (buffer) {\n        hallBuffer = buffer;\n        source = c.createBufferSource();\n        source.buffer = hallBuffer;\n        console.log('convolver loaded');\n    }, function (e) {\n        console.log('loading failed' + e.err);\n    });\n};\nrequest.send();\n\nconvolver.buffer = hallBuffer;\n\nmasterbus.connect(convolver);\nmasterbus.connect(master);\nmasterbus.connect(reverb);\nreverb.connect(master);\n// convolver.connect(master);\n\n// master.connect(c.destination);\nlfo.connect(master.gain);\nlfo.start();\nmaster.connect(analyser);\nanalyser.connect(c.destination);\n// delay.connect(c.destination);\n\nwindow.onload = () => {\n    let buffer, source, data;\n\n    const request = new XMLHttpRequest();\n    request.open('GET', 'assets/audio/reverie.mp3', true);\n    request.responseType = \"arraybuffer\";\n    request.onload = function () {\n        c.decodeAudioData(request.response, function(b) {\n            buffer = b; \n            data = buffer.getChannelData(0);\n            console.log('loaded');\n\n        }, function () {\n            console.log('loading failed');\n        });\n    };\n    request.send();\n\n    \n    const playButton = document.getElementById(\"play\");\n    playButton.addEventListener('click', function(){\n            // scheduled start, audio start time, sample length\n            source = c.createBufferSource();\n            source.buffer = buffer;\n            source.connect(masterbus);\n            source.start(c.currentTime, 30);\n            source.onended = () => {\n                console.log(\"file has ended\");\n            };\n            console.log('playing');\n    });\n\n    const grains = [];\n    let grainCount = 0;\n\n    const play = () => {\n        const grain = new _grain_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](buffer);\n        grains[grainCount] = grain;\n        grainCount += 1;\n        window.setTimeout(play, Math.random() * 275);\n    };\n\n    const grain = document.getElementById(\"grain\");\n    grain.addEventListener('click', function() {\n            play();\n            console.log('playing');\n    });\n\n    const changeVolume = (ele, node) => {\n        const volume = ele.value;\n        const fraction = parseInt(volume) / 100;\n        node.gain.value = fraction * fraction;\n    };\n\n    const changeGain = () => {\n        const masterGain = document.getElementById(\"master-gain\");\n        changeVolume(masterGain, master);\n    };\n\n    updateHipassFilter = () => {\n        const hifilter = document.getElementById(\"hipass\");\n        hipass.frequency.setValueAtTime(hifilter.value, c.currentTime);\n        console.log(hifilter.value);\n        console.log(hipass.frequency.value);\n    };\n\n    updateLopassFilter = () => {\n        const lowfilter = document.getElementById(\"lopass\");\n        lopass.frequency.setValueAtTime(lowfilter.value, c.currentTime);\n        console.log(lowfilter.value);\n        console.log(lopass.frequency.value);\n    };\n    \n    changeFreq = () => {\n        //the range of the range-input is from 0 - 100\n        oscProp.frequency = document.getElementById(\"freqslider\").value * Math.exp(2);\n        play();\n        play();\n    };\n};\n/////////////////////////////////////////////////////////\nconst canvas = document.getElementById(\"sphere\");\n\nlet width = canvas.offsetWidth;\nlet height = canvas.offsetHeight;\n\n\nconst ctx = canvas.getContext('2d');\n\nfunction onResize() {\n    width = canvas.offsetWidth;\n    height = canvas.offsetHeight;\n    // If the screen device has a pixel ratio over 1\n    // We render the canvas twice bigger to make it sharper (e.g. Retina iPhone)\n    if (window.devicePixelRatio > 1) {\n        canvas.width = canvas.clientWidth * 2;\n        canvas.height = canvas.clientHeight * 2;\n        ctx.scale(2, 2);\n    } else {\n        canvas.width = width;\n        canvas.height = height;\n    }\n}\n\nwindow.addEventListener('resize', onResize);\nonResize();\n\nlet PERSPECTIVE = width * 0.3;\nlet PROJECTION_CENTER_X = width / 2;\nlet PROJECTION_CENTER_Y = height / 2;\nconst PARTICLE_RADIUS = 4;\n// let GLOBE_RADIUS = width / 3;\nlet GLOBE_RADIUS = 40;\nlet particles = [];\nclass Particle {\n    constructor(analyser, theta, phi, x, y, z) {\n        this.analyser = analyser;\n\n        this.theta = theta || Math.random() * 2 * Math.PI;\n        //multiply MathRandom by acos so that the partcles don't clump near the poles\n        this.phi = phi || Math.acos((Math.random() * 2) - 1);\n\n        this.x = x || 0;\n        this.y = y || 0;\n        this.z = z || 0;\n\n        this.xProjected = x || 0; \n        this.yProjected = y || 0;\n        this.scaleProjected = z || 0;\n    }\n\n    // Projection translation from 2d to 3d from:\n    // https://www.basedesign.com/blog/how-to-render-3d-in-2d-canvas\n    project() {\n        const timeFrequencyData = new Uint8Array(this.analyser.fftSize);\n        const timeFloatData = new Float32Array(this.analyser.fftSize);\n        const dataArray = new Float32Array(this.analyser.frequencyBinCount);\n\n        this.analyser.getByteTimeDomainData(timeFrequencyData);\n        this.analyser.getFloatTimeDomainData(timeFloatData);\n        this.analyser.getFloatFrequencyData(dataArray);\n\n        const rad = Math.pow(dataArray[0] + 100, 3/2); \n        GLOBE_RADIUS = rad < 0 ? 40 : rad;\n        \n       \n        this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);\n        this.y = GLOBE_RADIUS * Math.cos(this.phi);\n        this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_RADIUS;\n\n        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);\n        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;\n        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;\n    }\n\n    draw() {\n        this.project();\n        //opacity based on distance\n        ctx.globalAlpha = Math.abs(1 - this.z / width);\n\n        ctx.beginPath();\n        //x, y ,r, angle-start, angle-end\n        ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);\n        const r = 70;\n        const g = 255;\n        const b = 140;\n\n        const rgbString = \"rgba(\" + r + \",\" + g + \",\" + b + \")\";\n        ctx.fillStyle = 'rgb(0, 212, 212)';\n        ctx.fill();\n    }\n\n}\n\nlet density = 800;\nfunction render() {\n    ctx.clearRect(0, 0, width, height);\n    if (!particles.length) {\n        for (let i = 0; i < density; i++) {\n            particles.push(new Particle(analyser));\n        }\n    } else {\n        const preParticles = Array.from(particles);\n        particles = [];\n        for (let i = 0; i < density; i++) {\n            particles.push(new Particle(\n                analyser, \n                preParticles[i].theta,\n                preParticles[i].phi,\n                preParticles[i].x, \n                preParticles[i].y, \n                preParticles[i].z)\n            );\n        }  \n    }\n\n    for (let i = 0; i < particles.length; i++){\n        particles[i].project();\n    }\n\n    //sort particles by their z index \n    particles.sort((dot1, dot2) => {\n        return dot1.sizeProjection - dot2.sizeProjection;\n    });\n\n    for (let i = 0; i < particles.length; i++) {\n        particles[i].draw();\n    }\n\n    window.requestAnimationFrame(render);\n\n}\n\nfunction init() {\n    window.requestAnimationFrame(render);\n}\n\ninit();\n\n\n//# sourceURL=webpack:///./virtual_synth.js?");

/***/ })

/******/ });