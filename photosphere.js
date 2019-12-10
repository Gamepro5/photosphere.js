'use strict';
// Created by Gamepro5 @ https://gamepro5.github.io
// Depends on three.js

function isTouchDevice() {
  return 'ontouchstart' in document.documentElement;
};

function LoadPhotosphere(equirectangularImagePath, canvasID) {

  this.canvas = document.querySelector('#' + canvasID); // what id the canvas tag needs to have for it to append it to
  this.canvas.style.touchAction = "none";
  this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
	this.renderer.setPixelRatio( window.devicePixelRatio );
  this.rect = this.canvas.getBoundingClientRect();
	this.renderer.setSize(this.rect.width, this.rect.height, false);

  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera( 50, this.rect.width / this.rect.height, 1, 1100 ); // fov used to be 75
  this.scene.add(this.camera);

  this.camera.rotation.order = 'YXZ';

  this.geometry = new THREE.SphereBufferGeometry( 500, 60, 60 ); //used to be 60, 40 segments
  this.geometry.position = new THREE.Vector3( 0, 0, 0 );
	// invert the geometry on the x-axis so that all of the faces point inward
	this.geometry.scale( - 1, 1, 1 );
	this.texture = new THREE.TextureLoader().load( equirectangularImagePath );
	this.material = new THREE.MeshBasicMaterial( { map: this.texture } );
	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.scene.add( this.mesh );

  this.stopPan = false;
  let selectedCanvas;

  let instance = this;

  if (isTouchDevice()) {
    this.touchDevice = true;
  } else {
    this.touchDevice = false;
  };


  let pointerMoved = false;
  this.pointerMoveX = 0;
  this.pointerMoveY = 0;

  function pointerdownEvent(that, event) {
    that.pointerDown = true;
    if (that.touchDevice === true) {
      that.stopPan = true;
      if (!selectedCanvas || selectedCanvas !== that.canvas) {
        that.camera.fov = 50;
        that.camera.updateProjectionMatrix();
        selectedCanvas = that.canvas;
      };
    };
  };
  const pointerdownHandleEvent = (event) => {
    pointerdownEvent(this, event);
  };
  document.addEventListener('pointerdown', pointerdownHandleEvent);


  function pointermoveEvent(that, event) {
    if (that.touchDevice === true) {
      that.pointerMoveX = event.movementX;
      that.pointerMoveY = event.movementY;
      if ((event.movementX !== undefined || event.movementX !== 0) && (event.movementY !== undefined || event.movementY !== 0)) {
        pointerMoved = true;
      } else {
        pointerMoved = false;
      };
    } else {
      that.pointerMoveX = event.movementX;
      that.pointerMoveY = event.movementY;
      if ((event.movementX !== undefined || event.movementX !== 0) && (event.movementY !== undefined || event.movementY !== 0)) {
        pointerMoved = true;
      } else {
        pointerMoved = false;
      };
    };
  };
  const pointermoveHandleEvent = (event) => {
    pointermoveEvent(this, event);
  };
  document.addEventListener('pointermove', pointermoveHandleEvent);


  function pointerupEvent(that, event) {
    that.pointerDown = false;
  };
  const pointerupHandleEvent = (event) => {
    pointerupEvent(this, event);
  };
  document.addEventListener('pointerup', pointerupHandleEvent);


  function keydownEvent(that, event) {
    switch (event.key) {
        case '+':
            that.plusPressed = true;
        break;
        case '_':
            that.underscorePressed = true;
        break;
        case ')':
            that.closeingParenthesePressed = true;
        break;
    };
  };
  const keydownHandleEvent = (event) => {
    keydownEvent(this, event);
  };
  document.addEventListener('keydown', keydownHandleEvent);


  function keyupEvent(that, event) {
    switch (event.key) {
        case '+':
        case '=':
            that.plusPressed = false;
        break;
        case '_':
        case '-':
            that.underscorePressed = false;
        break;
        case ')':
        case '0':
            that.closeingParenthesePressed = false;
        break;
    };
  };
  const keyupHandleEvent = (event) => {
    keyupEvent(this, event);
  };
  document.addEventListener('keyup', keyupHandleEvent);

//from the Duel Cubes engine
  this.canvas.onclick = () => {
    if (this.touchDevice === false) {
      if (!document.pointerLockElement || document.pointerLockElement !== this.canvas) {
        this.camera.fov = 50;
        this.camera.updateProjectionMatrix();
      };
      this.canvas.requestPointerLock();
      if (this.camera.rotation.x > Math.PI / 2) this.camera.rotation.x = Math.PI / 2;
      else if (this.camera.rotation.x < -Math.PI / 2) this.camera.rotation.x = -Math.PI / 2;
    } else {
      if (!selectedCanvas || selectedCanvas !== this.canvas) {
        this.camera.fov = 50;
        this.camera.updateProjectionMatrix();
        selectedCanvas = this.canvas;
      };
      if (this.camera.rotation.x > Math.PI / 2) this.camera.rotation.x = Math.PI / 2;
      else if (this.camera.rotation.x < -Math.PI / 2) this.camera.rotation.x = -Math.PI / 2;
    };
  };
//end of from the Duel Cubes engine :)

let direction = 1;
let lastAnimationID;
  function render() {
    lastAnimationID = window.requestAnimationFrame(render);

    if (!instance.touchDevice) {
      if (!document.pointerLockElement || document.pointerLockElement !== instance.canvas) {
        instance.camera.rotation.x += 0.01;
        instance.camera.rotation.y += 0.01;
        if (instance.camera.fov <= 1) {
          instance.camera.fov = 1;
          instance.camera.updateProjectionMatrix();
          direction = 1;
        } else if (instance.camera.fov >= 179) {
          instance.camera.fov = 179;
          instance.camera.updateProjectionMatrix();
          direction = -1;
        };
        instance.camera.fov = instance.camera.fov + direction;
        instance.camera.updateProjectionMatrix();
      } else {
        if (pointerMoved) {
          instance.camera.rotation.y -= instance.pointerMoveX / 700;
          instance.camera.rotation.x -= instance.pointerMoveY / 700;
          if (instance.camera.rotation.x > Math.PI / 2) instance.camera.rotation.x = Math.PI / 2;
          else if (instance.camera.rotation.x < -Math.PI / 2) instance.camera.rotation.x = -Math.PI / 2;
          pointerMoved = false;
        };

        if (instance.plusPressed) {
          if (instance.camera.fov === 0) {
            instance.camera.fov = 1;
            instance.camera.updateProjectionMatrix();
          } else if (instance.camera.fov > 1) {
            instance.camera.fov -= 1;
            instance.camera.updateProjectionMatrix();
          };
        };
        if (instance.underscorePressed) {
           if (instance.camera.fov === 180) {
             instance.camera.fov = 179;
             instance.camera.updateProjectionMatrix();
           } else if (instance.camera.fov < 178) {
             instance.camera.fov += 1;
             instance.camera.updateProjectionMatrix();
           };
        };
        if (instance.closeingParenthesePressed) {
          instance.camera.fov = 50;
          instance.camera.updateProjectionMatrix();
        };
      };
    } else {
      if (instance.stopPan) {
        if (pointerMoved) {
            instance.camera.rotation.y += instance.pointerMoveX / 250;
            instance.camera.rotation.x += instance.pointerMoveY / 250;
            if (instance.camera.rotation.x > Math.PI / 2) instance.camera.rotation.x = Math.PI / 2;
            else if (instance.camera.rotation.x < -Math.PI / 2) instance.camera.rotation.x = -Math.PI / 2;
            pointerMoved = false;
        };
      } else {
          instance.camera.rotation.x += 0.01;
          instance.camera.rotation.y += 0.01;
          if (instance.camera.fov <= 1) {
            instance.camera.fov = 1;
            instance.camera.updateProjectionMatrix();
            direction = 1;
          } else if (instance.camera.fov >= 179) {
            instance.camera.fov = 179;
            instance.camera.updateProjectionMatrix();
            direction = -1;
          };
          instance.camera.fov = instance.camera.fov + direction;
          instance.camera.updateProjectionMatrix();
        };
      };

    instance.renderer.render(instance.scene, instance.camera);

  };
  window.requestAnimationFrame(render);

  this.terminate = function() {
    window.cancelAnimationFrame(lastAnimationID);
    document.removeEventListener('pointerdown', pointerdownHandleEvent);
    document.removeEventListener('pointermove', pointermoveHandleEvent);
    document.removeEventListener('pointerup', pointerupHandleEvent);
    document.removeEventListener('keydown', keydownHandleEvent);
    document.removeEventListener('keyup', keyupHandleEvent);
    instance.renderer.clear(true, true, true);
    instance.renderer.dispose();
    instance.geometry.dispose();
  	instance.texture.dispose();
  	instance.material.dispose();
    instance.canvas.onclick = undefined;
    //console.log('instance termination complete');
  };
};
