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
const Networking = require('Networking');

var fd = Scene.root.child('Device').child('Camera').child('Focal Distance');
var ui = fd.child('OutcomeMOdal');
//NETWORKING PRIZE
var textbox = ui.child('WinningModal').child('rectangle0').child('Box');
var textemail = textbox.child('Email');
var submitBut = ui.child('WinningModal').child('rectangle0').child('rectangle2').child('Submit');
var textNode = ui.child('WinningModal').child('rectangle0').child('DynamicPrizeText0');

const vase = fd.child('Rays').child('TerracottaVase');
const uivase = fd.child('Rays').child('TerracottaVase0');
const blackvase = fd.child('Rays').child('BLACK');
const winModal = fd.child('OutcomeMOdal').child('WinningModal');
const loseModal = fd.child('OutcomeMOdal').child('LosingModal');
const closeWinModal = winModal.child('rectangle0').child('Close');
const closeLoseModal = loseModal.child('rectangle0').child('Close0');

const tapChunks = [fd.child('nullObject0'), Scene.root.child('vase_pieces').child('model_GRP').child('TAP_CHUNK_2'), Scene.root.child('vase_pieces').child('model_GRP').child('TAP_CHUNK_3')];
const UIChunks = [fd.child('Rays').child('BLACK').child('UIVASE_BLACK').child('model_GRP').child('geo_jug_01').child('CHUNK_1'), fd.child('Rays').child('BLACK').child('UIVASE_BLACK').child('model_GRP').child('geo_jug_01').child('CHUNK_2'), fd.child('Rays').child('BLACK').child('UIVASE_BLACK').child('model_GRP').child('geo_jug_01').child('CHUNK_3')];

var tutorialChunk;

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

//Networking VARS
var entryId;
var prizeMsg;
var userEmail; 


