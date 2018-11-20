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
const NativeUI = require('NativeUI');  // The new NativeUIModule import
const Diagnostics = require('Diagnostics');
const Animation = require ('Animation');
const Materials = require ('Materials')

var fd = Scene.root.child('Device').child('Camera').child('Focal Distance');
var ui = fd.child('OutcomeMOdal');
var textbox = ui.child('WinningModal').child('rectangle0').child('Box');

const vase = fd.child('Rays').child('TerracottaVase');
const uivase = fd.child('Rays').child('TerracottaVase0');

const winModal = fd.child('OutcomeMOdal').child('WinningModal');
const loseModal = fd.child('OutcomeMOdal').child('LosingModal');
const closeWinModal = winModal.child('rectangle0').child('Close');
const closeLoseModal = loseModal.child('Close0');

const tapChunks = [Scene.root.child('vase_pieces').child('model_GRP').child('TAP_CHUNK_1'), Scene.root.child('vase_pieces').child('model_GRP').child('TAP_CHUNK_2'), Scene.root.child('vase_pieces').child('model_GRP').child('TAP_CHUNK_3')];
const UIChunks = [fd.child('Rays').child('BLACK').child('UIVASE_BLACK').child('model_GRP').child('geo_jug_01').child('CHUNK_1'), fd.child('Rays').child('BLACK').child('UIVASE_BLACK').child('model_GRP').child('geo_jug_01').child('CHUNK_2'), fd.child('Rays').child('BLACK').child('UIVASE_BLACK').child('model_GRP').child('geo_jug_01').child('CHUNK_3')];

const flasher = Scene.root.child('Device').child('Camera').child('Flash').child('FlashRect');
var mat_cloud = Materials.get("Flash");

const uiflasher = fd.child('Rays').child('UIVASE_FLASH');
var mat_vaseUIFlash = Materials.get("UIVASEFLASH");

const spawnRadius = 10;
const floatSpeed = 2;
var winLose = [fd.child('OutcomeMOdal').child('WinningModal'), fd.child('OutcomeMOdal').child('LosingModal')];
var time = Reactive.val(0);
var piecesCollected = [false, false, false];
var allTrue = false;

function init(){
	animateFloating(tapChunks[0], 10, 2000);
	animateFloating(tapChunks[1], 10, 2000);
	animateFloating(tapChunks[2], 10, 2000);

	tapChunks[0].transform.rotationX = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(10);
	tapChunks[0].transform.rotationY = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(12);
	tapChunks[0].transform.rotationZ = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(14); 

	tapChunks[1].transform.rotationX = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(10);
	tapChunks[1].transform.rotationY = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(12);
	tapChunks[1].transform.rotationZ = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(14); 

	tapChunks[2].transform.rotationX = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(10);
	tapChunks[2].transform.rotationY = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(12);
	tapChunks[2].transform.rotationZ = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(14); 

}

init();

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
	vase.transform.rotationX = time.div(10);
	vase.transform.rotationY = time.div(12);
	vase.transform.rotationZ = time.div(14);
}

function randomWinLose(){

	for (var i = winLose.length - 1; i >= 0; i--) {
		winLose[i].hidden = true;
	}

	winLose[Math.round(Math.random())].hidden = false;
}

function animateFloating(obj, deltaY, ms){
	//grab init pos
	var y0 = getRandomInt(-50, 50);

	// create time driver
	// create time driver mirroring the animation
	// loop 999 times
	obj.animy_driver = Animation.timeDriver({durationMilliseconds: ms, loopCount: Infinity, mirror: true});  
	// create sampler
	obj.animy_sampler = Animation.samplers.easeInOutSine(y0, y0 + deltaY);
  
	// bind the animation to the object's property passing the driver and the sampler
	obj.transform.y = Animation.animate(obj.animy_driver, obj.animy_sampler);

	// start the animation
	obj.animy_driver.start();
}

function animateScale(obj, deltaXYZ, ms){

	obj.animy_driver = Animation.timeDriver({durationMilliseconds: ms, loopCount: 1, mirror: false});  
	// create sampler
	obj.animy_sampler = Animation.samplers.easeInBack(deltaXYZ, 0);
  
	// bind the animation to the object's property passing the driver and the sampler
	obj.transform.scaleX = Animation.animate(obj.animy_driver, obj.animy_sampler);
	obj.transform.scaleY = Animation.animate(obj.animy_driver, obj.animy_sampler);
	obj.transform.scaleZ = Animation.animate(obj.animy_driver, obj.animy_sampler);

	// start the animation
	obj.animy_driver.start();
	obj.animy_driver.onCompleted().subscribe(function (e) {obj.hidden = true;});
}


