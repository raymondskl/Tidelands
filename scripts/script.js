//
// Available modules include (this is not a complete list):
// var Textures = require('Textures');
// var Materials = require('Materials');
// var FaceTracking = require('FaceTracking');
// var Animation = require('Animation');

// Loading required modules
const Scene = require('Scene');
const Reactive = require('Reactive');
const TouchGestures = require('TouchGestures');
const Patches = require('Patches');
const Time = require('Time');

var Diagnostics = require('Diagnostics');


// Binding an object's property to a value provided by the face tracker
const vase = Scene.root.child('TerracottaVase');
const vaseChild = Scene.root.find('vaseChild');

const spawnRadius = 10;



const floatSpeed = 2;
//
// If you want to log objects, use the Diagnostics module.


//Spawn Vase in random locations around a radius
function spawnVase(){
	//Set Spawn Location
	//var radius = Math.random()*spawnRadius;
	var randomInt = [(getRandomInt(75, 100)),(getRandomInt(-100, -75))]

	var angle = Math.random()*2*Math.PI;
	var x = Math.cos(angle) +(randomInt[Math.round(Math.random())]);
	var y = Math.sin(angle) + (randomInt[Math.round(Math.random())]);
	//Apply Transforms
	vase.hidden = false;
	vase.transform.x = Reactive.val(x);

	//vase.transform.z = Reactive.val(y);
	
}

function getRandomInt(min, max) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function bindTime() {
	vase.transform.y = time;
	vaseChild.transform.rotationX = time.div(6);
	vaseChild.transform.rotationY = time.div(7);
	vaseChild.transform.rotationZ = time.div(8);
}


var time = Reactive.val(0);
TouchGestures.onTap(vase).subscribe(function () { vase.hidden = false; spawnVase(); time = Reactive.val(-200); time = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/4));
bindTime();});

vase.transform.y.monitor().subscribe(function(e) {
	if (e >= 200) {
		vase.hidden = true;
	}
});



