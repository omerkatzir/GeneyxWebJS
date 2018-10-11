let camera, scene, renderer;
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

class Cube {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.geom = new THREE.CubeGeometry(1, 0.5, 0.1, 1, 1, 1);
    // let randNum = Math.floor(Math.random() * 4);
    this.c = new THREE.Color(0x333333);

    // let rand = Math.floor(Math.random() * 7);

    // if (rand == 0) {
    //   c.copy(Colors.pink);
    // } else if (rand == 1) {
    //   c.copy(Colors.yellow);
    // } else if (rand == 2) {
    //   c.copy(Colors.green);
    // } else {
    //   c.copy(Colors.blue);
    // }

    this.mat = new THREE.MeshBasicMaterial({ color: this.c });
    let cubeMesh = new THREE.Mesh(this.geom, this.mat);

    this.mesh.add(cubeMesh);
  }
}

init();
animate();

function vec2to3(vector2) {
  let vec3 = new THREE.Vector3();
  vec3.set(vector2.x, vector2.y, 0);
  console.log(vec3);
  return vec3;
}

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, -400, 600);
  var controls = new THREE.OrbitControls(camera);
  controls.target.set(0, 0, 0);
  controls.update();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  var loader = new THREE.FontLoader();
  loader.load('js/json/Montserrat_Regular.json', function(font) {
    var message = 'GENEYXXX';
    var shapes = font.generateShapes(message, 20);

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
    let pointsOfC = [];
    for (var i = 0; i < shapes.length; i++) {
      var shape = shapes[i];
      var points = [];
      for (let g = 0; g < 60; g++) {
        let testtest = shape.getPoint(g / 60);
        if (i == shapes.length - 2) {
          let startpoint = new THREE.Vector2(-18, -24);
          testtest.add(startpoint);
          pointsOfC.push(testtest);
        } else if (i == shapes.length - 1) {
          let startpoint = new THREE.Vector2(-36 - 18, 24);
          testtest.add(startpoint);
          pointsOfC.push(testtest);
        } else if (i == shapes.length - 3 || i == shapes.length - 4) {
          pointsOfC.push(testtest);
        }
        points.push(testtest);
      }
      for (let p = 0; p < points.length; p++) {
        let vec3 = vec2to3(points[p]);
        let cubeCopy = new Cube();
        let randScale = Math.random() * 2 + 1;
        cubeCopy.mesh.scale.set(randScale, randScale, randScale);
        cubeCopy.mesh.position.copy(vec3);

        if (pointsOfC.includes(points[p])) {
          let rand = Math.floor(Math.random() * 7);

          if (rand == 0) {
            cubeCopy.mat.color.copy(Colors.pink);
          } else if (rand == 1) {
            cubeCopy.mat.color.copy(Colors.yellow);
          } else if (rand == 2) {
            cubeCopy.mat.color.copy(Colors.green);
          } else {
            cubeCopy.mat.color.copy(Colors.blue);
          }
        }

        scene.add(cubeCopy.mesh);
      }
    }
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  renderer.render(scene, camera);
}
