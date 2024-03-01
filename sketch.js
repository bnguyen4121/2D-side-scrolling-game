/*

The Game Project
*/
var isLeft;
var isRight;
var isPlummeting;
var isFalling;

var gameChar_x;
var gameChar_y;
var floorPos_y;

var canyons;

var collectables;

var trees_x;
var treePos_y;

var clouds_x;
var clouds_y;
var clouds_size;

var mountain;
var mountain_x;

var cameraPosX

var game_score;
var flagpole;
var lives;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
	startGame();
};

	///////////DRAWING CODE//////////
function draw()
{
	angleMode(DEGREES);

	background(100,155,155); //fills the background to this color

	noStroke();
	fill(0,155,119);
	rect(0, floorPos_y, width, height - floorPos_y); //draws ground

	push();
	translate(-cameraPosX, 0); // controls camera position

	if (cameraPosX = gameChar_x - width/2) {
		i++;
	}


	//clouds in the sky
	drawClouds();

	//mountains in the distance
	drawMountains();

	//trees
	drawTrees();

	//draws the canyons
	for(var i = 0; i < canyons.length; i++){
		drawCanyon(canyons[i]);

		//detects character over canyon and sets plummeting to true
		checkCanyon(canyons[i]);
	}

	//collectable token
	for(var j = 0; j < collectables.length; j++){
		if(!collectables[j].isFound){
			drawCollectable(collectables[j]);
			checkCollectable(collectables[j]);
		}
	}

	//game character
	drawGameChar();

	//draws flagpole (tripod)
	renderFlagpole();

	pop();

	//checks to see if the player has fallen down the canyon
	checkPlayerDie();

	//displays text when character reaches the end
	if(flagpole.isReached){
		fill(135,206,235);
		stroke(65,105,225);
		textSize(60);
		text('Level complete!', width/2 - 200, height/3);
		fill(255);
		noStroke();
		textSize(40);
		text('Press space to continue', width/3 - 30, height/2);
		return;
	}

	//keeps score when item is collected
	fill(255);
	strokeWeight(5);
	stroke(155,200,255);
	textSize(30);
	text("Score: " + game_score, 30, 50);

	//displays how many lives are left
	tokens();
	
	
	///////////INTERACTION CODE//////////
	//conditional statements to move the game character below here
	
	//moves left with arrow left key
	if(isLeft){
		gameChar_x -= 5;
	}

	// moves right
	if (isRight) {
		gameChar_x += 5;
	}
	
	// adds gravity to jumps
	if (gameChar_y < floorPos_y) {
		gameChar_y += 4;
		isFalling = true;
	}

	else
	{
		isFalling = false;
	}

	if(!flagpole.isReached){
		checkFlagpole();
	}
	
}
///////////////////////////////END OF DRAWING CODE///////////////////////////////////


function keyPressed()
{
	// if statements to control the animation of the character when keys are pressed.
	if(keyCode == 37) {
		isLeft = true;
	}

	else if (keyCode == 39) {
		isRight = true;
	}
	
	// jumps in air with space or arrow up keys
	if (keyCode == 32 || keyCode == 38){
		gameChar_y -= 100;

		//prevents double jump
		if (isFalling) {
			gameChar_y += 100;
		}
	}

	// freezing controls while plummeting
	if (isPlummeting) {
		isLeft = false;
		isRight = false;
	}
	
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.

	if(keyCode == 37) {
		isLeft = false;
	}

	else if (keyCode == 39) {
		isRight = false;
	}
}

////////////////////////////CUSTOM FUNCTIONS BELOW///////////////////////////


