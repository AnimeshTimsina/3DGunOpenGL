// shim layer with setTimeout fallback
window.requestAnimationFrame = (function () {
   return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         function (callback) {
             window.setTimeout(callback, 1000 / 60);
         };
     })();

var canvas;
var divCurrentFPS;
var divAverageFPS;
var device;
var meshes = [];
var mera;
var previousDate = Date.now();
var lastFPSValues = new Array(60);
var light;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.getElementById("frontBuffer");
    divCurrentFPS = document.getElementById("currentFPS");
    divAverageFPS = document.getElementById("averageFPS");
    mera = new SoftEngine.Camera();
    device = new SoftEngine.Device(canvas);
    light = new SoftEngine.Light();
    light.Position = new BABYLON.Vector3(-1,1,2);

    mera.Position = new BABYLON.Vector3(0, 0, 10);
    mera.Target = new BABYLON.Vector3(0, 0, 0);


    device.LoadJSONFileAsync("gun.babylon", loadJSONCompleted);
}

function loadJSONCompleted(meshesLoaded) {
    meshes = meshesLoaded;
    rotateMeshY(-0.4);

    requestAnimationFrame(drawingLoop);
}
function translateMeshX(val){
    for (var i = 0; i < meshes.length; i++) {
        meshes[i].Position.x += val;
    }
console.log("pos x: "+ meshes[0].Position.x);
}
function translateMeshZ(val){
    for (var i = 0; i < meshes.length; i++) {
        meshes[i].Position.z += val;
    }
console.log("pos z: "+ meshes[0].Position.z);

}

function rotateMeshX(val){
    for (var i = 0; i < meshes.length; i++) {
        meshes[i].Rotation.x += val;
    }
}
function rotateMeshY(val){
    for (var i = 0; i < meshes.length; i++) {
        meshes[i].Rotation.y += val;
    }
}

function translateLightX(val){
    light.Position.x += val;
    console.log("light pos x: "+ light.Position.x);
}
function translateLightY(val){
    light.Position.y += val;
    console.log("light pos y: "+ light.Position.y);
}
function translateLightZ(val){
    light.Position.z += val;
    console.log("light pos z: "+ light.Position.z);
}

window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 37: // Left
            translateMeshX(-0.1)
        break;
        case 38: // Up
            translateMeshZ(0.1)
        break;
        case 39: // Right
            translateMeshX(0.1)
        break;
        case 40: // Down
            translateMeshZ(-0.1)
        break;
        case 76: // i in numpad
            rotateMeshY(-0.1)
        break;
        case 74: // j in numpad
            rotateMeshY(0.1)
        break;
        case 75: // k in numpad
            rotateMeshX(-0.1)
        break;
        case 73: // l in numpad
            rotateMeshX(0.1)
        break;
        case 65: // light left - a
            translateLightX(2)
        break;
        case 68: // light right - d
            translateLightX(-2)
        break;
        case 87: // light backward - w
            translateLightZ(2)
        break;
        case 83: // light forward - s
            translateLightZ(-2)
        break;
        case 81: // light up - q
            updateLightY(2)
        break;
        case 69: // light down - e
            updateLightY(-2)
        break;
        }
    }, false);

function drawingLoop() {
    var now = Date.now();
    var currentFPS = 1000 / (now - previousDate);
    previousDate = now;

    divCurrentFPS.textContent = currentFPS.toFixed(2);

    if (lastFPSValues.length < 60) {
        lastFPSValues.push(currentFPS);
    } else {
        lastFPSValues.shift();
        lastFPSValues.push(currentFPS);
        var totalValues = 0;
        for (var i = 0; i < lastFPSValues.length; i++) {
            totalValues += lastFPSValues[i];
        }

        var averageFPS = totalValues / lastFPSValues.length;
        divAverageFPS.textContent = averageFPS.toFixed(2);
    }

    device.clear();

    // for (var i = 0; i < meshes.length; i++) {
    //     meshes[i].Rotation.y += 0.01;
    // }

    device.render(mera, meshes,light);

    device.present();

    requestAnimationFrame(drawingLoop);
}
