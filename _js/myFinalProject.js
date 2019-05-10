//lovingly stolen from http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
//...and modified heavily

//################ SETUP CANVAS ##################
//create the canvas element
var canvas = document.createElement("canvas");
//takes canvas gets its context and puts that value in the ctx variable
var ctx = canvas.getContext("2d");
// set canvas width height
canvas.width = 600;
canvas.height = 450;
//appends the canvas to the document object
document.body.appendChild(canvas);

//################ Global variables ##################
var playing = true;
var monstersCaught = 0;
var allMonsters = [];
var allPlatforms = [];
var allPillars = [];
var gravity = 1.9;
var wave = 10;
var timerThen = Math.floor(Date.now() / 1000);
var bgX = 0;
var gameOverTimer;
var xProgress = 0;

//################ Setting up images ##################

// sprite sheet
var imgReady = false;
var img = new Image();
img.onload = function () {
	imgReady = true;
};
img.src = "_images/dog hero.png";

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
	console.log("background loaded successfully");
};
bgImage.src = "_images/scrollingbackground3.png";

// Scratching Post image
var postReady = false;
var postImage = new Image();
postImage.onload = function () {
	postReady = true;
	console.log("post loaded successfully");
};
postImage.src = "_images/post.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "_images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "_images/monster2.gif";

// Boss image
var bossReady = false;
var bossImage = new Image();
bossImage.onload = function () {
	bossReady = true;
	console.log("boss image loaded successfully");

};
//bossImage.src = "_images/boss.png";

// frozen Monster image
var frozenReady = false;
var frozenImage = new Image();
frozenImage.onload = function () {
	frozenReady = true;
	console.log("frozen bullet loaded successfully");
};
frozenImage.src = "_images/monster_frozen.png";

// explode image
var explodeReady = false;
var explodeImage = new Image();
explodeImage.onload = function () {
	explodeReady = true;
};
explodeImage.src = "_images/explode.png";


//################ Game Objects ##################
var hero = {
	hp: 50,
	width: 32,
	height: 32,
	velX: 0,
	velY: 0,
	gravity: gravity,
	speed: 5, // movement in pixels per second
	coFriction: 0.8,
	friction: function () {
		if (this.velX > 0.5) {
			this.velX -= this.coFriction;
		}
		else if (this.velX < -0.5) {
			this.velX += this.coFriction;
		}
		else {
			this.velX = 0;
		}
	},
	grounded: true,
	jump: function () {
		this.velY -= 25;
	}
};

function Monster(x,y) {
	this.width = 32;
	this.height = 32;
	this.speed = 2;
	this.types = ["normal", "boss", "jumpy"];
	this.type = this.types[range(0, 1)];
	this.state = "normal";
	this.alive = true;
	this.deathCoords = [];
	this.x = x;
	this.y = y;
	this.velX = 0;
	this.velY = 1;
	this.direction = 1;
	this.reset = function () {
		this.y = 0;
	};
	this.update = function() {
		this.x += bgX/100;
		this.y += this.velY;
	}
	allMonsters.push(this);
}

function Platform(x,y,w,h,type) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.velX = 1;
	this.direction = 1;
	this.type = type;
	allPlatforms.push(this);
}

function Pillar(x,y,w,h,type) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.velX = 1;
	this.velY = 0;
	this.direction = 1;
	this.type = type;
	allPillars.push(this);
}

//floor
var ground = new Platform(0,canvas.height-0,canvas.width, 0,"ground");

var myFirstPillar = new Pillar(620, 370, 50, 50, "normal");
console.log("here are the pillars... " + allPillars);

//################ Functions ##################
var reset = function () {
	hero.x = canvas.width/2;
	hero.y = canvas.height/2;
	pillarWave();
	allMonsters = [];
	monsterWave(wave);
};

// generate random number
var randNum = function (x) {
	return Math.floor(Math.random() * x);
};

//this function populates an array using a range of values
function range(start, end) {
	var arr = [];
	for (let i = start; i <= end; i++) {
		arr.push(i);
	}
	return arr;
}
function signum() {
	var  selections = [-1,1];
	return selections[randNum(selections.length)];
}

//this function creates new monsters and pillars based on a range using the range function
function monsterWave(max) {
	for (var monster in range(1, max)) {
		monster = new Monster(Math.random()*canvas.width, 0);
	}
}

function pillarWave(max) {
	for (var pillar in range(1, max)) {
		pillar = new Pillar(Math.random()*canvas.width, 0);
	}
}