//function with initialisation at beginning of game
function startGame(){
	gameChar_x = width/2 - 900;
	gameChar_y = floorPos_y;

	isLeft = false;
	isRight = false;
	isPlummeting = false;
	isFalling = false; 

	canyons = [
		{
		x_pos: 170, 
		width: 110
		},
		{
		x_pos: 570, 
		width: 100
		},
		{
		x_pos: 1120, 
		width: 130
		},
		{
		x_pos: 1770, 
		width: 80
		},
		{
		x_pos: 2570, 
		width: 130
		},
	]

	collectables = [
		{
		x_pos: 200, 
		y_pos: 350, 
		size: 55,
		isFound: false
		},
		{
		x_pos: 600, 
		y_pos: 350, 
		size: 55,
		isFound: false
		},
		{
		x_pos: 1150, 
		y_pos: 350, 
		size: 55,
		isFound: false
		},
		{	
		x_pos: 1800, 
		y_pos: 350, 
		size: 55,
		isFound: false
		},
		{
		x_pos: 2600, 
		y_pos: 350, 
		size: 55,
		isFound: false
		},
	]
		
	trees_x = [50,300, 1500, 700, 1050, 1300, 2400];
	treePos_y = height/2;
	
	clouds_x = [-100, 250, 500, 800, 1300, 1650, 2050];
	clouds_y = [50, 100, 25, 100, 50, 120, 50];
	clouds_size = [10, -5, -20, -20, 5, 0, -2, -15];

	mountain = {y_pos: 432};
	mountain_x = [-250, 700, 1350, 1890];

	cameraPosX = 0;

	game_score = 0;
	
	flagpole = {isReached: false, x_pos: 3000};
}


//function to draw clouds
function drawClouds(){

	for (i = 0; i < clouds_x.length && i < clouds_y.length && i < clouds_size.length; i++) {
		fill(255,255,255);
		ellipse(clouds_x[i] + 220,clouds_y[i] + 100,clouds_size[i] + 150,clouds_size[i] + 75);
		ellipse(clouds_x[i] + 220,clouds_y[i] + 70,clouds_size[i] + 80,clouds_size[i] + 90);
		ellipse(clouds_x[i] + 250,clouds_y[i] + 65,clouds_size[i] + 70,clouds_size[i] + 50);
		ellipse(clouds_x[i] + 180,clouds_y[i] + 80,clouds_size[i] + 50,clouds_size[i] + 70);
	};
}

//function to draw mountains
function drawMountains(){

	for (i = 0; i < mountain_x.length; i++) {
		fill(69,50,20);
		triangle(mountain_x[i]+220,mountain.y_pos - 262,mountain_x[i]+362,mountain.y_pos,
		mountain_x[i]+80,mountain.y_pos);
		triangle(mountain_x[i] + 120,mountain.y_pos - 170,mountain_x[i] + 262,mountain.y_pos,
		mountain_x[i] - 20,mountain.y_pos);
		triangle(mountain_x[i] + 420,mountain.y_pos, mountain_x[i] + 322, mountain.y_pos - 300,
		mountain_x[i] + 80,mountain.y_pos);
	};
}

//function to draw trees
function drawTrees(){
	for(i = 0; i < trees_x.length; i++){
		fill(128, 128, 128);
		rect(trees_x[i],treePos_y,60,150);
		fill(255,183,197)
		triangle(trees_x[i]-50,treePos_y+50,trees_x[i]+30,treePos_y-50,trees_x[i]+110,treePos_y+50);
		triangle(trees_x[i]-50,treePos_y+100,trees_x[i]+110,treePos_y+100,trees_x[i]+30,treePos_y);
		triangle(trees_x[i]-50,treePos_y,trees_x[i]+30,treePos_y-100,trees_x[i]+110,treePos_y);
	}
}

//function to draw the collectable
function drawCollectable(t_collectable){
	if (!t_collectable.isFound) 
	{
		push();
		fill(0,128,128);
		translate(t_collectable.x_pos, t_collectable.y_pos);
		scale(t_collectable.size/100);
		rect(0,0, 50, 30);
		rect(40,-6, 6, 6);
		rect(32,-4, 4, 4);
		rect(3,-5, 5, 5);
		fill(220,20,60);
		ellipse(25,15,20,20);
		rect(5,5,5,5);
		fill(0,128,128);
		ellipse(25,15,10,10);
		pop();
	}
}

//function to check character has picked up an item.
function checkCollectable(t_collectable){
	if (abs(gameChar_x - t_collectable.x_pos) < 30) 
	{
		t_collectable.isFound = true;
		game_score++;
	}
	
}

//function to draw canyon
function drawCanyon(t_canyon){
	fill(211, 113, 60);
	rect(t_canyon.x_pos,432,t_canyon.width,144);
	fill(100,155,155);
	rect(t_canyon.x_pos+20,432,t_canyon.width-40,144);
}


//function to detect if character is over a canyon
function checkCanyon(t_canyon){
	// detects character is over canyon 
	if (gameChar_x > t_canyon.x_pos + 30 && gameChar_x < t_canyon.x_pos + 75 && gameChar_y >= floorPos_y) {
		isPlummeting = true;
	}

	// falls down canyon
	if (isPlummeting){
		gameChar_y++;
	}
}

