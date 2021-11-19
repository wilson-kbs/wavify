# Wavify

Wavify is a simple library to draw animated wave on a website.

The library is heavily adapted from a codepen board (https://codepen.io/grimor/pen/qbXLdN).

_Warning_: It has been notified that the use of this plugin introduce performance issues in limited setups or on some mobile devices.

## Installation

NPM:

```cmd
npm install @kabaliser/wavify
```
```cmd
yarn add @kabaliserv/wavify
```

CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/wilson-kbs/wavify@v0.2/lib/wavify.min.js"></script>
```

## Usage

Usage is very simple.

In the html add the following code:

```html
<div id="wave"></div>
```

Then in your JavaScript file add this:

```js
// With Javascript vanilla
const myWave = wavify.default('#wave', {
  height: 60,
  bones: 3,
  amplitude: 40,
  position: "top"
  color: 'rgba(150, 97, 255, .8)',
  speed: .25,
  autostart: false
});

// With NPM
import wavify from '@kabaliserv/wavify';
const myWave = wavify('#wave', {
  height: 60,
  bones: 3,
  amplitude: 40,
  position: "top"
  color: 'rgba(150, 97, 255, .8)',
  speed: .25,
  autostart: false
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
| autostart    | Auto launch wave animation                    | true                    |

## Available Functions

**play**

Will play current running animation if paused before

```
myWave.play();
```

**pause**

Will pause current running animation

```
myWave.pause();
```

## Copyright and license

Code released under the [MIT License](https://github.com/wilson-kbs/wavify/blob/master/LICENSE).

## Credits

Fork of [wavify](https://github.com/peacepostman/wavify).
