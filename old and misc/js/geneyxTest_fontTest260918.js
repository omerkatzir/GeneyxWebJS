let columns = 13; //24;
let lines = 35;
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

let testContainer, testContainer2, testContainer3;

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
let controls; // = new THREE.OrbitControls();
// let containerStyle = getComputedStyle(container, null);
// HEIGHT = parseInt(containerStyle.getPropertyValue('height'));
// WIDTH = parseInt(containerStyle.getPropertyValue('width'));

window.addEventListener('load', init, false);
window.addEventListener('scroll', handeleScroll, false);

function createScene() {
  container = document.getElementById('world');
  testContainer = document.getElementById('testDNA');
  testContainer2 = document.getElementById('firstContainer');
  testContainer3 = document.getElementById('testDNA2');
  HEIGHT = container.clientHeight;
  WIDTH = container.clientWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 55;
  nearPlane = 0.1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
  let camPos = new THREE.Vector3(0, 0, 10);
  camera.position.copy(camPos);
  clock = new THREE.Clock();
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);

  // scene.fog = new THREE.Fog(0xffffff, 10, 12.5);

  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
  HEIGHT = container.clientHeight;
  WIDTH = container.clientWidth;
  // HEIGHT = window.innerHeight;
  // WIDTH = window.innerWidth;

  // HEIGHT = parseInt(containerStyle.getPropertyValue('height'));
  // WIDTH = parseInt(containerStyle.getPropertyValue('width'));

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
    // let pointvec = new THREE.Vector3(2, 2, 2);
    let point = spiralCurve(
      0,
      Math.PI,
      0,
      10 * Math.PI,
      -1.1,
      1.2,
      i / cubes.length,
      true
    );
    if (i % 4 == 0) {
      point = YtoZ(point);
      let pointvec = new THREE.Vector3(5, 0, 0);
      point.add(pointvec);
      pointsOfBall.push(pointvec);
    } else if (i % 3 == 0) {
      point = YtoZ(point);
      let pointvec = new THREE.Vector3(0, 2, 0);
      point.add(pointvec);
      pointsOfBall.push(pointvec);
    } else if (i % 2 == 0) {
      point = YtoZ(point);
      let pointvec = new THREE.Vector3(-0, -3, 0);
      point.add(pointvec);
      pointsOfBall.push(pointvec);
    } else {
      point = YtoZ(point);
      let pointvec = new THREE.Vector3(-5, 0, 0);
      point.add(pointvec);

      pointsOfBall.push(pointvec);
      // point = XtoY(point);
    }
    // point.add(pointvec);

    cubes[i].mesh.position.copy(point);
    // pointsOfBall.push(point);
    // camera.position.z = 30;
  }

  // let ballGeometry = new THREE.BufferGeometry().setFromPoints(pointsOfBall);
  // let ballMaterial = new THREE.LineBasicMaterial({ color: Colors.grey });

  // // Create the final object to add to the scene
  // let ballOBJ = new THREE.Line(ballGeometry, ballMaterial);
  // scene.add(ballOBJ);
}

class Cube {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.geom = new THREE.PlaneGeometry(0.37 * 1.4, 0.1 * 1.4); // new THREE.CubeGeometry(0.37 * 1.4, 0.1 * 1.4, 0.1 * 1.4, 1, 1, 1); //new THREE.PlaneGeometry(0.37 * 1.4, 0.1 * 1.4);
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
    this.progress = Math.random(); //0.25;
    this.duration = 5;
    this.clock = new THREE.Clock(true);

    // this.isSelected = false;
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

function chunkArray(myArray, chunk_size) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}