function fadeOut(obj, mat, ms, delay) {
	// start the animation
	Time.setTimeout(	function (elapsedTime) {		// create the driver and sampler as properties of (inside) the object
	obj.fadeout_driver = Animation.timeDriver({durationMilliseconds: ms});
	obj.fadeout_sampler = Animation.samplers.easeInOutSine(1.0,0.0);

	// it's good to reset the driver before the animation starts (in case you ran
	// this animation before)
	obj.fadeout_driver.reset();

	// bind the opacity to the animation passing the driver and sampler
	mat.opacity = Animation.animate(obj.fadeout_driver, obj.fadeout_sampler);
	obj.fadeout_driver.start();  }, delay);
}

function fadeOutPingPong(obj, mat, ms, delay) {
	// start the animation
	Time.setTimeout(	function (elapsedTime) {		// create the driver and sampler as properties of (inside) the object
	obj.fadeout_driver = Animation.timeDriver({durationMilliseconds: ms, loopCount: Infinity, mirror: true});

	obj.fadeout_sampler = Animation.samplers.easeInOutSine(1.0,0.0);

	// it's good to reset the driver before the animation starts (in case you ran
	// this animation before)
	obj.fadeout_driver.reset();

	// bind the opacity to the animation passing the driver and sampler
	mat.opacity = Animation.animate(obj.fadeout_driver, obj.fadeout_sampler);
	obj.fadeout_driver.start();  }, delay);
}

function testTrue(obj)
{
  for(var o in obj)
      if(!obj[o]) return false;
    
  Diagnostics.log(obj);

  vase.hidden = false;
  uivase.hidden = true;
  fadeOutPingPong(uiflasher, mat_vaseUIFlash, 800, 2000);
  return true;
}



//TAP EVENTS
//TAP ON PIECES
TouchGestures.onTap(tapChunks[0]).subscribe(function () { animateScale(tapChunks[0], 1, 1000);  UIChunks[0].hidden = Reactive.val(true).delayBy({milliseconds: 1000}) ; fadeOut(flasher, mat_cloud, 400,0); fadeOut(uiflasher, mat_vaseUIFlash, 1200, 1000); piecesCollected[0] = true; testTrue(piecesCollected);});
TouchGestures.onTap(tapChunks[1]).subscribe(function () { animateScale(tapChunks[1], 1, 1000);  UIChunks[1].hidden = Reactive.val(true).delayBy({milliseconds: 1000}) ; fadeOut(flasher, mat_cloud, 400,0); fadeOut(uiflasher, mat_vaseUIFlash, 1200, 1000); piecesCollected[1] = true; testTrue(piecesCollected);});
TouchGestures.onTap(tapChunks[2]).subscribe(function () { animateScale(tapChunks[2], 1, 1000);  UIChunks[2].hidden = Reactive.val(true).delayBy({milliseconds: 1000}) ; fadeOut(flasher, mat_cloud, 400,0); fadeOut(uiflasher, mat_vaseUIFlash, 1200, 1000); piecesCollected[2] = true; testTrue(piecesCollected);});


//allTrue.monitor().subscribe(function (e){ if (e) {vase.hidden = false;
//uivase.hidden = true;} } )

TouchGestures.onTap(vase).subscribe(function () {	vase.hidden = true; 	randomWinLose(); uiflasher.hidden = true; });//spawnVase(); 	time = Reactive.val(-200); 	time = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/8));		bindTime(); } );



//TAP ON VASE

//CLOSE OUTCOME MODALS
TouchGestures.onTap(closeWinModal).subscribe(function () { winModal.hidden = true; });
TouchGestures.onTap(closeLoseModal).subscribe(function () { loseModal.hidden = true; });

//EMAIL ENTRY
// onTap of the Textbox, rather than the text element in this case
TouchGestures.onTap(textbox).subscribe(function(event) {
    // `enterTextEditMode` is the method to bring up the native UI keyboard,
    // This doesn't need to be called from within a Touch function.
    NativeUI.enterTextEditMode('Email');
});

// Another new method, getText(), returns the editable text as a StringSignal,
// allowing you to monitor and attach an event subscription when the text
// has been changed.
NativeUI.getText('Email').monitor().subscribe(function(event) {
    // Check if the text has indeed been changed
    if (event.newValue !== event.oldValue) {
        // Do actions 
        Diagnostics.log(event.newValue)
        ui.child('Message').text = 'Welcome ' + event.newValue.split(' ')[0];
        //ui.child('Message').hidden = false;
    }
});
// vase.transform.y.monitor().subscribe(function(e) {
// 	if (e >= 200) {
// 		vase.hidden = true;
// 	}
// });



