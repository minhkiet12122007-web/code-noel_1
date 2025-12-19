// Renderer + Scene
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(5, 3, 6);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

// LOADERS
const gltf = new THREE.GLTFLoader();
const mtl = new THREE.MTLLoader();
const obj = new THREE.OBJLoader();

// Load Snowman
gltf.load("/code-noel/assets/models/snowman/scene.gltf", (gltfScene) => {
    gltfScene.scene.scale.set(1, 1, 1);
    gltfScene.scene.position.set(0, 0, 0);
    scene.add(gltfScene.scene);
    console.log("Snowman loaded");
});

// Load House
mtl.load("/code-noel/assets/models/House/materials.mtl", (materials) => {
    materials.preload();
    obj.setMaterials(materials);
    obj.load("/code-noel/assets/models/House/model.obj", (model) => {
        model.scale.set(1.5, 1.5, 1.5);
        model.position.set(3, 0, -2);
        scene.add(model);
        console.log("House loaded");
    });
});

// Load Christmas Tree
mtl.load("/code-noel/assets/models/christmas_tree/materials.mtl", (materials) => {
    materials.preload();
    obj.setMaterials(materials);
    obj.load("/code-noel/assets/models/christmas_tree/model.obj", (model) => {
        model.scale.set(1.2, 1.2, 1.2);
        model.position.set(-3, 0, -2);
        scene.add(model);
        console.log("Christmas Tree loaded");
    });
});

// SNOW
const snowTexture = new THREE.TextureLoader().load("/code-noel/assets/models/snowman/snowflake.png");

const snowGeo = new THREE.BufferGeometry();
const count = 3000;
const pos = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 20;

snowGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

const snow = new THREE.Points(
    snowGeo,
    new THREE.PointsMaterial({
        size: 0.12,
        map: snowTexture,
        transparent: true,
        depthWrite: false
    })
);

scene.add(snow);

// Animation loop
function animate() {
    controls.update();
    renderer.render(scene, camera);
    snow.rotation.y += 0.0005;
    requestAnimationFrame(animate);
}
animate();

// Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Music
const bgm = document.getElementById("bgm");
const musicToggle = document.getElementById("musicToggle");

let musicOn = false;

musicToggle.addEventListener("click", () => {
    if (!musicOn) {
        bgm.play().then(() => {
            musicOn = true;
            musicToggle.innerText = "🔊 Music: ON";
        }).catch(err => {
            console.log("Không phát được nhạc:", err);
        });
    } else {
        bgm.pause();
        musicOn = false;
        musicToggle.innerText = "🔇 Music: OFF";
    }
});