//function to draw flagpole (tripod)
function renderFlagpole(){
	push();
	translate(flagpole);
	strokeWeight(8);
	stroke(221,160,221);
	rotate(5);
	//left leg
	line(flagpole.x_pos - 5, floorPos_y - 450, flagpole.x_pos - 30, floorPos_y - 263);
	//middle leg
	line(flagpole.x_pos + 10, floorPos_y - 450, flagpole.x_pos + 30, floorPos_y - 267);
	//right leg
	line(flagpole.x_pos + 25, floorPos_y - 453, flagpole.x_pos + 90, floorPos_y - 273);
	pop();

	//left leg pads
	push();
	translate(flagpole);
	rotate(10);
	fill(230,230,250);
	rect(flagpole.x_pos - 32, floorPos_y - 570, 15,15, 3);
	pop();

	//middle leg pads
	fill(230,230,250);
	rect(flagpole.x_pos - 4, floorPos_y - 45, 15, 15, 3);

	//right leg pads
	push();
	translate(flagpole);
	rotate(-10);
	fill(230,230,250);
	rect(flagpole.x_pos - 67, floorPos_y + 475, 15,15, 3);
	pop();

	//top parts
	fill(221,160,221); //lavender
	rect(flagpole.x_pos - 5, floorPos_y - 260, 10, 50);
	rect(flagpole.x_pos - 50, floorPos_y - 250, 35, 8);
	fill(230,230,250); // purple
	rect(flagpole.x_pos - 16, floorPos_y - 255, 32, 20, 3);
	rect(flagpole.x_pos - 37, floorPos_y - 220, 75, 35, 5);
	rect(flagpole.x_pos - 16, floorPos_y - 255, 32, 20, 3);
	rect(flagpole.x_pos - 70, floorPos_y - 251, 32, 10, 3, 0, 0, 3); // handle

	//camera holder
	rect(flagpole.x_pos - 20, floorPos_y - 270, 40, 10);
	rect(flagpole.x_pos - 27, floorPos_y - 290, 10, 30, 3);
	rect(flagpole.x_pos + 15, floorPos_y - 290, 10, 30, 3);

}

//function to check if player has reached flagpole
function checkFlagpole(){
	var d = abs(gameChar_x - flagpole.x_pos);

	if(d < 10){
		flagpole.isReached = true;
	}

}

//function to check decrement lives by if player falls below canvas
function checkPlayerDie(){
	if(gameChar_y >= height){
		lives--;

		if(lives > 0){
			startGame();
		}

	else{
		//displays "Game over. Press space to continue"
		fill(135,206,235);
		stroke(65,105,225);
		textSize(60);
		text('Game over!', width/2 - 130, height/3);
		fill(255);
		noStroke();
		textSize(40);
		text('Press space to continue', width/3 - 30, height/2);
		return;
		}
	}


}

//function to draw life tokens and keep track of how many lives remaining
function tokens(){
	for(var t = 0; t < lives; t++){
			fill(255,50,50);
			noStroke();
			drawHeart(width/10 * t + 700, height/10, 30);
		}
}

//function to draw hearts (lives)
function drawHeart(x, y, size) {
	beginShape();
      vertex(x, y - size / 4);
      bezierVertex(x + size / 2, y - size, x + size, y, x, y + size/1.5);
      bezierVertex(x - size, y, x - size / 2, y - size, x, y - size / 4);
    endShape();
  }

