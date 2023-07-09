import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();
camera.position.set(0, 100, 100);
camera.lookAt(0, 0, 0);



const controls = new OrbitControls(camera, renderer.domElement);

const cubeSize = 1;
const cubeColor = 0xff0000;

let liveCells = new Set();  // Represent live cells as a set of "x,y,z" strings
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const SIZE = 100;

// Initializing the 3D grid with zeros
let grid3D = new Array(SIZE).fill().map(() => new Array(SIZE).fill().map(() => new Array(SIZE).fill(0)));

// Initializing the 2D array with some pattern
var array = [
  [0, 0, 1, 0, 0, 0],
  [0, 1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0 , 0, 1, 0],
  [1, 1,0, 0, 0, 1, 0],
  [0, 0, 1, 1, 0, 0]
];

//var cubes = [];

// Copying the 2D array into the center of the 3D grid
for (let i = 0; i < array.length; i++) {
  for (let j = 0; j < array[i].length; j++) {
    let x = Math.floor(SIZE/2) - Math.floor(array.length/2) + i;
    let y = Math.floor(SIZE/2) - Math.floor(array[i].length/2) + j;
    let z = Math.floor(SIZE/2);

    grid3D[x][y][z] = array[i][j];
    if(array[i][j] === 1) {
      liveCells.add(`${x},${y},${z}`);
    }
  }
}

// Run the game...

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
let cubes = new THREE.InstancedMesh(geometry, material, liveCells.size);

function countLiveNeighbors(cell) {
    let [x, y, z] = cell.split(',').map(Number);
    let liveNeighbors = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
                if (dx !== 0 || dy !== 0 || dz !== 0) {
                    if (liveCells.has(`${x+dx},${y+dy},${z+dz}`)) {
                        liveNeighbors++;
                    }
                }
            }
        }
    }
    return liveNeighbors;
}

function conwaysGameOfLife(liveCells) {
    let newLiveCells = new Set();
    // Iterate over live cells and their neighbors only
    liveCells.forEach(cell => {
      let [x, y, z] = cell.split(',').map(Number);
      for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
              for (let dz = -1; dz <= 1; dz++) {
                  let neighborCell = `${x+dx},${y+dy},${z+dz}`;
                  let liveNeighbors = countLiveNeighbors(neighborCell);
                  let isAlive = liveCells.has(neighborCell);
                  if (isAlive ? (liveNeighbors >= 2 && liveNeighbors <= 5) : (liveNeighbors === 4)) {
                      newLiveCells.add(neighborCell);
                  }
              }
          }
      }
  });
    //liveCells = newLiveCells;
    requestAnimationFrame(conwaysGameOfLife)
    return newLiveCells;
}
var cubeMeshes = [];

function addLiveCellsToScene(liveCells) {
  // Remove old cubes from the scene

  liveCells.forEach((cell) => {
    let coordinates = cell.split(',');  // Split the string into an array
    let x = Number(coordinates[0]);  // Convert the first element to a number and assign it to x
    let y = Number(coordinates[1]);  // Convert the second element to a number and assign it to y
    let z = Number(coordinates[2]); 
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z
    scene.add(cube);
    cubeMeshes.push(cube);  // Save the cube so it can be removed later
  });
}
// ... Animation loop ...
function removeCubes(cubeMeshes){
  for(let i = 0;i<cubeMeshes.length;i++){
    scene.remove(cubeMeshes[i])
    
  }
  cubeMeshes = []
  
}
      
      

setInterval( async function(){for(let i = 0;i<10000;i++){
  addLiveCellsToScene(liveCells) 
  await wait(250)
  // Update cubes for the new generation
  liveCells = conwaysGameOfLife(liveCells);
  await wait(250);
  removeCubes(cubeMeshes)

  
  
}},2500)




function updateScene() {
  requestAnimationFrame(updateScene);

  renderer.render(scene, camera);

}

setInterval(updateScene,10)