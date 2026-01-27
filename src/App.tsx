import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import './App.css';
function App() {
const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.addEventListener('change', () => {
    console.log('Camera position:', camera.position);
});

// const controls = new FirstPersonControls( camera, renderer.domElement );
// controls.movementSpeed = 8;
// controls.lookSpeed = 0.08;

const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = function(_url, loaded, total) {
    if (progressBar) {
        (progressBar as HTMLProgressElement).value = (loaded / total) * 100;
    }
}

// const progressBarContainer = document.querySelector('.progress-bar-container');

// loadingManager.onLoad = function() {
//     if (progressBarContainer) {
//         (progressBarContainer as HTMLElement).style.display = 'none';
//     }
// }

const gltfLoader = new GLTFLoader(loadingManager);

gltfLoader.setMeshoptDecoder(MeshoptDecoder);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

let position = 0;

gltfLoader.load('./modern_apartment_interior/scene.gltf', function(gltf) {
const model = gltf.scene;
    // after loading model
model.scale.set(0.01, 0.01, 0.01);
const box = new THREE.Box3().setFromObject(model);
const center = new THREE.Vector3();
box.getCenter(center);

model.position.sub(center); // move model to (0,0,0)
scene.add(model);
const size = new THREE.Vector3();
box.getSize(size);

camera.position.set(
  26.45,
  3.9, // eye level
  11.5
);

camera.lookAt(0, 2, -1);

    window.addEventListener('mouseup', function() {
        switch(position) {
            case 0:
                moveCamera(0.147, 0.021, -0.0233);
                rotateCamera(0, 0.5, 0);
                position = 1;
                break;
            case 1:
                moveCamera( -0.14414,0.024279,-0.097777);
                rotateCamera(0, 0.5, 0);
                position = 2;
                break;
            case 2:
                moveCamera(-0.16033,0.0069,0.07192);
                rotateCamera(0, 0.5, 0);
                position = 3;
                break;
            case 3:
                moveCamera(3.34947,4.62918,8.34758);
                rotateCamera(0, 0, 0);
                position = 4;
                break;
            case 4:
                moveCamera(2.1056845058152844, -0.24999848688585216, -6.5889928658253725);
                rotateCamera(-Math.PI / 2, 0, 0);
                position = 0;
                break;
        }
        
    });

    function moveCamera(x: number, y: number, z: number) {
        gsap.to(camera.position, {
            x,
            y,
            z,
            duration: 3
        });
    }

    function rotateCamera(x: number, y: number, z: number) {
        gsap.to(camera.rotation, {
            x,
            y,
            z,
            duration: 3.2
        });
    }
});

//const clock = new THREE.Clock();
function animate() {
    controls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
return null;
}export default App;