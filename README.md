# photosphere.js
A WebGL library for displaying photospheres in a canvas.

# Features
You use your mouse to turn your head just like in a first person shooter, and while holding down shift, clicking the plus key will zoom, minus will zoom out, and zero will set it back to default zoom.

# How to use
You can use this library by linking the [three.js](https://threejs.org/) library and then linking this library. Then create a canvas.
```html
<canvas id="photosphere"></canvas>
```
Then use the following function:
```js
new LoadPhotosphere(equirectangularImagePath, canvasID)
```
# Example
```html
<canvas id="photosphere"></canvas> <!---canvas for the first photosphere--->
<canvas id="photosphere2"></canvas> <!---canvas for the second photosphere--->

<script src="/js/libraries/three.js"></script><script src="/js/photosphere.js"></script> <!---load libraries--->
<script>new LoadPhotosphere('/images/photospheres/the_hike_on_which_we_got_lost.jpg', 'photosphere')</script> <!---js for the first photosphere--->
<script>new LoadPhotosphere('/images/photospheres/the_mineshaft_entrance.jpg', 'photosphere2')</script> <!---js for the second photosphere--->
```
Live examples [here](https://gamepro5.github.io/virtual_reality).
