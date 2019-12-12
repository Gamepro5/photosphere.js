# photosphere.js
A WebGL library for displaying photospheres in a canvas.

# Features
You use your mouse to turn your head just like in a first person shooter, and while holding down shift, clicking the plus key will zoom, minus will zoom out, and zero will set it back to default zoom.

# How to use
You can use this library by linking the [three.js](https://threejs.org/) library and then linking this library. Then create a canvas.
```html
<canvas id="canvasID">Maybe put an error message here? It will get overwritten by the canvas once it loads.</canvas>
```
Then use the following function:
```js
new LoadPhotosphere(equirectangularImagePath, canvasID);
```
It may be better practice to set the object created by the above function to a variable, that way you can access the objects methods.
```js
photosphere = new LoadPhotosphere(equirectangularImagePath, canvasID);
```
# Methods
```js
photosphere.methodExample();
```
This library currently only has and needs only one method. This method is the terminate method. It properly disposes of everything initialized when you called `LoadPhotosphere` by destroying all WebGL contexts, removing the instance's event listeners, and cancels the main loop (the requestAnimationFrame).
```js
photosphere.terminate();
```
Then empty the useless shell of an object.
```js
photosphere = undefined;
```
Or if you didn't use 'let', 'const', or 'var' and just declared the variable "photosphere" as-is, you can delete it properly. (this is the recommended fancy way)
```js
delete window.photosphere;
```
It's as if it never existed in the first place!
# Example
```html
<canvas id="photosphere"><div class="js_error"><b>ERROR:</b> JavaScript programs need JavaScript to be enabled to run. You shouldn't be surprised by this.</div></canvas> <!---canvas for the first photosphere--->
<canvas id="photosphere2"><div class="js_error"><b>ERROR:</b> JavaScript programs need JavaScript to be enabled to run. You shouldn't be surprised by this.</div></canvas> <!---canvas for the second photosphere--->

<script src="/js/libraries/three.js"></script><script src="/js/photosphere.js"></script> <!---load libraries--->
<script>photosphere = new LoadPhotosphere('/images/photospheres/the_hike_on_which_we_got_lost.jpg', 'photosphere')</script> <!---js for the first photosphere--->
<script>photosphere2 = new LoadPhotosphere('/images/photospheres/the_mineshaft_entrance.jpg', 'photosphere2')</script> <!---js for the second photosphere--->
```
Live examples [here](https://gamepro5.github.io/virtual_reality).

# Download
I like to keep this nice and simple, so just copy-paste [this code](https://github.com/Gamepro5/photosphere.js/blob/master/build/photosphere.js) into a new JavaScript file called `photosphere.js`.

The minimized file can be found [here](https://github.com/Gamepro5/photosphere.js/blob/master/build/photosphere_min.js) (better for performance).

Too lazy to download the three.js library? Just use my [standalone version](https://github.com/Gamepro5/photosphere.js/blob/master/build/photosphere_standalone.js) of photosphere.js where I include the three.js build it uses in the same file, all minimized, of course.
