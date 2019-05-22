# Granular Synth
[Live Demo](https://granular-synth.herokuapp.com/)

Granular Synth is an interactive audio visual display. Floating particles are displayed on a HTML5 Canvas in conjunction with music. As the user uses their mouse to interact with the particles, the music goes through a granulating process, and the particles fly apart in opposing motion. 

![Image of Granular Synth](https://github.com/pb-nowa/Virtual-Synthesizer/blob/master/assets/screenshots/granular-synth-main.gif)

## Technologies

* Web Audio Api
* HTML5 Canvas

## What is Granular Synthesis?

Granular synthesis is the process of breaking up sound into individual audio samples, usually only a few miliseconds in length. The samples can then be reordered and played at any rate. This is the same process that is used for detuning, resampling, and time-control in audio. When mixed with other digital signal processors(DSP), the sounds can be transformed from chaotic noise into rich and texturally complex musical sounds. 

Granular synthesis can be commonly heard in modern film soundtracks and electronic music. 

## Particle Physics

The visual and interactive part of Granular Synth utilizes HTML5 canvas. Thousands of particles are displayed on the screen flying in general spherical order. As the user mouses over the particles, the particles unwind from their position in the sphere. 

In order to create a 3D effect on a 2d canvas, an algorith is used to convert the (x, y, z) along with theta(horizontal amngular position) and phi(vertical angular position). The algorithm changes partical size and opacity based on the partical's z-index distance from the observer.

As particles are unwound and become invisible to the observer, the motion algorithm garbage-collects the distant particles. If the user mouses away from the main partical sphere, the particles move back into ordered state, and they are also garbage-collected.

![Image of Granular Synth destructuring](https://github.com/pb-nowa/Virtual-Synthesizer/blob/master/assets/screenshots/granular-synth-destructure.gif)

## Partical and musical interaction

The particles display is a visual representation of the granular synthesis process. Each partical can be viewed as an individual audio sample being played back. 
