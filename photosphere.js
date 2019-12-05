'use strict';
//created by Gamepro5, permission required to use.
// depends on three.js

function LoadPhotosphere(path, canvasID) {
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
	this.texture = new THREE.TextureLoader().load( path );
	this.material = new THREE.MeshBasicMaterial( { map: this.texture } );
	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.scene.add( this.mesh );

  document.addEventListener('keydown', (event) => {
    console.log(event);
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
      if (!document.pointerLockElement || document.pointerLockElement !== this.canvas) {
        this.camera.fov = 50;
        this.camera.updateProjectionMatrix();
      };
      this.canvas.requestPointerLock();
      if (this.camera.rotation.x > Math.PI / 2) this.camera.rotation.x = Math.PI / 2;
      else if (this.camera.rotation.x < -Math.PI / 2) this.camera.rotation.x = -Math.PI / 2;

  }

  this.canvas.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement || document.pointerLockElement === this.canvas) {
    this.camera.rotation.y -= event.movementX / 700;
    this.camera.rotation.x -= event.movementY / 700;
    if (this.camera.rotation.x > Math.PI / 2) this.camera.rotation.x = Math.PI / 2;
    else if (this.camera.rotation.x < -Math.PI / 2) this.camera.rotation.x = -Math.PI / 2;
    };
  });
//end of from the Duel Cubes engine :)
let direction = 1;
let instance = this;
  function render() {
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
      console.log(instance.plusPressed);
      if (instance.plusPressed) {
        console.log('e');
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

    instance.renderer.render(instance.scene, instance.camera);

    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);

};
