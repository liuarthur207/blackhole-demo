import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import RefractionSphere from './classes/RefractionSphere.js'
import streakURL from './textures/circular_streaks_512.png';
console.log('streakURL:', streakURL);

const el = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(el.clientWidth, el.clientHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;
el.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, el.clientWidth/el.clientHeight, 0.1, 100);
camera.position.set(0, 0, 4);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxDistance = 100
controls.minDistance = 2
scene.background = new THREE.Color('black');

camera.far = 1000;
camera.updateProjectionMatrix();


function addStarDome({scene, camera, count=3000, radius=150, size=0.7}={}){
  const pos = new Float32Array(count*3);
  for (let i=0;i<count;i++){
    const v = new THREE.Vector3().randomDirection()
      .multiplyScalar(radius * (0.9 + 0.1*Math.random()));
    pos[i*3+0]=v.x; pos[i*3+1]=v.y; pos[i*3+2]=v.z;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const mat = new THREE.PointsMaterial({
    size, sizeAttenuation: true, color: 0xffffff,
    transparent: false, depthWrite: false
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  const dome = new THREE.Group();
  dome.add(pts);
  dome.renderOrder = -1000;
  scene.add(dome);

  return () => { dome.position.copy(camera.position); };
}

const updateStars = addStarDome({scene, camera, count: 4000, radius: 200, size: 0.6});

const loader = new THREE.TextureLoader();
const tex = loader.load(streakURL);

tex.wrapS = THREE.ClampToEdgeWrapping;
tex.wrapT = THREE.ClampToEdgeWrapping;
tex.colorSpace = THREE.SRGBColorSpace;

const inner = 0.2, outer = 1.25;
const disk = new THREE.Mesh(
  new THREE.RingGeometry(inner, outer, 256, 1),
  new THREE.MeshBasicMaterial({
    map: tex,
    color: '#ffcc66', 
    side: THREE.DoubleSide,
    transparent: false,
    depthWrite: true,
    depthTest: true,
    opacity: 0.9
  })
);

disk.rotation.x = -0.45;
disk.material.color.setRGB(5, 3, 2);
disk.material.needsUpdate = true;

scene.add(disk);



for (let i = 1; i < 64; i++) {
  const r = 1/Math.pow(i, 0.25);
  let mesh = new RefractionSphere(r, Math.pow((1+i/5000),15), Math.pow((i/64),1.5));
  scene.add(mesh);
}


const geo = new THREE.SphereGeometry(0.15, 64, 32);
const material = new THREE.MeshBasicMaterial({color:'black'});
const hole = new THREE.Mesh(geo, material);
hole.renderOrder = 10000
hole.material.transparent = false;
scene.add(hole);




addEventListener('resize', () => {
  renderer.setSize(el.clientWidth, el.clientHeight);
  camera.aspect = el.clientWidth / el.clientHeight;
  camera.updateProjectionMatrix();
});

const clock = new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  disk.rotation.z += 1.5 * dt;
  controls.update();
  renderer.render(scene, camera);
}
animate();
