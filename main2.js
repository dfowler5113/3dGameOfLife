
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { array } from './main.js';
function startSimulation(){

  let scene, camera, renderer;
let container = document.getElementById('canvas-container');
let width = container.offsetWidth;
let height = container.offsetHeight;

camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.getElementById('canvas-container').appendChild(renderer.domElement);

scene = new THREE.Scene();
camera.position.set(100, 50, 50);
camera.lookAt(0, 0, 0);

const geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});

const controls = new OrbitControls(camera, renderer.domElement);

const cubeSize = 1;
const cubeColor = 0xff0000;

let liveCells = new Set();
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const SIZE = 100;

// Initialize live cells
for (let i = 0; i < array.length; i++) {
  for (let j = 0; j < array[i].length; j++) {
    let x = Math.floor(SIZE/2) - Math.floor(array.length/2) + i;
    let y = Math.floor(SIZE/2) - Math.floor(array[i].length/2) + j;
    let z = Math.floor(SIZE/2);

    if(array[i][j] === 1) {
      liveCells.add(`${x},${y},${z}`);
    }
  }
}

let neighborCounts = new Map();

function countLiveNeighbors(cell) {
    if (neighborCounts.has(cell)) {
        return neighborCounts.get(cell);
    }

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
    
    neighborCounts.set(cell, liveNeighbors);
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
    
    return newLiveCells;
}

let instancedMesh = new THREE.InstancedMesh(geometry, material, liveCells.size);
scene.add(instancedMesh);

function addLiveCellsToScene(liveCells) {
  instancedMesh.count = liveCells.size;

  let i = 0;
  liveCells.forEach((cell) => {
    let coordinates = cell.split(','); 
    let x = Number(coordinates[0]);
    let y = Number(coordinates[1]); 
    let z = Number(coordinates[2]); 

    let matrix = new THREE.Matrix4().makeTranslation(x, y, z);
    instancedMesh.setMatrixAt(i++, matrix);
  });

  instancedMesh.instanceMatrix.needsUpdate = true;
}

setInterval(async function() {
  for(let i = 0; i < 10000; i++) {
    addLiveCellsToScene(liveCells);
    await wait(250);

    liveCells = conwaysGameOfLife(liveCells);

    neighborCounts.clear();

    await wait(250);
  }
}, 2500);

function updateScene() {
  renderer.render(scene, camera);
}

setInterval(updateScene,10);
}
function cancelanimation(){
  renderer.render(null);
}

export { startSimulation };
export {cancelanimation};