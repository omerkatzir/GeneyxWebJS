let titleDiv,
  genomeAsset,
  ourCostumers,
  dGRP,
  geneyxExperience,
  scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  container,
  clock,
  hand,
  HEIGHT,
  WIDTH,
  columns = 13,
  lines = 35,
  startX = -4.3,
  startY = 4.52094,
  x_move = 0.718,
  y_move = -0.266,
  cubes = [],
  cubeParents = [],
  Colors = {
    blue: new THREE.Color(4214137),
    pink: new THREE.Color(15817347),
    yellow: new THREE.Color(16432404),
    green: new THREE.Color(8243056),
    grey: new THREE.Color('grey'),
    white: new THREE.Color('white'),
  },
  isDna = !1,
  finishedAppear = 0,
  finishedDNA = 0,
  isGoingBack = !1,
  finishedGoingBack = 0,
  isHand = !1,
  handStartTime = 0,
  handduration = 0.35,
  handTimer = 0,
  handStartOpacity = 0,
  handEndOpacity = 1;
function createScene() {
  (container = document.getElementById('world')),
    (titleDiv = document.getElementById('heroHeading')),
    (genomeAsset = document.getElementById('genomeAsset')),
    (ourCostumers = document.getElementById('ourCostumers')),
    (dGRP = document.getElementById('dGRP')),
    (geneyxExperience = document.getElementById('geneyxExperience')),
    (HEIGHT = container.clientHeight),
    (WIDTH = container.clientWidth),
    (scene = new THREE.Scene()),
    (aspectRatio = WIDTH / HEIGHT),
    (fieldOfView = 55),
    (nearPlane = 0.1),
    (farPlane = 1e4),
    (camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane));
  let e = new THREE.Vector3(0, 0, 10);
  camera.position.copy(e),
    (clock = new THREE.Clock()),
    (renderer = new THREE.WebGLRenderer({ alpha: !0, antialias: !0 })).setSize(
      WIDTH,
      HEIGHT
    ),
    CreateHand(),
    (scene.fog = new THREE.Fog(16777215, 10, 12.5)),
    container.appendChild(renderer.domElement),
    window.addEventListener('resize', handleWindowResize, !1);
}
function handleWindowResize() {
  (HEIGHT = container.clientHeight),
    (WIDTH = container.clientWidth),
    renderer.setSize(WIDTH, HEIGHT),
    (camera.aspect = WIDTH / HEIGHT),
    camera.updateProjectionMatrix();
}
function spiralCurve(e, t, n, i, s, a, o, r) {
  let c, l;
  (o = THREE.Math.clamp(o, 0, 1)),
    r
      ? ((l = c = THREE.Math.lerp(e, t, o)), (c = 0.5 * (a - s) * Math.sin(l)))
      : (c = THREE.Math.lerp(e, t, o));
  let h = THREE.Math.lerp(n, i, o),
    d = THREE.Math.lerp(s, a, o),
    m = c * Math.cos(h),
    u = c * Math.sin(h);
  return new THREE.Vector3(m, d, u);
}
window.addEventListener('load', init, !1),
  window.addEventListener('scroll', handeleScroll, !1);