//countdown timer counts down from x to y
function counter() {
	timerNow = Math.floor(Date.now() / 1000);
	currentTimer = timerNow - timerThen;
	return currentTimer;
}
function timerUp(x,y) {
	timerNow = Math.floor(Date.now() / 1000);
	currentTimer = timerNow - timerThen;
	if (currentTimer <= y && typeof (currentTimer + x) != "undefined") {
		return currentTimer;
	}
	else {
		timerThen = timerNow;
		return x;
	}
}
function fastTimerUp(x,y) {
	timerNow = Date.now();
	currentTimer = timerNow - timerThen;
	if (currentTimer <= y && typeof (currentTimer + x) != "undefined") {
		return currentTimer;
	}
	else {
		timerThen = timerNow;
		return x;
	}
}
function timerDown(x,y) {
	timerNow = Math.floor(Date.now() / 1000);
	currentTimer =  timerNow - timerThen;
	if (currentTimer <= y && typeof (currentTimer + x) != "undefined") {
		return y-currentTimer;
	}
	else {
		timerThen = timerNow;
		return x;
	}
}
function  pillarWave() {
			allPillars = [];
			var myFirstPillar = new Pillar(620, 370, 50, 50, "normal");
			console.log(allPillars);
			var mySecondPillar = new Pillar(810, 370, 50, 50, "normal");
			console.log(allPillars);
			var mySecondPillar = new Pillar(1020, 370, 50, 50, "normal");
			console.log(allPillars);
	}

// ########## this is where animation magic happens ########
function drawFrame(frameX, frameY, canvasX, canvasY) {
	ctx.drawImage(img, frameX * hero.width, frameY * hero.height, hero.width, hero.height, canvasX, canvasY, hero.width, hero.height);
}

const cycleLoop = [0, 1];
let currentLoopIndex = 0;
let frameCount = 0;

function step(delay) {
	frameCount += 1;
	drawFrame(cycleLoop[currentLoopIndex], 1, hero.x, hero.y);
	if (frameCount > delay) {
		frameCount = 0;
		drawFrame(cycleLoop[currentLoopIndex], 1, hero.x, hero.y);
		currentLoopIndex++;
		if (currentLoopIndex >= cycleLoop.length) {
			currentLoopIndex = 0;
		}
	}
}

//################ Setup Keyboard controls ##################

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

// #################### get user input #########################