function drawGameChar(){
	if(isLeft && isFalling)
	{
		//jumping-left code
		fill(135,206,235);
		push();
		translate(gameChar_x - 553,gameChar_y - 228);
		rotate(-45);
		rect(245,537,7,20,3);
		pop();
		push();
		translate(gameChar_x - 564,gameChar_y - 229);
		rotate(-45);
		rect(245,537,7,20,3);
		pop();
		//arms
		rect(gameChar_x-20,gameChar_y-40,18,7,3);
		rect(gameChar_x-15,gameChar_y-45,20,7,3);
		fill(178,172,136);
		triangle(gameChar_x,gameChar_y-56,gameChar_x-15,gameChar_y-22,gameChar_x+15,gameChar_y-22);
		fill(253,231,214);
		ellipse(gameChar_x,gameChar_y-60,20,20);
}
		
	else if(isRight && isFalling)
	{
		//jumping-right code
		//legs
		fill(135,206,235);
		push();
		translate(gameChar_x+57,gameChar_y - 567);
		rotate(45);
		rect(345,417,7,20,3);
		pop();
		push();
		translate(gameChar_x+343,gameChar_y - 438);
		rotate(45);
		rect(45,537,7,20,3);
		pop();
		//arms
		rect(gameChar_x+4,gameChar_y-40,18,7,3);
		rect(gameChar_x,gameChar_y-45,20,7,3);
		fill(178,172,136);
		triangle(gameChar_x,gameChar_y-56,gameChar_x-15,gameChar_y-22,gameChar_x+15,gameChar_y-22);
		fill(253,231,214);
		ellipse(gameChar_x,gameChar_y-60,20,20);

	}
	else if(isLeft)
	{
		//walking left code
		//legs
		fill(135,206,235);
		push();
		translate(gameChar_x - 255 ,gameChar_y - 209);
		rotate(-45);
		rect(47,311,7,20,3);
		pop();
		rect(gameChar_x - 10, gameChar_y - 26, 7, 20, 3);
		//body
		fill(178,172,136);
		triangle(gameChar_x,gameChar_y-56,gameChar_x-15,gameChar_y-22,gameChar_x+15,gameChar_y-22);
		//arms
		push();
		fill(135,206,235);
		translate(gameChar_x - 237, gameChar_y - 212);
		rotate(-45)
		rect(50,287,7,18,3);
		pop();
		fill(135,206,235);
		push();
		translate(gameChar_x-248,gameChar_y - 227);
		rotate(-45);
		rect(33,287,7,18,3);
		pop();
		fill(253,231,214);
		ellipse(gameChar_x,gameChar_y-60,20,20);

	}
	else if(isRight)
	{
		//walking right code
		//legs
		fill(135,206,235);
		rect(gameChar_x+2,gameChar_y-26,7,20,3);
		push();
		translate(gameChar_x+48,gameChar_y - 413);
		rotate(45);
		rect(235,311,7,20,3);
		pop();
		//body
		fill(178,172,136);
		triangle(gameChar_x,gameChar_y-56,gameChar_x-15,gameChar_y-22,gameChar_x+15,gameChar_y-22);
		//arms
		push();
		fill(135,206,235);
		translate(gameChar_x + 19,gameChar_y - 429);
		rotate(45);
		rect(250,287,7,18,3);
		pop();
		fill(135,206,235);
		push();
		translate(gameChar_x+55,gameChar_y - 419);
		rotate(45);
		rect(233,287,7,18,3);
		pop();
		fill(253,231,214);
		ellipse(gameChar_x,gameChar_y-60,20,20);

	}
	else if(isFalling || isPlummeting)
	{
		//jumping facing forwards code
		fill(135,206,235);
		rect(gameChar_x+2,gameChar_y-26,7,20,3);
		rect(gameChar_x-10,gameChar_y-26,7,20,3);
		//body
		fill(178,172,136);
		triangle(gameChar_x,gameChar_y-56,gameChar_x-15,gameChar_y-22,gameChar_x+15,gameChar_y-22);
		//arms
		fill(135,206,235);
		push();
		translate(gameChar_x-100,gameChar_y-290);
		rotate(45);
		rect(250, 87, 7, 18, 3);
		pop();
		push();
		translate(gameChar_x+215,gameChar_y-162);
		rotate(130);
		rect(235,87,7,18,3);
		pop();
		fill(253,231,214);
		ellipse(gameChar_x,gameChar_y-60,20,20);
	}
	else
	{
		//game character standing, facing frontwards
		fill(135,206,235);
		//legs
		rect(gameChar_x+2,gameChar_y-26,7,20,3);
		rect(gameChar_x-10,gameChar_y-26,7,20,3);
		//right arm
		push();
		translate(gameChar_x + 91,gameChar_y - 690);
		rotate(60);
		rect(516,392,20,7,3);
		pop();
		//left arm
		push();
		translate(gameChar_x - 605.5, gameChar_y + 201);
		rotate(300);
		rect(492,392,20,7,3);
		pop();
		//body
		fill(178,172,136);
		triangle(gameChar_x,gameChar_y-56,gameChar_x-15,gameChar_y-22,gameChar_x+15,gameChar_y-22);
		//head
		fill(253,231,214);
		ellipse(gameChar_x,gameChar_y-60,20,20);
	}
}
