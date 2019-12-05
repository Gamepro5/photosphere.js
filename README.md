# Photosphere.js
A WebGL library for displaying photospheres in a canvas

#How to use
You can use this library by calling the [three.js](https://threejs.org/) library and then calling this library. Then create a canvas.
```html
<canvas data-hover="Click to gain control of the camera! While holding shift, you can click on + to zoom, - to zoom out, and 0 to normalise." id="photosphere"></canvas>
```
Then use the following function:
```js
new LoadPhotosphere(equirectangularImagePath, canvasID)
```
#example
```html
<canvas data-hover="Click to gain control of the camera! While holding shift, you can click on + to zoom, - to zoom out, and 0 to normalise." id="photosphere"></canvas> <!---canvas for the first photosphere--->
<canvas data-hover="Click to gain control of the camera! While holding shift, you can click on + to zoom, - to zoom out, and 0 to normalise." id="photosphere"></canvas> <!---canvas for the second photosphere--->

<script src="/js/libraries/three.js"></script><script src="/js/photosphere.js"></script> <!---load libraries--->
<script>new LoadPhotosphere('/images/photospheres/the_hike_on_which_we_got_lost.jpg', 'photosphere')</script> <!---js for the first photosphere--->
<script>new LoadPhotosphere('/images/photospheres/the_mineshaft_entrance.jpg', 'photosphere2')</script> <!---js for the second photosphere--->
```