function init(){
	animateFloatingNoOffset(tapChunks[0], 2, 2000,7);
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

function animateFloatingNoOffset(obj, deltaY, ms, offset){
	//grab init pos
	var y0 = offset;

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

function animateToCenter(obj, deltaY, ms, offset){
	//grab init pos
	var y0 = offset;

	// create time driver
	// create time driver mirroring the animation
	// loop 999 times
	obj.animy_driver = Animation.timeDriver({durationMilliseconds: ms, loopCount: 1, mirror: false});  
	// create sampler
	obj.animy_sampler = Animation.samplers.easeInOutElastic(y0, deltaY);
  
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

function animateBump(obj, deltaFrom, ms, deltaTo){

	obj.animy_driver = Animation.timeDriver({durationMilliseconds: ms, loopCount: 1, mirror: false});  
	// create sampler
	obj.animy_sampler = Animation.samplers.easeInOutElastic(deltaFrom, deltaTo);
  
	// bind the animation to the object's property passing the driver and the sampler
	obj.transform.scaleX = Animation.animate(obj.animy_driver, obj.animy_sampler);
	obj.transform.scaleY = Animation.animate(obj.animy_driver, obj.animy_sampler);
	obj.transform.scaleZ = Animation.animate(obj.animy_driver, obj.animy_sampler);

	// start the animation
	obj.animy_driver.start();
	//obj.animy_driver.onCompleted().subscribe(function (e) {obj.hidden = true;});
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


	animateToCenter(vase, 0, 5000, -172.1033);
	animateBump(vase, 8.44324, 5000, 15);
	vase.transform.rotationX = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(10);
	vase.transform.rotationY = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(12);
	vase.transform.rotationZ = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(14); 

	animateToCenter(uivase, 0, 5000, -172.1033);
	animateBump(uivase, 8.44324, 7000, 15);
	uivase.transform.rotationX = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(10);
	uivase.transform.rotationY = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(12);
	uivase.transform.rotationZ = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/2)).div(14); 
  //fadeOutPingPong(uiflasher, mat_vaseUIFlash, 800, 2000);
  return true;
}



//TAP EVENTS
//TAP ON PIECES
TouchGestures.onTap(tapChunks[0]).subscribe(function () { animateScale(tapChunks[0], 0.08, 1000);  uivase.hidden = blackvase.hidden = false; UIChunks[0].hidden = Reactive.val(true).delayBy({milliseconds: 1000}) ; fadeOut(flasher, mat_cloud, 400,0); fadeOut(uiflasher, mat_vaseUIFlash, 1200, 1000); piecesCollected[0] = true; testTrue(piecesCollected);});
TouchGestures.onTap(tapChunks[1]).subscribe(function () { animateScale(tapChunks[1], 1, 1000);  uivase.hidden = blackvase.hidden = false; UIChunks[1].hidden = Reactive.val(true).delayBy({milliseconds: 1000}) ; fadeOut(flasher, mat_cloud, 400,0); fadeOut(uiflasher, mat_vaseUIFlash, 1200, 1000); piecesCollected[1] = true; testTrue(piecesCollected);});
TouchGestures.onTap(tapChunks[2]).subscribe(function () { animateScale(tapChunks[2], 1, 1000);  uivase.hidden = blackvase.hidden = false; UIChunks[2].hidden = Reactive.val(true).delayBy({milliseconds: 1000}) ; fadeOut(flasher, mat_cloud, 400,0); fadeOut(uiflasher, mat_vaseUIFlash, 1200, 1000); piecesCollected[2] = true; testTrue(piecesCollected);});


//allTrue.monitor().subscribe(function (e){ if (e) {vase.hidden = false;
//uivase.hidden = true;} } )

TouchGestures.onTap(vase).subscribe(function () {	vase.hidden = true; 	EnterLottery(onEntrySuccess); uiflasher.hidden = true; });//spawnVase(); 	time = Reactive.val(-200); 	time = time.pin().add(Time.ms.sub(Time.ms.pin()).div(1000/8));		bindTime(); } );



//TAP ON VASE

//CLOSE OUTCOME MODALS
TouchGestures.onTap(closeWinModal).subscribe(function () { winModal.hidden = true; });
TouchGestures.onTap(closeLoseModal).subscribe(function () { loseModal.hidden = true; });

//EMAIL ENTRY
// Create constants with our request data.
const url = 'https://lottery-d3115.herokuapp.com';

function onEntrySuccess(entryResponse){

  entryId = entryResponse.entryId;
  //Diagnostics.log("Entry Beginning"); 

  var won = entryResponse.won;
  Diagnostics.log("Entry Won? " + won); 

  prizeMsg = entryResponse.message;

  Diagnostics.log("Entered Succesfully!"); 

  if (won) {
    // WINNING FUNCTION
    textNode.text = 'You have won a ' + prizeMsg;
    Diagnostics.log("WINNING!");
    winModal.hidden = false;
    // SHOW WINNING MODAL

  } else {
    // LOSING FUNCTION
    textNode.text = 'You have Lost';
    Diagnostics.log("LOSING!");
    loseModal.hidden = false;
    // SHOW LOSING MODAL
  }
}

function EnterLottery(onSuccess) {
  Networking.fetch(url).then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    Diagnostics.log(myJson);

    if (myJson.success) {
      onSuccess(myJson);
    };
  });
}

function EmailSub(entry){
	Diagnostics.log(url + "/register?email=" + userEmail + "&entryId=" + entry);
	Networking.fetch(url + "/register?email=" + userEmail + "&entryId=" + entry).then(function(response) {
		Diagnostics.log(response);
	    //return response.json();
	    Diagnostics.log('User email is ' + userEmail + " with EntryID " + entry);
	  }).catch(function(error) {
	    // Here we process any errors that may happen with the request
	    textNode.text = 'ERROR';
	});
}


//EMAIL KEYBOARD INPUT
TouchGestures.onTap(textbox).subscribe(function(event){
	Diagnostics.log('Email Box Tapped');
	NativeUI.enterTextEditMode('Email');
});

//LOG EMAIL
TouchGestures.onTap(submitBut).subscribe(function(event){
	Diagnostics.log('Submit Button Tapped');
	EmailSub(entryId);
});


