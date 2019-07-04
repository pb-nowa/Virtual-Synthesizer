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
/******/ 	__webpack_require__.p = "/";
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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getBuffer\", function() { return getBuffer; });\nconst getBuffer = (ctx, impulseURL) => {\n    return fetch(impulseURL)\n    .then( res => res.arrayBuffer())\n    .then( arrayBuffer => ctx.decodeAudioData(arrayBuffer)\n    );\n};\n\n//# sourceURL=webpack:///./get_buffer.js?");

/***/ }),

/***/ "./grain.js":
/*!******************!*\
  !*** ./grain.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Grain {\n    constructor(c, buffer, reverbBus, startTime) {\n        this.context = c;\n        this.now = this.context.currentTime;\n        this.source = this.context.createBufferSource();\n        this.source.buffer = buffer;\n        this.attack = Math.random() * 0.3;\n        this.sustain = Math.random() * 0.2;\n        this.release = Math.random() * 0.05;\n        this.playbackSampleStart = startTime; \n\n        this.bus = this.context.createGain();\n        // this.source.connect(this.bus);\n        this.source.connect(reverbBus);\n        this.bus.connect(this.context.destination);\n\n        this.playGrain();\n    }\n\n    playGrain() {\n        this.source.start(this.now, Math.random() * 0.5 + this.playbackSampleStart + 3, this.attack + this.sustain + this.release);\n        this.bus.gain.setValueAtTime(0, this.now);\n        \n        this.bus.gain.linearRampToValueAtTime(100, this.now + this.attack);\n        this.bus.gain.linearRampToValueAtTime(0, this.now + this.attack + this.sustain + this.release - 0.0025);\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Grain);\n\n//# sourceURL=webpack:///./grain.js?");

/***/ }),

