(function() {
  let columns = 11; //24;
  let lines = 11;
  let startX = -4.3;
  let startY = 4.52094;
  let x_move = 0.718;
  let y_move = -0.266;
  let cubes = [];
  let cubeParents = [];
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

  let isDna = false;
  let finishedAppear = 0;
  let finishedDNA = 0;
  let isGoingBack = false;
  let finishedGoingBack = 0;

  window.addEventListener('load', init, false);

  function createScene() {
    container = document.getElementById('ourCustomersMobile');
    HEIGHT = container.clientHeight;
    WIDTH = container.clientWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 55;
    nearPlane = 0.1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    let camPos = new THREE.Vector3(0, 0, 5.5);
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

  function spiralCurve(startR, endR, startDeg, endDeg, startY, endY, step, isBall) {
    step = THREE.Math.clamp(step, 0, 1);

    let r, j;
    if (isBall) {
      j = r = THREE.Math.lerp(startR, endR, step);
      r = 0.5 * (endY - startY) * Math.sin(j);
    } else {
      r = THREE.Math.lerp(startR, endR, step);
    }

    let t = THREE.Math.lerp(startDeg, endDeg, step);
    let y = THREE.Math.lerp(startY, endY, step);

    let x = r * Math.cos(t);
    let z = r * Math.sin(t);

    let point = new THREE.Vector3(x, y, z);

    return point;
  }

  function testDrawSpiral() {
    let pointsOfBall = [];
    for (let i = 0; i < cubes.length; i++) {
      let pointvec = new THREE.Vector3(0, 0.5, 1);
      let point = spiralCurve(
        0,
        Math.PI,
        0,
        10 * Math.PI,
        -1.4,
        1.4,
        i / cubes.length,
        true
      );
      point = YtoZ(point);
      point.add(pointvec);
      pointsOfBall.push(pointvec);

      cubeParents[i].mesh.position.copy(point);
    }
  }

  class Cube {
    constructor() {
      this.mesh = new THREE.Object3D();
      this.geom = new THREE.PlaneGeometry(0.37 * 1.4, 0.1 * 1.4);
      this.mat = new THREE.MeshBasicMaterial({ color: Colors.blue });
      this.mat.transparent = true;
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
      this.clock = new THREE.Clock(false);
    }
    Walker() {
      this.progress += this.clock.getDelta() / this.duration;
      if (this.progress >= 1) {
        this.progress -= 1;
      }
      let _pos = this.FindCirclePos(this.progress);
      this.mesh.position.copy(_pos);
    }
    FindCirclePos(t) {
      let posR = spiralCurve(this.randRad, this.randRad, 0, 2 * Math.PI, 0, 0, t, false);
      return posR;
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
          cubeCopy.mat.opacity = 0;
        }
        scene.add(cubeCopy.mesh);
        cubes.push(cubeCopy);
      }
    }
  }

  function vec2to3(vector2) {
    let vec3 = new THREE.Vector3();
    vec3.set(vector2.x, vector2.y, 0);

    return vec3;
  }
  function YtoZ(vector3) {
    let vec3 = new THREE.Vector3();
    vec3.set(vector3.x, vector3.z, vector3.y);

    return vec3;
  }

  function XtoY(vector3) {
    let vec3 = new THREE.Vector3();
    vec3.set(vector3.y, vector3.x, vector3.z);

    return vec3;
  }

  class CircleAnimator {
    constructor() {
      this.mesh = new THREE.Object3D();
      this.mesh.isCircleAnimator = true;

      this.animatingCube = false;
      this.duration = 1;
      this.startTime = 0;
      this.nextPos = new THREE.Vector3();

      this.myCube = 0;
    }
    moveCube() {
      if (this.animatingCube) {
        let _timer = (clock.getElapsedTime() - this.startTime) / this.duration;

        this.mesh.position.lerp(this.nextPos, _timer);
        if (isGoingBack) {
          this.myCube.mesh.position.lerp(new THREE.Vector3(0, 0, 0), _timer);
        }
        if (_timer >= 1) {
          if (isDna) {
            finishedDNA += 0;
          } else {
            finishedGoingBack += 0;
          }
          this.animatingCube = false;
        }
      }
    }
  }

  function MakeDna() {
    //DNA spiral values
    let _R = 1.4;
    let _startD = 0;
    let _endD = 3 * Math.PI;
    let _maxY = 4.5;
    let _minY = -4.5;

    finishedDNA = 0;

    for (let i = 0; i < cubes.length; i++) {
      cubes[i].clock.start();
      let Pos = new THREE.Vector3();
      Pos.copy(cubes[i].mesh.position);
      cubes[i].isCirc = true;

      let circAnim;
      if (cubes[i].mesh.parent.isCircleAnimator) {
        circAnim = cubeParents[i];
        let curWorldPos = new THREE.Vector3();
        cubes[i].mesh.getWorldPosition(curWorldPos);
        circAnim.mesh.position.copy(curWorldPos);
      } else {
        circAnim = new CircleAnimator();
        scene.add(circAnim.mesh);
        circAnim.mesh.add(cubes[i].mesh);
        cubeParents.push(circAnim);
        circAnim.mesh.position.copy(Pos);
        circAnim.myCube = cubes[i];
      }

      cubes[i].mesh.position.set(0, 0, 0);

      cubes[i].duration = Math.random() * (5 - 2) + 2;
      isDna = true;
    }
  }

  function init() {
    if (window.innerWidth <= 767) {
      createScene();
      DrawTheCube();
      MakeDna();
      var group = new THREE.Group();
      var SVGloader = new THREE.SVGLoader();
      SVGloader.load(
        'https://cdn.rawgit.com/omerkatzir/b6104ab42f66f3aebfec810d06451589/raw/c6ede3c6ad164e2dc5d29dcbf07355aad74eb94a/hand.svg',
        function(paths) {
          group.scale.multiplyScalar(0.014);
          group.position.x = -2.6;
          group.position.y = -1;
          group.scale.y *= -1;

          for (var i = 0; i < paths.length; i++) {
            var path = paths[i];

            var material = new THREE.MeshBasicMaterial({
              color: path.color,
              side: THREE.DoubleSide,
              depthWrite: false,
            });

            var shapes = path.toShapes(true);

            for (var j = 0; j < shapes.length; j++) {
              var shape = shapes[j];

              var geometry = new THREE.ShapeBufferGeometry(shape);
              var mesh = new THREE.Mesh(geometry, material);

              group.add(mesh);
            }
          }

          scene.add(group);
        }
      );
      testDrawSpiral();
      loop();
    }
  }

  function loop() {
    renderer.render(scene, camera);

    if (isDna) {
      if (finishedDNA < cubes.length) {
        for (let i = 0; i < cubes.length; i++) {
          cubeParents[i].moveCube();
        }
      }
      for (let i = 0; i < cubes.length; i++) {
        if (cubes[i].isCirc) {
          cubes[i].Walker();
        }
      }
    }

    requestAnimationFrame(loop);
  }
})();