function testDraw() {
  var loader = new THREE.FontLoader();
  loader.load(
    'https://rawgit.com/omerkatzir/15006d61e8bd2bfdfb494111cb4fb1cb/raw/0309f1227b05650c43f022c53fd8c8c736e852b9/NewFont_Regular.json',
    function(font) {
      var message = 'A';
      var shapes = font.generateShapes(message, 11);

      var holeShapes = [];
      for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        if (shape.holes && shape.holes.length > 0) {
          for (var j = 0; j < shape.holes.length; j++) {
            var hole = shape.holes[j];
            holeShapes.push(hole);
          }
        }
      }
      shapes.push.apply(shapes, holeShapes);
      let chunksize = Math.floor(cubes.length / shapes.length) + 1;
      let cubeLetterArrays = chunkArray(cubes, chunksize);
      // console.log(cubeLetterArrays.length);

      for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        var points = [];
        for (let g = 0; g < cubeLetterArrays[i].length; g++) {
          let testtest = shape.getPoint(g / cubeLetterArrays[i].length);
          let staertingpoint = new THREE.Vector2(-3.5, -4);
          testtest.add(staertingpoint);
          points.push(testtest);
        }
        for (let p = 0; p < points.length; p++) {
          let vec3 = vec2to3(points[p]);
          let cubeCopy = cubeLetterArrays[i][p];
          let cParent = new CircleAnimator();
          scene.add(cParent.mesh);
          cParent.mesh.position.copy(cubeCopy.mesh.position);
          cParent.mesh.add(cubeCopy.mesh);
          cParent.myCube = cubeCopy;
          cubeCopy.mesh.position.set(0, 0, 0);
          if (!cubeCopy.isHole) {
            cubeCopy.mat.opacity = 1;
          }

          // cubeCopy.clock.start();
          // cubeCopy.duration = Math.random() * 2 + 1;
          cubeCopy.randRad = 0.2;
          cParent.mesh.position.copy(vec3);
          // scene.add(cubeCopy.mesh);
        }
      }
      cubes.length = 0;

      var merged = [].concat.apply([], cubeLetterArrays);

      cubes = merged;
      console.log(cubes.length);
    }
  );
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

class LineOBJ {
  constructor(start, end) {
    this.startPoint = start;
    this.endPoint = end;
    this.lineGeom = new THREE.Geometry();
    this.lineGeom.vertices.push(this.startPoint);
    this.lineGeom.vertices.push(this.endPoint);
    let lineMat = new THREE.LineBasicMaterial({
      color: Colors.grey,
    });
    this.mesh = new THREE.Line(this.lineGeom, lineMat);
  }
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
    let Pos = cubes[i].orgPos;
    cubes[i].isCirc = true;

    let _nextPos = new THREE.Vector3();
    if (i % 2 == 0) {
      _nextPos.copy(
        spiralCurve(_R, _R, _startD, _endD, _minY, _maxY, Math.random(), false)
      );
    } else {
      _nextPos.copy(
        spiralCurve(_R, _R, _endD, _endD * 2, _minY, _maxY, Math.random(), false)
      );
    }
    let circAnim;
    if (cubes[i].mesh.parent.isCircleAnimator) {
      circAnim = cubeParents[i];
    } else {
      circAnim = new CircleAnimator();
      scene.add(circAnim.mesh);
      circAnim.mesh.add(cubes[i].mesh);
      cubeParents.push(circAnim);
      circAnim.mesh.position.copy(Pos);
      circAnim.myCube = cubes[i];
    }

    cubes[i].mesh.position.set(0, 0, 0);

    circAnim.duration = Math.random() * 3 + 1;
    circAnim.startTime = clock.getElapsedTime();

    circAnim.nextPos.copy(_nextPos);
    circAnim.animatingCube = true;

    cubes[i].duration = Math.random() * (5 - 2) + 2;
    isDna = true;
  }
}

function UnmakeDna() {
  //DNA spiral values
  let _R = 1.4;
  let _startD = 0;
  let _endD = 3 * Math.PI;
  let _maxY = 4.5;
  let _minY = -4.5;

  finishedGoingBack = 0;
  isGoingBack = true;
  for (let i = 0; i < cubes.length; i++) {
    let Pos = cubes[i].orgPos;

    cubes[i].clock.stop();
    let circAnim;
    if (cubes[i].mesh.parent.isCircleAnimator) {
      circAnim = cubeParents[i];
    } else {
      circAnim = new CircleAnimator();
      scene.add(circAnim.mesh);
      circAnim.mesh.add(cubes[i].mesh);
      cubeParents.push(circAnim);
      circAnim.mesh.position.copy(Pos);
      circAnim.myCube = cubes[i];
    }

    circAnim.duration = circAnim.duration = Math.random() * 3 + 1;
    circAnim.startTime = clock.getElapsedTime();
    circAnim.nextPos.copy(cubes[i].orgPos);

    circAnim.animatingCube = true;
    cubes[i].isCirc = false;
    isDna = false;
  }
}

