import * as THREE from "three";

const MOON_DISTANCE_FROM_EARTH = 4;
const MOON_ROTATION_SPEED = 0.01;
const EARTH_ROTATION_SPEED = 0.01;
const EARTH_RADIUS = 2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
const earthMaterialDay = new THREE.MeshLambertMaterial({
  color: 0xffffff,
});

//texture
const loader = new THREE.TextureLoader();
const dayTexture = loader.load("./assets/2k_earth_daymap.jpg");
earthMaterialDay.map = dayTexture;

//specular map
const specularTexture = loader.load("./assets/2k_earth_specular_map.png");

earthMaterialDay.specularMap = specularTexture;

//normal map
const normalTexture = loader.load("./assets/2k_earth_normal_map.png");
earthMaterialDay.normalMap = normalTexture;

//point light
const pointLight = new THREE.PointLight(0xffffff, 0.4);
pointLight.position.x = -20;
pointLight.position.y = 0;
pointLight.position.z = 4;
scene.add(pointLight);

//spot light
const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.x = -20;
spotLight.position.y = 10;
spotLight.position.z = 0;
spotLight.angle = 0.5;

scene.add(spotLight);

//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

//night texture
const earthMaterialNight = new THREE.MeshStandardMaterial({
  color: 0xffffff,
});

const nightTexture = loader.load("./assets/2k_earth_nightmap.jpg");
earthMaterialNight.emissiveMap = nightTexture;
earthMaterialNight.emissive = new THREE.Color(0x111111);
earthMaterialNight.emissiveIntensity = 60;
earthMaterialNight.emissiveMap = nightTexture;
earthMaterialNight.map = nightTexture;
//emissive map

//clouds
const cloudGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.01, 64, 64);
const cloudMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending,
});

const cloudTexture = loader.load("./assets/2k_earth_clouds.jpg");
cloudMaterial.map = cloudTexture;

const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloudMesh);

const sphere = new THREE.Mesh(earthGeometry, earthMaterialDay);
camera.position.x = -2;
camera.position.y = 3;
camera.position.z = 6;

scene.add(sphere);

//shadow
renderer.shadowMap.enabled = true;
sphere.castShadow = true;
cloudMesh.castShadow = true;
sphere.receiveShadow = true;
cloudMesh.receiveShadow = true;

//stars
const starGeometry = new THREE.SphereGeometry(1000, 64, 64);
const starMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("./assets/2k_stars_milky_way.jpg"),
  side: THREE.BackSide,
  opacity: 0.4,
  transparent: true,
});

const starMesh = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starMesh);

//moon

const moonGeometry = new THREE.SphereGeometry(0.5, 64, 64);
const moonMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
});

const moonTexture = loader.load("./assets/2k_moon.jpg");

moonMaterial.map = moonTexture;

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

moonMesh.position.x = MOON_DISTANCE_FROM_EARTH;
moonMesh.position.y = 0;
moonMesh.position.z = MOON_DISTANCE_FROM_EARTH;

scene.add(moonMesh);

//sun
const sunGeometry = new THREE.SphereGeometry(1, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    });
const sunTexture = loader.load("./assets/2k_sun.jpg");


function animate() {
  camera.lookAt(sphere.position);

  sphere.rotation.y += EARTH_ROTATION_SPEED;
  cloudMesh.rotation.y += EARTH_ROTATION_SPEED * 1.3;
  starMesh.rotation.y += 0.001;

  //rotate moon around earth with an angle

  moonMesh.rotation.y += MOON_ROTATION_SPEED;
  moonMesh.position.x =
    MOON_DISTANCE_FROM_EARTH * Math.cos(moonMesh.rotation.y);
  moonMesh.position.z =
    MOON_DISTANCE_FROM_EARTH * Math.sin(moonMesh.rotation.y);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
