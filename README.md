# Wavify

Wavify is a simple library to draw animated wave on a website.

_Warning_: It has been notified that the use of this plugin introduce performance issues in limited setups or on some mobile devices.

## Installation

Clone repo or run `npm i @kabaliserv/wavify`.

## Usage

Usage is very simple.

In the html add the following code:

```html
<div id="wave"></div>
```

Then in your JavaScript file add this:

```js
// With Javascript vanilla
const myWave = kbs.wavify('#wave', {
  height: 60,
  bones: 3,
  amplitude: 40,
  position: "top"
  color: 'rgba(150, 97, 255, .8)',
  speed: .25
});

// With NPM
import wavify from '@kabaliserv/wavify';
const myWave = wavify('#wave', {
  height: 60,
  bones: 3,
  amplitude: 40,
  position: "top"
  color: 'rgba(150, 97, 255, .8)',
  speed: .25
});
```

## Option Parameters

| **Property** | **Description**                               | **Default Value**       |
| ------------ | :-------------------------------------------- | :---------------------- |
| color        | CSS color for the wave, can be Hex, rgb, rgba | rgba(255,255,255, 0.20) |
| position     | Position of the wave                          | bottom                  |
| bones        | Number of articulations in the wave           | 3                       |
| speed        | Animation speed                               | 0.15                    |
| height       | Height of the wave from crest to trough       | 200                     |
| amplitude    | Vertical distance wave travels                | 100                     |

## Available Functions

**updateColor**

Will animate wave color to a new value.

Available parameters are :

| **Property** | **Description**                                  | **Default Value** |
| ------------ | :----------------------------------------------- | :---------------- |
| timing       | Duration for transition in seconds               | 1                 |
| color        | CSS color for the wave, can be Hex, rgb, rgba    | original color    |
| onComplete   | A function to be executed on transition complete | null              |

```
myWave.updateColor({
  color: 'rgba(150, 97, 255, .8)'
});

or

myWave.updateColor({
  color: '#FFF',
  timing: 10
});

or

myWave.updateColor({
  color: '#FFF',
  timing: 10,
  onComplete: function(){
    console.log('Transition Complete !')
  }
});
```

**pause**

Will pause current running animation

```
myWave.pause();
```

**play**

Will play current running animation if paused before

```
myWave.play();
```

**kill**

Will kill current animation.

```
myWave.kill();
```

**reboot**

Will reboot animation. New parameters can be provided. Please avoid changing selector, there is no logic reason to do that :D

Refer to configuration options to see available parameters

```
myWave.reboot();

OR

myWave.reboot({
  height: 80,
  bones: 10,
  amplitude: 60,
  color: 'rgba(150, 97, 255, .2)',
  speed: .45
});
```

## Copyright and license

Code released under the [MIT License](https://github.com/peacepostman/wavify/blob/master/LICENSE).

## Credits

Fork of [wavify](https://github.com/peacepostman/wavify).