function init() {
  createScene();
  controls = new THREE.OrbitControls(camera, container);
  DrawTheCube();
  testDraw();
  // testDrawSpiral();
  loop();
}

function isInViewport(element) {
  let rect = element.getBoundingClientRect();
  let html = document.documentElement;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || html.clientHeight) &&
    rect.right <= (window.innerWidth || html.clientWidth)
  );
}

let numofpresses = 0;
document.addEventListener('keydown', onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  let keyCode = event.which;
  if (keyCode == 32) {
  }

  if (numofpresses == 0) {
    MakeDna();
    numofpresses += 1;
  } else {
    UnmakeDna();
    numofpresses = 0;
  }
}

function handeleScroll() {
  if (isInViewport(testContainer) && !isDna) {
    // if (numofpresses == 0) {
    MakeDna();
    numofpresses = 1;
    // }
  }
  if (isInViewport(testContainer2) && numofpresses == 1) {
    // if (numofpresses == 0) {
    UnmakeDna();
    numofpresses = 0;
    // }

    // }
    // let keyCode = event.which;
    // if (keyCode == 32) {
  }
  if (isInViewport(testContainer3) && numofpresses == 1) {
    asNeeded();
    numofpresses = 2;
  }
  if (isInViewport(testContainer) && numofpresses == 2) {
    unAsNeeded();
    numofpresses = 1;
  }
}
let isAsNeeded = false;
let selectedCubes = [];
function asNeeded() {
  selectedCubes.length = 0;

  let randNumbers = [];
  for (let r = 0; r < 55; r++) {
    let randNum = Math.floor(Math.random() * cubes.length);
    randNumbers.push(randNum);
  }

  for (let i = 0; i < cubes.length; i++) {
    if (randNumbers.includes(i) && !cubes[i].isHole) {
      cubes[i].startFloat = cubes[i].mat.opacity;
      cubes[i].endFloat = 1;
      cubes[i].isAnim = false;
      cubes[i].isCubeAppearing = true;
    } else {
      cubes[i].startFloat = cubes[i].mat.opacity;
      cubes[i].endFloat = 0.12;
      cubes[i].isAnim = false;
      cubes[i].isCubeAppearing = true;
    }
  }
  isAsNeeded = true;
  finishedAppear = 0;
}

function unAsNeeded() {
  for (let i = 0; i < cubes.length; i++) {
    cubes[i].startFloat = cubes[i].mat.opacity;
    cubes[i].endFloat = 1;
    cubes[i].isAnim = false;
    cubes[i].isCubeAppearing = true;
  }
  isAsNeeded = false;
  finishedAppear = 0;
}

function loop() {
  controls.update();
  renderer.render(scene, camera);

  // if (finishedAppear < cubes.length) {
  //   for (let i = 0; i < cubes.length; i++) {
  //     cubes[i].CubeAppear();
  //   }
  // }

  // if (isDna) {
  //   if (finishedDNA < cubes.length) {
  //     for (let i = 0; i < cubes.length; i++) {
  //       cubeParents[i].moveCube();
  //     }
  //   }
  //   console.log(cubes.length);
  for (let i = 0; i < cubes.length; i++) {
    // // cubes[i].mesh.lookAt(camera.position);
    // if (cubes[i].isCirc) {

    cubes[i].Walker();
  }
  //   }
  // } else {
  //   if (isGoingBack) {
  //     if (finishedGoingBack < cubes.length) {
  //       // && isGoingBack) {
  //       for (let i = 0; i < cubes.length; i++) {
  //         cubeParents[i].moveCube();
  //       }
  //     } else {
  //       isGoingBack = false;
  //     }
  //   }
  // }

  requestAnimationFrame(loop);
}
