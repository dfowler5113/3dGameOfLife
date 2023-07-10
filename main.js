import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';




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










