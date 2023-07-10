import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


import { startSimulation } from './main2.js'
import { cancelanimation } from './main2.js';
/*
function startSimulation() {
  window.location.href = "/simulation.html";
}
function loadTemplate(templateId) {
  fetch(`template${templateId}.json`)
      .then(response => response.json())
      .then(data => {
          array = data;
          
      })
      .catch(error => console.error('Error:', error));
}


window.selectTemplate = function (templateId) {
  loadTemplate(templateId);
  startSimulation();
};
*/

$( function() {
  $( "#background" ).draggable();
  
});
window.createTemplate = function (){
    if (document.getElementById('grid').style.display  == 'none'  && document.getElementById('background').style.display == 'none'){
      document.getElementById('grid').style.display = 'block';  // Show the grid
      document.getElementById('background').style.display = 'block';  // Show the grid
    }
    else{
      document.getElementById('grid').style.display = 'none';  // Show the grid
      document.getElementById('background').style.display = 'none';  // Show the grid
    }
      

};

// Create a 10x10 array filled with 0s
export let array = new Array(10).fill().map(() => new Array(10).fill(0));

// Create a 10x10 grid of div elements
let grid = document.getElementById('grid');
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
      let cell = document.createElement('div');
      cell.style.width = '20px';
      cell.style.height = '20px';
      cell.style.border = '1px solid black';
      cell.style.display = 'inline-block';
      cell.addEventListener('click', function() {
          // Update the array and the color of the cell when it is clicked
          array[i][j] = array[i][j] === 0 ? 1 : 0;
          cell.style.backgroundColor = array[i][j] === 0 ? 'white' : 'black';
      });
      grid.appendChild(cell);
  }
  let br = document.createElement('br');  // Create a new line after each row
  grid.appendChild(br);
}

window.saveTemplate = function (){
  if (document.getElementById('canvas-container').style.display  == 'none' ){
      document.getElementById('canvas-container').style.display  = 'block'
      startSimulation()
    }
  else{
    document.getElementById('canvas-container').style.display  = 'none'
  }
  
}

window.reloadBrowser = function(){
  location.reload();
}