var input = function (modifier) {
	// checks for user input
	if ("w" in keysDown && hero.grounded == true) { // Player holding up
		// hero.y -= hero.speed * modifier;\
		hero.jump();
		hero.grounded = false;
	}
	if ("s" in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if ("q" in keysDown) { // Player holding down
		hero.health = 100;
		playing = true;
		
	}
	if ("a" in keysDown) { // Player holding left
		hero.velX = -hero.speed;
	}
	if ("d" in keysDown) { // Player holding right
		hero.velX = hero.speed;
	}
	if ("e" in keysDown) { // Player holding right
		projectileImage.src = "_images/frostball.png";
		hero.magic = "frost";
		for (projectile in allProjectiles) {
			allProjectiles[projectile].type = "frost";
		}
	}
	if (" " in keysDown) {
		projectileImage.src = "_images/fireball.png";
		hero.magic = "fire";
		for (projectile in allProjectiles) {
			allProjectiles[projectile].type = "fire";
		}
	}
};

// ##################### Update #####################
var update = function (modifier) {
	xProgress += hero.velX;

	hero.y += hero.velY;
	if (hero.x < canvas.width/4) {
		hero.x += hero.velX;
	}
	//health timer for progressively losing
	gameOverTimer = timerDown(0,60);

	if (gameOverTimer < 0) {
		playing = false;
	}

	// makes background move relative to hero...
	bgX -= hero.velX;

	// console.log (hero.y);
	hero.friction();
	//here's all the timer stuff
	if (hero.health < 0) {
		// console.log("he's dead!!!");
		playing = false;
	}
	// if (timerDown(0,5)<= 0) {
	// 	playing = false;
	// }
	if (allMonsters.length == 0) {
		wave += wave;
		monsterWave(wave);
	}
	if (hero.y < canvas.height) {
		hero.velY += hero.gravity;
	}
	// this keeps the hero on the screen...
	if (hero.x >= canvas.width - 32) {
		hero.x = canvas.width - 32;
	}
	if (hero.x <= 0) {
		hero.x = 0;
	}
	if (hero.y <= 0) {
		hero.y = 0;
	}

	for (var pillar in allPillars) {
		if (
			hero.x <= (allPillars[pillar].x + allPillars[pillar].w) &&
			allPillars[pillar].x <= (hero.x + hero.width) &&
			hero.y <= (allPillars[pillar].y + allPillars[pillar].h) &&
			allPillars[pillar].y <= (hero.y + hero.height)
		) {
			// console.log("hero collided with pillar...");
			// console.log("hero x " + hero.x);
			// console.log("pillar x " + allPillars[pillar].x);
			if (hero.x < allPillars[pillar].x) {
				// console.log("hero x was lesser...")
				hero.x = allPillars[pillar].x - hero.width;
			}
			if (hero.x + hero.width > allPillars[pillar].x) {
				// console.log("hero x was greater...");
				hero.x = allPillars[pillar].x + allPillars[pillar].w;
			}
			reset();
		}
		allPillars[pillar].x -= hero.velX;
		allPillars[pillar].x -= allPillars[pillar].velX;
		//remove pillar if off screen
		if (allPillars[pillar].x < 0){
			allPillars.splice(pillar, 1);
			console.log(allPillars);
		}
		// if we're all out of pillars add another
		if (allPillars.length < 1){
			pillarWave();
		}
	}

	// this is where the monsters get updated
	for (var monster in allMonsters) {
		allMonsters[monster].update();
	}

	// ################### Collision Detection ########################
	for (var plat in allPlatforms) {
		if (allPlatforms[plat].type == "moving") {
			allPlatforms[plat].x += allPlatforms[plat].velX*allPlatforms[plat].direction;
			if  (allPlatforms[plat].x > canvas.width-allPlatforms[plat].w || allPlatforms[plat].x < 0){
				allPlatforms[plat].direction = allPlatforms[plat].direction*-1;
			}
			
		}
		// uncomment to create scrolling platforms
		if (allPlatforms[plat].type != "ground") {
			allPlatforms[plat].x -= hero.velX;
		}
		if (
			hero.x <= (allPlatforms[plat].x + allPlatforms[plat].w) &&
			allPlatforms[plat].x <= (hero.x + hero.width) &&
			hero.y <= (allPlatforms[plat].y + allPlatforms[plat].h-10) &&
			allPlatforms[plat].y <= (hero.y + hero.width)
		) {	
			// this accounts for fall damage
			if (hero.velY > 30) {
				hero.health -= 10;
			}
			if (allPlatforms[plat].type == "moving") {
				hero.x += allPlatforms[plat].velX*allPlatforms[plat].direction;
			}
			if (allPlatforms[plat].type == "ice") {
				console.log("im ice skating!!!!")
				hero.coFriction = 0.0;
			}
			if (allPlatforms[plat].type == "lava") {
				hero.health -= 1;
			}
			else {
				hero.coFriction = 0.7;
			}

			hero.grounded = true;
			hero.velY = 0;
			hero.y = allPlatforms[plat].y - hero.height;
		}

	}
	
	for (monster in allMonsters) {
		if (
			hero.x <= (allMonsters[monster].x + allMonsters[monster].width) &&
			allMonsters[monster].x <= (hero.x + hero.width) &&
			hero.y <= (allMonsters[monster].y + allMonsters[monster].width) &&
			allMonsters[monster].y <= (hero.y + hero.width)
		) {
			++monstersCaught;
            //uncomment below if you want hero's health to go down when colliding with monster
            hero.health -= 10;
			allMonsters.splice(monster, 1);
		}
	}
};

// ################# Render/Draw section ######################
var render = function (modifier) {
	//render background first

	if (bgReady) {
		ctx.drawImage(bgImage, bgX, 0);
		if (bgX < 0) {
			ctx.drawImage(bgImage, bgX+bgImage.width, 0);
			if (bgX < -bgImage.width) {
				bgX = 0;
			}
		}
		if (bgX > 0 ) {
			ctx.drawImage(bgImage, bgX-bgImage.width, 0);
			if (bgX > bgImage.width) {
				bgX = 0;
			}
		}
	}
	if (imgReady) {
		step(25);
	}

	//monsters show up
	if (monsterReady) {
		for (var monster in allMonsters) {
				ctx.drawImage(monsterImage, allMonsters[monster].x, allMonsters[monster].y);
			}

		}

	for (var pillar in allPillars) {
		if (postReady) {
			ctx.drawImage(postImage, allPillars[pillar].x,allPillars[pillar].y);
		}
	}

	// then Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + monstersCaught, 32, 32);
    
    // then Timer
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Monsters: " + allMonsters.length, 150, 32);
};

// ##################### Main loop function ################
var main = function () {
	now = Date.now();
    delta = now - then;
	input(delta / 1000);
	if (playing == true) {
		update(delta / 1000);
	}
	render(delta / 1000);
	then = now;
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();