/***/ "./virtual_synth.js":
/*!**************************!*\
  !*** ./virtual_synth.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _grain_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grain.js */ \"./grain.js\");\n/* harmony import */ var _get_buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get_buffer */ \"./get_buffer.js\");\n\n\n\n\nwindow.AudioContext = window.AudioContext || window.webkitAudioContext;\n\n\nlet playing = false;\nlet loaded = false;\nlet isGranulating = false;\nlet timer = 1;\nlet timerId;\nlet source;\nlet buffer;\nlet mouse = {\n    x: null,\n    y: null\n};\nlet inside = false;\nlet isMouseOver = false;\nlet timeout;\nlet color = [0, 212, 212];\nlet colorClock = 0;\n\n\nconst c = new AudioContext();\nconst master = c.createGain();\nconst masterbus = c.createGain();\nconst reverbBus = c.createGain();\nlet rad = 2;\nlet Q = 1;\n\nconst bandpass = new BiquadFilterNode(c, {\n    type: 'bandpass',\n    frequency: 500,\n    Q: Q,\n    gain: 200,\n});\n\nconst notch = new BiquadFilterNode(c, {\n    type: 'notch',\n    frequency: 1500,\n    Q: 100,\n});\n\nconst analyser = new AnalyserNode(c, {\n    fftSize: 2048,\n    maxDecibles: -30,\n    minDecibels: -100,\n    smoothingTimeConstant: 0.97\n});\n\n\nlet convolver;\n\nfunction playGrains() {\n    const grain = new _grain_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](c, buffer, reverbBus, timer);\n    timeout = window.setTimeout(playGrains, Math.random() * 275);\n}\n\nasync function setReverb() {\n    convolver = c.createConvolver();\n    convolver.buffer = await Object(_get_buffer__WEBPACK_IMPORTED_MODULE_1__[\"getBuffer\"])(c, '/assets/audio/large_hall.wav');\n    \n    reverbBus.connect(convolver)\n    .connect(bandpass)\n    .connect(notch)\n    .connect(master);\n    reverbBus.gain.setValueAtTime(2, c.currentTime);\n}\n\nsetReverb();\n\nmasterbus.connect(master);\nmaster.connect(analyser);\nanalyser.connect(c.destination);\n\nlet revBuffer;\n\nasync function initBuffer() {\n    buffer = await Object(_get_buffer__WEBPACK_IMPORTED_MODULE_1__[\"getBuffer\"])(c, '/assets/audio/reverie.mp3');\n    revBuffer = await Object(_get_buffer__WEBPACK_IMPORTED_MODULE_1__[\"getBuffer\"])(c, '/assets/audio/reverie.mp3');\n    Array.prototype.reverse.call(revBuffer.getChannelData(0));\n    Array.prototype.reverse.call(revBuffer.getChannelData(1));\n    loaded = true;\n}\n\ninitBuffer();\n\n\n\n\nconst canvas = document.getElementById(\"sphere\");\n\nconst ctx = canvas.getContext('2d');\nlet width = canvas.offsetWidth;\nlet height = canvas.offsetHeight;\n\ncanvas.addEventListener('click', function () {\n    const bus = c.createGain();\n\n    if (!playing) {\n        source = c.createBufferSource();\n        source.buffer = buffer;\n        source.start(c.currentTime, timer);\n        source.connect(bus);\n\n        bus.gain.linearRampToValueAtTime(1.2, c.currentTime + 3);\n        bus.connect(masterbus);\n\n        playing = true;\n\n        timerId = window.setInterval(() => {\n            if (!isMouseOver) timer++;\n        }, 1000);\n\n        document.getElementById('header-container').className = \"header-container fade-out\";\n\n    } else {\n        bus.gain.linearRampToValueAtTime(0, c.currentTime + 0.5);\n        source.stop(c.currentTime + 0.5);\n        playing = false;\n        window.clearInterval(timerId);\n        document.getElementById('header-container').className = \"header-container fadeIn\";\n    }\n});\n\ncanvas.addEventListener('mousemove', (e) => {\n    const radius = 200;\n    mouse.x = e.x;\n    mouse.y = e.y;\n});\n\n\nfunction onResize() {\n    width = canvas.offsetWidth;\n    height = canvas.offsetHeight;\n    if (window.devicePixelRatio > 1) {\n        canvas.width = canvas.clientWidth * 2;\n        canvas.height = canvas.clientHeight * 2;\n        ctx.scale(2, 2);\n    } else {\n        canvas.width = width;\n        canvas.height = height;\n    }\n}\n\nwindow.addEventListener('resize', onResize);\nonResize();\n\n\n\nconst sphereBack = document.getElementById(\"sphere-background\");\n\nsphereBack.addEventListener('mouseenter', e => {\n    isMouseOver = true;\n    if (playing){\n        playGrains();\n        masterbus.gain.linearRampToValueAtTime(0, c.currentTime + 1);\n    }\n});\n\nsphereBack.addEventListener('mouseleave', e => {\n    document.getElementById('header-container').className += \" fadeIn\";\n    isMouseOver = false;\n    if (playing){\n        masterbus.gain.linearRampToValueAtTime(1, c.currentTime + 1);\n        window.clearTimeout(timeout);\n    }\n});\n\nsphereBack.addEventListener('mousemove', (e) => {\n    const radius = 200;\n    mouse.x = e.x;\n    mouse.y = e.y;\n});\n\n\n\n\nlet PERSPECTIVE = width * 0.8;\nlet PROJECTION_CENTER_X = width / 2;\nlet PROJECTION_CENTER_Y = height / 2;\nconst PARTICLE_RADIUS = 1.6;\nlet GLOBE_RADIUS = 40;\nlet particles = [];\nlet repulsedParticles = [];\n\nclass Particle {\n    constructor({analyser, theta, phi, x, y, z, rad, timer}) {\n        this.analyser = analyser;\n\n        this.theta = theta || Math.random() * 2 * Math.PI;\n        this.phi = phi || Math.acos((Math.random() * 2) - 1);\n\n        this.x = x || 0;\n        this.y = y || 0;\n        this.z = z || 0;\n\n        this.xProjected = x || 0; \n        this.yProjected = y || 0;\n        this.scaleProjected = z || 0;\n        this.rad = rad || 0; \n        this.timer = timer || 0;\n    }\n\n    project() {\n        const dataArray = new Float32Array(this.analyser.frequencyBinCount);        \n        this.analyser.getFloatFrequencyData(dataArray);\n\n        this.rad = this.rad || (Math.pow(dataArray[12] + 75, 3/2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 1.65)); \n        rad = this.rad || (Math.pow(dataArray[12] + 75, 3 / 2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 1.65));\n        GLOBE_RADIUS = this.rad;\n        this.rad = (rad < 150 && rad !== 2) ? 150 : this.rad;\n        \n        // Projection translation from 2d to 3d from:\n        // https://www.basedesign.com/blog/how-to-render-3d-in-2d-canvas\n        this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);\n        this.y = GLOBE_RADIUS * Math.cos(this.phi);\n        this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_RADIUS;\n\n        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);\n        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;\n        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;\n    }\n\n    draw() {\n        if (loaded){\n            this.rotate();\n        } else {\n            this.phi = this.z < 0 ? this.phi + 1.01 * Math.sqrt(this.phi * 0.0002) : this.phi - 1.01 * Math.sqrt(this.phi * 0.0002);\n        }\n        this.project();\n        //opacity based on distance\n        ctx.globalAlpha = Math.abs(1 - this.z / width);\n\n        ctx.beginPath();\n        //x, y ,r, angle-start, angle-end\n        ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);\n\n        ctx.fillStyle = `rgb(${color})`;\n        ctx.fill();\n    }\n\n    rotate() {\n        this.theta = this.z < 0 ? this.theta + 0.03 : this.theta - 0.03;\n        this.phi = this.z < 0 ? this.phi + 1.01 * Math.sqrt(this.phi * 0.0002) : this.phi - 1.01 * Math.sqrt(this.phi * 0.0002) ;\n    }\n\n    deflect() {\n        // this.phi = this.phi + 0.5;\n        this.theta = this.theta + 0.04;\n        this.rad = this.rad + 8;\n        this.project();\n\n        ctx.globalAlpha = Math.abs(1 - this.z / width);\n\n        ctx.beginPath();\n        //x, y ,r, angle-start, angle-end\n        ctx.arc(this.xProjected, this.yProjected, PARTICLE_RADIUS * this.scaleProjected, 0, Math.PI * 2);\n\n        // ctx.fillStyle = 'rgb(0, 212, 212)';\n        ctx.fillStyle = `rgb(${color})`;\n        ctx.fill();\n    }\n}\n\n\nlet density = 30;\n\nconst play = new Image();\nplay.src = \"./assets/images/play_icon_hero.png\";\nconst pause = new Image();\npause.src = \"./assets/images/pause.png\";\n\nfunction draw(ctx, img, x, y, w, h){\n    if (!img.complete) {\n        setTimeout(() => {\n            draw(ctx, img);\n        }, 500);\n        return;\n    } else {\n        ctx.drawImage(img, x, y, w, h);\n    }\n}\n\nfunction render(params) {\n    const { ctx } = params;\n    const r = 0;\n    let g = 212;\n    let b = 212; \n    color = [r, g, b];\n    ctx.clearRect(0, 0, width, height);\n\n    //play and pause button\n    if (loaded) {\n        if (playing) {\n            draw(ctx, pause, width / 2 - 37.5, height - 105, 75, 50);\n        } else {\n            draw(ctx, play, width / 2 - 75, height - 130, 150, 100);\n        }\n \n        density = 1300;\n        if (!particles.length) {\n            inside = false;\n            particles = [];\n            for (let i = particles.length; i < density; i++) {\n                particles.push(new Particle({ analyser }));\n            }\n        } else {\n            const preParticles = Array.from(particles);\n            particles = [];\n            for (let i = 0; i < preParticles.length; i++) {\n                if (mouse.x - preParticles[i].xProjected < 10 &&\n                    mouse.x - preParticles[i].xProjected > -10 &&\n                    mouse.y - preParticles[i].yProjected < 10 &&\n                    mouse.y - preParticles[i].yProjected > -10) {\n                    inside = true;\n                   \n                    repulsedParticles.push(new Particle({\n                        analyser: analyser,\n                        theta: preParticles[i].theta,\n                        phi: preParticles[i].phi,\n                        x: preParticles[i].x,\n                        y: preParticles[i].y,\n                        z: preParticles[i].z,\n                    }));\n                    particles.push(new Particle({ analyser, rad: 0 }));\n                \n                } else {\n                    const rad = inside ? preParticles[i].rad : 0; \n                    particles.push(new Particle({\n                        analyser: analyser, \n                        theta: preParticles[i].theta,\n                        phi: preParticles[i].phi,\n                        x: preParticles[i].x, \n                        y: preParticles[i].y, \n                        z: preParticles[i].z,\n                    }));\n                }\n            }  \n        }\n    } \n\n    \n    for (let i = 0; i < particles.length; i++){\n        particles[i].project();\n    }\n\n    //sort particles by their z index \n    particles.sort((dot1, dot2) => {\n        return dot1.sizeProjection - dot2.sizeProjection;\n    });\n\n    if (loaded) {\n        for (let i = 0; i < particles.length; i++) {\n            particles[i].draw();\n        }\n\n        for (let i = 0; i < repulsedParticles.length; i++) {\n            repulsedParticles[i].timer++;\n            repulsedParticles[i].deflect();\n        }\n    }\n\n    //garbage collect particles at 200 frames;\n    repulsedParticles = repulsedParticles.filter(particle => particle.timer < 200);\n\n    // granulate();\n    colorClock++;\n    window.requestAnimationFrame(() => render({ ctx }));\n}\n\nfunction init() {\n    window.requestAnimationFrame(() => render({ ctx }));\n}\n\n\n\n\n\nfunction setStart() {\n    const bus = c.createGain();\n    source = c.createBufferSource();\n    source.buffer = buffer;\n    source.start(c.currentTime, timer);\n    source.connect(bus);\n    bus.gain.linearRampToValueAtTime(1.2, c.currentTime + 1);\n    bus.connect(masterbus);\n    playing = true;\n    timerId = window.setInterval(() => {\n        timer++;\n    }, 1000);\n}\n\n\n\nconst aboutPage = document.getElementById(\"about-page\");\naboutPage.addEventListener('click', e => {\n    aboutPage.className = \"about-page fade-out\";\n    aboutPage.childNodes.forEach(node => {\n        node.className += \" fade-out\";\n    });\n    document.getElementById('header-container').className += \" fadeIn\";\n});\n\n\ninit();\n\n\n//# sourceURL=webpack:///./virtual_synth.js?");

/***/ })

/******/ });