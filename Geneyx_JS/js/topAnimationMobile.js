(function() {
  let columns = 6;
  let lines = 10;
  let startX = -1.8;
  let startY = 1.2;
  let x_move = 0.718;
  let y_move = -0.266;
  let cubes = [];
  let Colors = {
    blue: new THREE.Color(0x404d79),
    pink: new THREE.Color(0xf15a83),
    yellow: new THREE.Color(0xfabd14),
    green: new THREE.Color(0x7dc770),
    grey: new THREE.Color('grey'),
    white: new THREE.Color('white'),
  };

  let scene,
    camera,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    renderer,
    container,
    clock,
    HEIGHT,
    WIDTH;

  let finishedAppear = 0;

  window.addEventListener('load', init, false);

  function createScene() {
    container = document.getElementById('topAnimationMobile');
    HEIGHT = container.clientHeight;
    WIDTH = container.clientWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 55;
    nearPlane = 0.1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    let camPos = new THREE.Vector3(0, 0, 2.5);
    camera.position.copy(camPos);
    clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);

    scene.fog = new THREE.Fog(0xffffff, 10, 12.5);

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
  }

  function handleWindowResize() {
    HEIGHT = container.clientHeight;
    WIDTH = container.clientWidth;

    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }

  class Cube {
    constructor() {
      this.mesh = new THREE.Object3D();
      this.geom = new THREE.PlaneGeometry(0.37 * 1.4, 0.1 * 1.4);
      this.mat = new THREE.MeshBasicMaterial({ color: Colors.blue });
      this.mat.transparent = true;
      this.mat.opacity = 0;
      let cubeMesh = new THREE.Mesh(this.geom, this.mat);

      this.mesh.add(cubeMesh);

      this.isHole = false;

      this.randRad = Math.random() * (0.55 - 0.2) + 0.2;
      this.isAnim = false;
      this.isCubeAppearing = true;
      this.timer = 0;
      this.startTime = clock.getElapsedTime();
      this.randTimer = Math.random() * 2.5;
      this.startFloat = 0;
      this.endFloat = 1;

      this.orgPos = new THREE.Vector3();
      this.isCirc = false;
      this.progress = Math.random();
      this.duration = 5;
    }

    CubeAppear() {
      let animDur = 0.35;
      if (this.isCubeAppearing) {
        if (!this.isHole) {
          if (!this.isAnim) {
            this.timer = (clock.getElapsedTime() - this.startTime) / this.randTimer;
            if (this.timer >= 1) {
              this.startTime = clock.getElapsedTime();
              this.timer = 0;
              this.isAnim = true;
            }
          } else {
            this.timer = 0;
            this.timer = (clock.getElapsedTime() - this.startTime) / animDur;
            let _lerpFloat = THREE.Math.lerp(this.startFloat, this.endFloat, this.timer);

            this.mat.opacity = _lerpFloat; // this.timer;
            if (this.timer >= 1) {
              finishedAppear += 1;
              this.isCubeAppearing = false;
            }
          }
        } else {
          finishedAppear += 1;
          this.isCubeAppearing = false;
        }
      }
    }
  }

  function DrawTheCube() {
    for (let c = 0; c < columns; c++) {
      for (let l = 0; l < lines; l++) {
        let pos = new THREE.Vector3(startX + c * x_move, startY + l * y_move, 0);
        let cubeCopy = new Cube();
        cubeCopy.mesh.position.copy(pos);
        cubeCopy.orgPos.copy(pos);

        let rand = Math.floor(Math.random() * 8);
        if (rand == 0) {
          cubeCopy.mat.color.copy(Colors.pink);
        } else if (rand == 1) {
          cubeCopy.mat.color.copy(Colors.yellow);
        } else if (rand == 2) {
          cubeCopy.mat.color.copy(Colors.green);
        } else if (rand >= 3 && rand < 6) {
          cubeCopy.mat.color.copy(Colors.blue);
        } else if (rand >= 6) {
          cubeCopy.mat.color.copy(Colors.white);
          cubeCopy.isHole = true;
        }
        scene.add(cubeCopy.mesh);
        cubes.push(cubeCopy);
      }
    }
  }

  function init() {
    if (window.innerWidth <= 767) {
      createScene();
      DrawTheCube();
      loop();
    }
  }

  function loop() {
    renderer.render(scene, camera);

    if (finishedAppear < cubes.length) {
      for (let i = 0; i < cubes.length; i++) {
        cubes[i].CubeAppear();
      }
    }

    requestAnimationFrame(loop);
  }
})();
