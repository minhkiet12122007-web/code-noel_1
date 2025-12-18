import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

/* -------------------------------------------------
   SETUP SCENE / CAMERA / RENDERER
--------------------------------------------------*/
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new THREE.Color(0x000030));

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.set(0, 50, 500);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.enablePan = false;

/* -------------------------------------------------
   LIGHTS
--------------------------------------------------*/
scene.add(new THREE.AmbientLight(0x777777));

const spot = new THREE.SpotLight(0xffffff, 2);
spot.position.set(0, 500, 0);
scene.add(spot);

/* -------------------------------------------------
   GROUND PLANE
--------------------------------------------------*/
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(5000, 5000),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

/* -------------------------------------------------
   LOAD SNOWMAN (GLTF)
--------------------------------------------------*/
const gltfLoader = new GLTFLoader();
gltfLoader.load(
    "assets/models/snowman/scene.gltf",
    (gltf) => {
        const snowman = gltf.scene;
        snowman.position.set(0, -50, 0);
        scene.add(snowman);
        console.log("⛄ Snowman loaded!");
    },
    undefined,
    (err) => console.error(err)
);

/* -------------------------------------------------
   LOAD HOUSE (OBJ + MTL)
--------------------------------------------------*/
const mtlLoader1 = new MTLLoader();
const objLoader1 = new OBJLoader();

mtlLoader1.setPath("assets/models/snowman/House/");
objLoader1.setPath("assets/models/snowman/House/");

mtlLoader1.load("materials.mtl", (materials) => {
    materials.preload();
    objLoader1.setMaterials(materials);

    objLoader1.load("model.obj", (house) => {
        house.scale.set(5, 5, 5);
        house.position.set(-150, 0, -100);
        house.rotation.y = Math.PI / 4;

        scene.add(house);
        console.log("🏠 House loaded!");
    });
});

/* -------------------------------------------------
   LOAD CHRISTMAS TREE (OBJ + MTL)
--------------------------------------------------*/
const mtlLoader2 = new MTLLoader();
const objLoader2 = new OBJLoader();

mtlLoader2.setPath("assets/models/snowman/christmas tree/");
objLoader2.setPath("assets/models/snowman/christmas tree/");

mtlLoader2.load("materials.mtl", (materials) => {
    materials.preload();
    objLoader2.setMaterials(materials);

    objLoader2.load("model.obj", (tree) => {
        tree.scale.set(4, 4, 4);
        tree.position.set(120, 0, -80);
        tree.rotation.y = Math.PI / 3;

        scene.add(tree);
        console.log("🎄 Christmas Tree loaded!");
    });
});

/* -------------------------------------------------
   SNOW PARTICLES (giữ nguyên code của bạn)
--------------------------------------------------*/

const SNOW_NUM = 5000;
const SNOW_RANGE = 1000;

let snowPoints = [];
for (let i = 0; i < SNOW_NUM; i++) {
    snowPoints.push(
        new THREE.Vector3(
            Math.random() * SNOW_RANGE - SNOW_RANGE / 2,
            Math.random() * SNOW_RANGE,
            Math.random() * SNOW_RANGE - SNOW_RANGE / 2
        )
    );
}

const pointGeo = new THREE.BufferGeometry().setFromPoints(snowPoints);
const pointMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 8,
    transparent: true,
});

const snows = new THREE.Points(pointGeo, pointMat);
scene.add(snows);

function dropSnow() {
    const arr = snows.geometry.attributes.position.array;

    for (let i = 0; i < SNOW_NUM * 3; i += 3) {
        arr[i + 1] -= 2;
        if (arr[i + 1] < 0) arr[i + 1] = SNOW_RANGE;
    }
    snows.geometry.attributes.position.needsUpdate = true;
}

/* -------------------------------------------------
   ANIMATE
--------------------------------------------------*/
function tick(t) {
    controls.update();
    dropSnow();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