class Cube {
  constructor() {
    (this.mesh = new THREE.Object3D()),
      (this.geom = new THREE.PlaneGeometry(0.518, 0.1 * 1.4)),
      (this.mat = new THREE.MeshBasicMaterial({ color: Colors.blue })),
      (this.mat.transparent = !0),
      (this.mat.opacity = 0);
    let e = new THREE.Mesh(this.geom, this.mat);
    this.mesh.add(e),
      (this.isHole = !1),
      (this.randRad = Math.random() * (0.55 - 0.2) + 0.2),
      (this.isAnim = !1),
      (this.isCubeAppearing = !0),
      (this.timer = 0),
      (this.startTime = clock.getElapsedTime()),
      (this.randTimer = 2.5 * Math.random()),
      (this.startFloat = 0),
      (this.endFloat = 1),
      (this.orgPos = new THREE.Vector3()),
      (this.isCirc = !1),
      (this.progress = Math.random()),
      (this.duration = 5),
      (this.clock = new THREE.Clock(!1));
  }
  Walker() {
    (this.progress += this.clock.getDelta() / this.duration),
      this.progress >= 1 && (this.progress -= 1);
    let e = this.FindCirclePos(this.progress);
    this.mesh.position.copy(e);
  }
  FindCirclePos(e) {
    return spiralCurve(this.randRad, this.randRad, 0, 2 * Math.PI, 0, 0, e, !1);
  }
  CubeAppear() {
    if (this.isCubeAppearing)
      if (this.isHole) (finishedAppear += 1), (this.isCubeAppearing = !1);
      else if (this.isAnim) {
        (this.timer = 0), (this.timer = (clock.getElapsedTime() - this.startTime) / 0.35);
        let e = THREE.Math.lerp(this.startFloat, this.endFloat, this.timer);
        (this.mat.opacity = e),
          this.timer >= 1 && ((finishedAppear += 1), (this.isCubeAppearing = !1));
      } else
        (this.timer = (clock.getElapsedTime() - this.startTime) / this.randTimer),
          this.timer >= 1 &&
            ((this.startTime = clock.getElapsedTime()),
            (this.timer = 0),
            (this.isAnim = !0));
  }
}
function DrawTheCube() {
  for (let e = 0; e < columns; e++)
    for (let t = 0; t < lines; t++) {
      let n = new THREE.Vector3(startX + e * x_move, startY + t * y_move, 0),
        i = new Cube();
      i.mesh.position.copy(n), i.orgPos.copy(n);
      let s = Math.floor(8 * Math.random());
      0 == s
        ? i.mat.color.copy(Colors.pink)
        : 1 == s
          ? i.mat.color.copy(Colors.yellow)
          : 2 == s
            ? i.mat.color.copy(Colors.green)
            : s >= 3 && s < 6
              ? i.mat.color.copy(Colors.blue)
              : s >= 6 && (i.mat.color.copy(Colors.white), (i.isHole = !0)),
        scene.add(i.mesh),
        cubes.push(i);
    }
}
function hideHand() {
  (handStartOpacity = hand.children[0].material.opacity),
    (handEndOpacity = 0),
    (handStartTime = clock.getElapsedTime()),
    (isHand = !0);
}
function MakeBall() {
  for (let e = 0; e < cubes.length; e++) {
    cubes[e].clock.start();
    let t = new THREE.Vector3();
    t.copy(cubes[e].mesh.position), (cubes[e].isCirc = !0);
    let n,
      i = new THREE.Vector3(0, 0.5, 1.5),
      s = spiralCurve(0, Math.PI, 0, 12 * Math.PI, -1.9, 1.9, e / cubes.length, !0);
    (s = YtoZ(s)).add(i),
      cubes[e].mesh.parent.isCircleAnimator
        ? (n = cubeParents[e])
        : ((n = new CircleAnimator()),
          scene.add(n.mesh),
          n.mesh.add(cubes[e].mesh),
          cubeParents.push(n),
          n.mesh.position.copy(t),
          (n.myCube = cubes[e])),
      cubes[e].mesh.position.set(0, 0, 0),
      (n.duration = 3 * Math.random() + 1),
      (n.startTime = clock.getElapsedTime()),
      n.nextPos.copy(s),
      (n.animatingCube = !0),
      (cubes[e].duration = 3 * Math.random() + 2),
      (isDna = !0);
  }
  (handStartTime = clock.getElapsedTime()),
    (handStartOpacity = 0),
    (handEndOpacity = 1),
    (isHand = !0);
}
function CreateHand() {
  (hand = new THREE.Group()),
    new THREE.SVGLoader().load(
      'https://rawgit.com/omerkatzir/b6104ab42f66f3aebfec810d06451589/raw/c6ede3c6ad164e2dc5d29dcbf07355aad74eb94a/hand.svg',
      function(e) {
        hand.scale.multiplyScalar(0.02),
          (hand.position.x = -3.9),
          (hand.position.y = -1.4),
          (hand.scale.y *= -1);
        for (let t = 0; t < e.length; t++) {
          let n = e[t],
            i = new THREE.MeshBasicMaterial({
              color: n.color,
              side: THREE.DoubleSide,
              depthWrite: !1,
              transparent: !0,
            }),
            s = n.toShapes(!0);
          for (let e = 0; e < s.length; e++) {
            let t = s[e],
              n = new THREE.ShapeBufferGeometry(t),
              a = new THREE.Mesh(n, i);
            hand.add(a);
          }
        }
        (hand.children[0].material.opacity = 0), scene.add(hand);
      }
    );
}
function vec2to3(e) {
  let t = new THREE.Vector3();
  return t.set(e.x, e.y, 0), t;
}
function YtoZ(e) {
  let t = new THREE.Vector3();
  return t.set(e.x, e.z, e.y), t;
}
function XtoY(e) {
  let t = new THREE.Vector3();
  return t.set(e.y, e.x, e.z), t;
}
class CircleAnimator {
  constructor() {
    (this.mesh = new THREE.Object3D()),
      (this.mesh.isCircleAnimator = !0),
      (this.animatingCube = !1),
      (this.duration = 1),
      (this.startTime = 0),
      (this.nextPos = new THREE.Vector3()),
      (this.myCube = 0);
  }
  moveCube() {
    if (this.animatingCube) {
      let e = (clock.getElapsedTime() - this.startTime) / this.duration;
      this.mesh.position.lerp(this.nextPos, e),
        isGoingBack && this.myCube.mesh.position.lerp(new THREE.Vector3(0, 0, 0), e),
        e >= 1 &&
          (isDna ? (finishedDNA += 0) : (finishedGoingBack += 0),
          (this.animatingCube = !1));
    }
  }
}
let positions = [];
function gatherPositions() {
  new THREE.FontLoader().load(
    'https://rawgit.com/omerkatzir/2537b94f2b08f44314139a2b26538bd2/raw/f2485a5b9a49f1eb0c28a53b268d48fc691ab914/Montserrat_Regular.json',
    function(e) {
      let t = cubes.length / 4,
        n = e.generateShapes('YXXX', 4),
        i = [];
      for (let e = 0; e < n.length; e++) {
        let t = n[e];
        if (t.holes && t.holes.length > 0)
          for (let e = 0; e < t.holes.length; e++) {
            let n = t.holes[e];
            i.push(n);
          }
      }
      n.push.apply(n, i);
      for (let e = 0; e < n.length; e++) {
        let i = n[e];
        for (let n = 0; n < t; n++) {
          let s = vec2to3(i.getPoint(n / t)),
            a = new THREE.Vector3(-3.8, -2.1, -5);
          if ((s.add(a), 1 == e)) {
            let e = new THREE.Vector3(0.7, 0, 0);
            s.add(e);
          }
          if (2 == e) {
            let e = new THREE.Vector3(-3, -4.7, 0);
            s.add(e);
          }
          if (3 == e) {
            let e = new THREE.Vector3(-10.8, 4.7, 0);
            s.add(e);
          }
          positions.push(s);
        }
      }
    }
  );
}
function MakeYX() {
  (hand.children[0].material.opacity = 0), (scene.fog.far = 1e3), (finishedDNA = 0);
  for (let e = 0; e < cubes.length; e++) {
    (cubes[e].randRad = 0.2 * Math.random() + 0.2), cubes[e].clock.start();
    let t = new THREE.Vector3();
    t.copy(cubes[e].mesh.position), (cubes[e].isCirc = !0);
    let n,
      i = new THREE.Vector3();
    i.copy(positions[e]),
      cubes[e].mesh.parent.isCircleAnimator
        ? (n = cubeParents[e])
        : ((n = new CircleAnimator()),
          scene.add(n.mesh),
          n.mesh.add(cubes[e].mesh),
          cubeParents.push(n),
          n.mesh.position.copy(t),
          (n.myCube = cubes[e])),
      cubes[e].mesh.position.set(0, 0, 0),
      (n.duration = 3 * Math.random() + 1),
      (n.startTime = clock.getElapsedTime()),
      n.nextPos.copy(i),
      (n.animatingCube = !0),
      (cubes[e].duration = 3 * Math.random() + 2),
      (isDna = !0);
  }
}
function MakeDna() {
  let e = 3 * Math.PI;
  (finishedDNA = 0), (scene.fog.far = 12.5);
  for (let t = 0; t < cubes.length; t++) {
    cubes[t].clock.start(), (cubes[t].randRad = Math.random() * (0.55 - 0.2) + 0.2);
    let n = new THREE.Vector3();
    n.copy(cubes[t].mesh.position), (cubes[t].isCirc = !0);
    let i,
      s = new THREE.Vector3();
    if (
      (t % 2 == 0
        ? s.copy(spiralCurve(1.4, 1.4, 0, e, -4.5, 4.5, Math.random(), !1))
        : s.copy(spiralCurve(1.4, 1.4, e, 2 * e, -4.5, 4.5, Math.random(), !1)),
      cubes[t].mesh.parent.isCircleAnimator)
    ) {
      i = cubeParents[t];
      let e = new THREE.Vector3();
      cubes[t].mesh.getWorldPosition(e), i.mesh.position.copy(e);
    } else
      (i = new CircleAnimator()),
        scene.add(i.mesh),
        i.mesh.add(cubes[t].mesh),
        cubeParents.push(i),
        i.mesh.position.copy(n),
        (i.myCube = cubes[t]);
    cubes[t].mesh.position.set(0, 0, 0),
      (i.duration = 3 * Math.random() + 1),
      (i.startTime = clock.getElapsedTime()),
      i.nextPos.copy(s),
      (i.animatingCube = !0),
      (cubes[t].duration = 3 * Math.random() + 2),
      (isDna = !0);
  }
}
function UnmakeDna() {
  Math.PI;
  (finishedGoingBack = 0), (isGoingBack = !0);
  for (let e = 0; e < cubes.length; e++) {
    let t,
      n = cubes[e].orgPos;
    cubes[e].clock.stop(),
      cubes[e].mesh.parent.isCircleAnimator
        ? (t = cubeParents[e])
        : ((t = new CircleAnimator()),
          scene.add(t.mesh),
          t.mesh.add(cubes[e].mesh),
          cubeParents.push(t),
          t.mesh.position.copy(n),
          (t.myCube = cubes[e])),
      (t.duration = t.duration = 3 * Math.random() + 1),
      (t.startTime = clock.getElapsedTime()),
      t.nextPos.copy(cubes[e].orgPos),
      (t.animatingCube = !0),
      (cubes[e].isCirc = !1),
      (isDna = !1);
  }
}
function init() {
  window.innerWidth >= 768 && (createScene(), DrawTheCube(), gatherPositions(), loop());
}
function isInViewport(e) {
  let t = e.getBoundingClientRect(),
    n = document.documentElement;
  return (
    t.top >= 0 &&
    t.left >= 0 &&
    t.bottom <= (window.innerHeight || n.clientHeight) &&
    t.right <= (window.innerWidth || n.clientWidth)
  );
}
let numofpresses = 0;
function handeleScroll() {
  window.innerWidth >= 768 &&
    (isInViewport(titleDiv) && 1 == numofpresses && (UnmakeDna(), (numofpresses = 0)),
    isInViewport(genomeAsset) && !isDna && (MakeDna(), (numofpresses = 1)),
    isInViewport(ourCostumers) && 1 == numofpresses && (MakeBall(), (numofpresses = 2)),
    isInViewport(dGRP) &&
      2 == numofpresses &&
      (hideHand(), UnmakeDna(), (numofpresses = 3)),
    isInViewport(genomeAsset) &&
      2 == numofpresses &&
      (hideHand(), MakeDna(), (numofpresses = 1)),
    isInViewport(geneyxExperience) && 3 == numofpresses && (MakeYX(), (numofpresses = 4)),
    isInViewport(dGRP) && 4 == numofpresses && (UnmakeDna(), (numofpresses = 3)),
    isInViewport(ourCostumers) && 3 == numofpresses && (MakeBall(), (numofpresses = 2)));
}
function loop() {
  if ((renderer.render(scene, camera), finishedAppear < cubes.length))
    for (let e = 0; e < cubes.length; e++) cubes[e].CubeAppear();
  if (
    (isHand &&
      ((handTimer = (clock.getElapsedTime() - handStartTime) / handduration),
      (hand.children[0].material.opacity = THREE.Math.lerp(
        handStartOpacity,
        handEndOpacity,
        handTimer
      )),
      handTimer >= 1 && (isHand = !1)),
    isDna)
  ) {
    if (finishedDNA < cubes.length)
      for (let e = 0; e < cubes.length; e++) cubeParents[e].moveCube();
    for (let e = 0; e < cubes.length; e++) cubes[e].isCirc && cubes[e].Walker();
  } else if (isGoingBack)
    if (finishedGoingBack < cubes.length)
      for (let e = 0; e < cubes.length; e++) cubeParents[e].moveCube();
    else isGoingBack = !1;
  requestAnimationFrame(loop);
}
