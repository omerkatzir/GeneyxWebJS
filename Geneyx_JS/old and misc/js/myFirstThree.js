// Our Javascript will go here.

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// var blue = new THREE.Color(0x29abe2);
var Colors = {
  blue: new THREE.Color(0x29abe2),
  //   pink: new THREE.Color(224, 43, 112),
  //   yellow: new THREE.Color(224, 43, 112),
  //   green: new THREE.Color(224, 43, 112),
};

var outline_shader = {
  uniforms: {
    linewidth: { type: 'f', value: 0.05 },
  },
  vertex_shader: [
    'uniform float linewidth;',
    'void main() {',
    'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
    'vec4 displacement = vec4( normalize( normalMatrix * normal ) * linewidth, 0.0 ) + mvPosition;',
    'gl_Position = projectionMatrix * displacement;',
    '}',
  ].join('\n'),
  fragment_shader: [
    'void main() {',
    'gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );',
    '}',
  ].join('\n'),
};

var outline_material = new THREE.ShaderMaterial({
  uniforms: THREE.UniformsUtils.clone(outline_shader.uniforms),
  vertexShader: outline_shader.vertex_shader,
  fragmentShader: outline_shader.fragment_shader,
});

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
shadowLight.position.set(150, 350, 350);
shadowLight.castShadow = true;
scene.add(shadowLight);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = outline_material; //new THREE.MeshBasicMaterial({
// color: Colors.blue,
// });
// material.color.add(blue); //= ;
material.receiveShadow;
var cube = new THREE.Mesh(geometry, material);

var anotherCube = new THREE.Mesh(geometry, material);
anotherCube.position.set(6, 0, 0);
cube.receiveShadow = true;

// scene.add(cube);
// scene.add(anotherCube);

var grp = new THREE.Group();
cube.position.set(3, 3, 3);

grp.add(cube);
grp.add(anotherCube);
scene.add(grp);

camera.position.z = 10;
var controls = new THREE.OrbitControls(camera);
function animate() {
  requestAnimationFrame(animate);
  grp.rotation.x += 0.05;
  grp.rotation.y += 0.01;
  // cube.lookAt(camera.position);
  // anotherCube.lookAt(camera.position);
  // cube.receiveShadow = true;
  // camera.position.z += 0.05;
  controls.update();
  renderer.render(scene, camera);
}

animate();
