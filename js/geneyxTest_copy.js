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

  // blue: new THREE.Color(0x29abe2),
  // pink: new THREE.Color(0xe02b70),
  // yellow: new THREE.Color(0xffe600),
  // green: new THREE.Color(0x2be089),
  // grey: new THREE.Color('grey'),
  // white: new THREE.Color('white'),
};

let StoreTheWholeGenome, GeneticBigData, OnlyAsNeeded, gdpr;

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
// let controls; // = new THREE.OrbitControls();
// let containerStyle = getComputedStyle(container, null);
// HEIGHT = parseInt(containerStyle.getPropertyValue('height'));
// WIDTH = parseInt(containerStyle.getPropertyValue('width'));

window.addEventListener('load', init, false);
window.addEventListener('scroll', handeleScroll, false);

function createScene() {
  container = document.getElementById('world');
  StoreTheWholeGenome = document.getElementById('StoreTheWholeGenome');
  GeneticBigData = document.getElementById('GeneticBigData');
  OnlyAsNeeded = document.getElementById('OnlyAsNeeded');
  gdpr = document.getElementById('GDPR');
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

  scene.fog = new THREE.Fog(0xffffff, 10, 12.5);
  // scene.fog.

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
    let pointvec = new THREE.Vector3(0, 0.5, 1.5);
    let point = spiralCurve(
      0,
      Math.PI,
      0,
      12 * Math.PI,
      -1.9,
      1.9,
      i / cubes.length,
      true
    );
    // if (i % 4 == 0) {
    point = YtoZ(point);
    // let pointvec = new THREE.Vector3(5, 0, 0);
    point.add(pointvec);
    pointsOfBall.push(pointvec);
    // } else if (i % 3 == 0) {
    //   point = YtoZ(point);
    //   let pointvec = new THREE.Vector3(0, 2, 0);
    //   point.add(pointvec);
    //   pointsOfBall.push(pointvec);
    // } else if (i % 2 == 0) {
    //   point = YtoZ(point);
    //   let pointvec = new THREE.Vector3(-0, -3, 0);
    //   point.add(pointvec);
    //   pointsOfBall.push(pointvec);
    // } else {
    //   point = YtoZ(point);
    //   let pointvec = new THREE.Vector3(-5, 0, 0);
    //   point.add(pointvec);

    //   pointsOfBall.push(pointvec);
    //   // point = XtoY(point);
    // }
    // point.add(pointvec);

    cubeParents[i].mesh.position.copy(point);
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
    this.clock = new THREE.Clock(false);

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

let positions = [];
function gatherPositions() {
  let loader = new THREE.FontLoader();
  loader.load(
    'https://rawgit.com/omerkatzir/15006d61e8bd2bfdfb494111cb4fb1cb/raw/0309f1227b05650c43f022c53fd8c8c736e852b9/NewFont_Regular.json',
    function(font) {
      let cubesnum = cubes.length / 2;
      let message = 'A';
      let shapes = font.generateShapes(message, 17);
      let holeShapes = [];
      for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i];
        if (shape.holes && shape.holes.length > 0) {
          for (let j = 0; j < shape.holes.length; j++) {
            let hole = shape.holes[j];
            holeShapes.push(hole);
          }
        }
      }
      shapes.push.apply(shapes, holeShapes);
      for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i];
        for (let g = 0; g < cubesnum; g++) {
          let positionPoint = shape.getPoint(g / cubesnum);
          let vec3 = vec2to3(positionPoint);
          let move = new THREE.Vector3(-7.2, -6, -5);
          vec3.add(move);
          positions.push(vec3);
        }

        // let points = [];
      }
      // console.log(shapes.length);
      // shapesOut = [].concat.apply([], shapes);
    }
  );
}
function MakeShield() {
  scene.fog.far = 1000;
  // console.log(shapesOut.length);
  finishedDNA = 0;
  // gatherPositions();
  for (let i = 0; i < cubes.length; i++) {
    cubes[i].clock.start();
    let Pos = new THREE.Vector3();
    Pos.copy(cubes[i].mesh.position);
    cubes[i].isCirc = true;

    let _nextPos = new THREE.Vector3();
    _nextPos.copy(positions[i]);

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

    circAnim.duration = Math.random() * 3 + 1;
    circAnim.startTime = clock.getElapsedTime();

    circAnim.nextPos.copy(_nextPos);
    circAnim.animatingCube = true;

    cubes[i].duration = Math.random() * (5 - 2) + 2;
    isDna = true;
  }
}

