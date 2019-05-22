# Granular Synth
[Live Demo](https://granular-synth.herokuapp.com/)

Granular Synth is an interactive audio visual display. Floating particles are displayed on a HTML5 Canvas in synchronicity with music. As the user uses their mouse to interact with the particles, the music goes through a granulating process, and the particles fly apart in opposing motion. 

![Image of Granular Synth](https://github.com/pb-nowa/Virtual-Synthesizer/blob/master/assets/screenshots/granular-synth-main.gif)

## Technologies

* Web Audio Api
* HTML5 Canvas

## What is Granular Synthesis?

Granular synthesis is the process of breaking up sound into individual audio samples, usually only a few miliseconds in length. The samples can then be reordered and played at any rate. This is the same process that is used for detuning, resampling, and time-control in audio. When mixed with other digital signal processors(DSP), the sounds can be transformed from chaotic noise into rich and texturally complex musical sounds. 

Granular synthesis can be commonly heard in modern film soundtracks and electronic music. 

## Particle Physics

The visual and interactive part of Granular Synth utilizes HTML5 canvas. Thousands of particles are displayed on the screen flying in general spherical order. As the user mouses over the particles, the particles unwind from their position in the sphere. 

In order to create a 3D effect on a 2d canvas, an algorith is used to convert the (x, y, z) along with theta(horizontal angular position) and phi(vertical angular position). The algorithm changes partical size and opacity based on the partical's z-index distance from the observer.

```js
  class Particle {
  
    ...
    
    //this function is called anytime a particle is rendered. 
    project() {
        //creates and array of data from the current audio. 
        
        ...
        
        GLOBE_RADIUS = this.rad;
        this.rad = (rad < 150 && rad !== 2) ? 150 : this.rad;
        
        this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);
        this.y = GLOBE_RADIUS * Math.cos(this.phi);
        this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_RADIUS;

        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
    }
  }

```

As particles are unwound and become invisible to the observer, the motion algorithm garbage-collects the distant particles. If the user mouses away from the main partical sphere, the particles move back into ordered state, and they are also garbage-collected.

![Image of Granular Synth destructuring](https://github.com/pb-nowa/Virtual-Synthesizer/blob/master/assets/screenshots/granular-synth-destructure.gif)

## Particle and musical interaction

The particles are a visual representation of the granular synthesis process. Each particle can be viewed as an individual audio sample being played back. (Except that there are only 1300 instead of 12 million.) As the user mouses over the orb, the audio begins to granulate. Visually, this is represented by the unwinding of the particals away from the main sphere. Until the user removes their mouse from the sphere, the audio and sphere will continue to granulate. 

The orb reacts to the current audio source. Through the audio analysis node, the radius of the orb can adjust in real-time to the ebs and flows of the music. The FloatFrequencyData returns the decibel level as a full-scale number (-infinity as the softest signal and 0 as the loudest). Since dB full-scale is represented as a logarithmic response curve to match human hearing, I visually compensate by creating an orb radius floor of 200px, and multiplying the returned bit value exponentially. This also helps to smooth out the visual transitions when there are immediate changes in volume.

```js
  class Particle {
  
    ...
    
    //this function is called anytime a particle is rendered. 
    project() {
        //creates and array of data from the current audio. 
        const dataArray = new Float32Array(this.analyser.frequencyBinCount);        
        this.analyser.getFloatFrequencyData(dataArray);

        this.rad = this.rad || (Math.pow(dataArray[12] + 75, 3/2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 1.65)); 
        rad = this.rad || (Math.pow(dataArray[12] + 75, 3 / 2) > 10000 ? 2 : Math.pow(dataArray[12] + 75, 1.65));
        GLOBE_RADIUS = this.rad;
        this.rad = (rad < 150 && rad !== 2) ? 150 : this.rad;
        
        ...
    }
  }

```
