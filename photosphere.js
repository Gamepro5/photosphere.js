'use strict';
// Created by Gamepro5 @ https://gamepro5.github.io
// Depends on three.js

function isTouchDevice() {
  return 'ontouchstart' in document.documentElement;
};

function LoadPhotosphere(equirectangularImagePath, canvasID) {
  this.canvas = document.querySelector('#' + canvasID); // what id the canvas tag needs to have for it to append it to
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

  if (isTouchDevice()) {
    this.touchDevice = true;
  } else {
    this.touchDevice = false;
  };

  let oldTouchMoveEvent;
  let fingerMoved = false;

  document.addEventListener('touchstart', (event) => {
    this.touchDevice = true;
    this.stopPan = true;
    this.touchDown = true;
    this.fingerMoveX = 0;
    this.fingerMoveY = 0;
    if (!selectedCanvas || selectedCanvas !== this.canvas) {
      this.camera.fov = 50;
      this.camera.updateProjectionMatrix();
      selectedCanvas = this.canvas;
    };
  });
  document.addEventListener('touchend', (event) => {
    this.touchDown = false;
    oldTouchMoveEvent = undefined;
  });


  document.addEventListener('touchmove', (event) => {
    if (oldTouchMoveEvent !== undefined) {
      this.fingerMoveX = (event.targetTouches[0].pageX - oldTouchMoveEvent.targetTouches[0].pageX);
      this.fingerMoveY = (event.targetTouches[0].pageY - oldTouchMoveEvent.targetTouches[0].pageY);
    } else {
      this.fingerMoveX = 0;
      this.fingerMoveY = 0;
    };
    oldTouchMoveEvent = event;
    if (((oldMouseEvent === undefined) || (event.targetTouches[0].pageX - oldTouchMoveEvent.targetTouches[0].pageX === 0)) && ((oldMouseEvent === undefined) || (event.targetTouches[0].pageY - oldTouchMoveEvent.targetTouches[0].pageY === 0))) {
      fingerMoved = true;
    } else {
      fingerMoved = false;
    };
  });

  document.addEventListener('keydown', (event) => {

      switch (event.key) {
          case '+':
              this.plusPressed = true;
          break;
          case '_':
              this.underscorePressed = true;
          break;
          case ')':
              this.closeingParenthesePressed = true;
          break;
      }
  });
  document.addEventListener('keyup', (event) => {

      switch (event.key) {
          case '+':
          case '=':
              this.plusPressed = false;
          break;
          case '_':
          case '-':
              this.underscorePressed = false;
          break;
          case ')':
          case '0':
              this.closeingParenthesePressed = false;
          break;
      }
  });

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
  let oldMouseEvent;
  let mouseMoved;
  this.mouseMoveX = 0;
  this.mouseMoveY = 0;
  this.canvas.addEventListener('mousemove', (event) => {
    this.mouseMoveX = event.movementX;
    this.mouseMoveY = event.movementY;
    if ((oldMouseEvent === undefined || (event.screenX - oldMouseEvent.screenX === 0)) && (oldMouseEvent === undefined || event.screenY - oldMouseEvent.screenY === 0)) {
    mouseMoved = true;
  } else {
    mouseMoved = false;
  };
    oldMouseEvent = event;
  });
//end of from the Duel Cubes engine :)
let direction = 1;
let instance = this;

  function render() {
    requestAnimationFrame(render);

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
        if (mouseMoved) {
          instance.camera.rotation.y -= instance.mouseMoveX / 700;
          instance.camera.rotation.x -= instance.mouseMoveY / 700;
          if (instance.camera.rotation.x > Math.PI / 2) instance.camera.rotation.x = Math.PI / 2;
          else if (instance.camera.rotation.x < -Math.PI / 2) instance.camera.rotation.x = -Math.PI / 2;
          mouseMoved = false;
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
        if (fingerMoved) {
            instance.camera.rotation.y += instance.fingerMoveX / 250;
            instance.camera.rotation.x += instance.fingerMoveY / 250;
            if (instance.camera.rotation.x > Math.PI / 2) instance.camera.rotation.x = Math.PI / 2;
            else if (instance.camera.rotation.x < -Math.PI / 2) instance.camera.rotation.x = -Math.PI / 2;
            fingerMoved = false;
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
  requestAnimationFrame(render);

};