function UnmakeDna() {
  scene.fog.far = 12.5;

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

function createHand() {
  let hand = new THREE.Group();
  let SVGloader = new THREE.SVGLoader();
  SVGloader.load('js/hand.svg', function(paths) {
    hand.scale.multiplyScalar(0.02);
    hand.position.x = -3.9;
    hand.position.y = -1.4;
    hand.scale.y *= -1;

    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];

      let material = new THREE.MeshBasicMaterial({
        color: path.color,
        side: THREE.DoubleSide,
        depthWrite: false,
        transparent: true,
      });

      let shapes = path.toShapes(true);

      for (let j = 0; j < shapes.length; j++) {
        let shape = shapes[j];

        let geometry = new THREE.ShapeBufferGeometry(shape);
        let mesh = new THREE.Mesh(geometry, material);

        hand.add(mesh);
      }
    }

    scene.add(hand);
  });
}

function init() {
  createScene();
  DrawTheCube();
  MakeDna();
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
    testDrawSpiral();
  }
}
//     if (numofpresses == 0) {
//       MakeDna();
//       numofpresses += 1;
//     } else if (numofpresses == 1) {
//       asNeeded();

//       numofpresses += 1;
//     } else if (numofpresses == 2) {
//       unAsNeeded();
//       MakeShield();
//       numofpresses += 1;
//     } else if (numofpresses == 3) {
//       MakeDna();
//       asNeeded();
//       numofpresses += 1;
//     } else if (numofpresses == 4) {
//       unAsNeeded();
//       numofpresses += 1;
//     } else {
//       UnmakeDna();
//       numofpresses = 0;
//     }
//     // else {
//     // asNeeded();
//     // numofpresses += 1;
//   }
//   // }
// }

// testContainer = document.getElementById('StoreTheWholeGenome');
// testContainer2 = document.getElementById('GeneticBigData');
// testContainer3 = document.getElementById('OnlyAsNeeded');

function handeleScroll() {
  if (isInViewport(StoreTheWholeGenome) && !isDna) {
    // if (numofpresses == 0) {
    MakeDna();
    numofpresses = 1;
    // }
  }
  if (isInViewport(GeneticBigData) && numofpresses == 1) {
    // if (numofpresses == 0) {
    UnmakeDna();
    numofpresses = 0;
    // }

    // }
    // let keyCode = event.which;
    // if (keyCode == 32) {
  }
  if (isInViewport(OnlyAsNeeded) && numofpresses == 1) {
    asNeeded();
    numofpresses = 2;
  }
  if (isInViewport(StoreTheWholeGenome) && numofpresses == 2) {
    unAsNeeded();
    numofpresses = 1;
  }
  if (isInViewport(gdpr) && numofpresses == 2) {
    unAsNeeded();
    MakeShield();
    numofpresses = 3;
  }
  if (isInViewport(OnlyAsNeeded) && numofpresses == 3) {
    MakeDna();
    asNeeded();
    numofpresses = 2;
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
  // controls.update();
  renderer.render(scene, camera);

  if (finishedAppear < cubes.length) {
    for (let i = 0; i < cubes.length; i++) {
      cubes[i].CubeAppear();
    }
  }

  if (isDna) {
    if (finishedDNA < cubes.length) {
      for (let i = 0; i < cubes.length; i++) {
        cubeParents[i].moveCube();
      }
    }
    for (let i = 0; i < cubes.length; i++) {
      // cubes[i].mesh.lookAt(camera.position);
      if (cubes[i].isCirc) {
        cubes[i].Walker();
      }
    }
  } else {
    if (isGoingBack) {
      if (finishedGoingBack < cubes.length) {
        // && isGoingBack) {
        for (let i = 0; i < cubes.length; i++) {
          cubeParents[i].moveCube();
        }
      } else {
        isGoingBack = false;
      }
    }
  }

  requestAnimationFrame(loop);
}
