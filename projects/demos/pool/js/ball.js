class Ball extends THREE.Object3D {
	constructor(color, x, z, rotY, speed) {
		super();
		this.speed = speed;
		this.vspeed = 50;
		this.falling = false;
		this.velocity = (new THREE.Vector3(Math.sin(rotY), 0, Math.cos(rotY))).normalize();
		this.velocity.multiplyScalar(speed);
		let material = new THREE.MeshBasicMaterial({color: color, wireframe: false});
		let geometry = new THREE.SphereGeometry(ballR, 12, 12);
		let mesh = new THREE.Mesh(geometry, material);
		this.add(mesh);
		this.position.set(x, ballR, z);
		this.rotation.y = rotY;

		//let ballAxis = new THREE.AxesHelper(4);
		//this.add(ballAxis);
	}

	destruct() {
		// ball
		this.children[0].geometry.dispose();
		this.children[0].material.dispose();
		// axes helper
		//this.children[1].geometry.dispose();
		//this.children[1].material.dispose();
	}

	move(time) {
		if (!this.falling) {
			this.velocity.x *= 0.999;
			this.velocity.z *= 0.999;
			this.speed *= 0.999;
			this.position.x += time*this.velocity.x;
   			this.position.z += time*this.velocity.z;
   			this.rotateX(time*this.speed);
		}
		else {
			this.position.y -= time*this.vspeed;
			this.rotateX(time*this.vspeed);
		}
	}

	treatCollision(otherBall) {
		let x1 = this.position;
		let x2 = otherBall.position;

		let v1old = this.velocity;
		let v2old = otherBall.velocity;

		// calculating v1
		let v1v2 = new THREE.Vector3();
		v1v2.subVectors(v1old, v2old);
		let x1x2 = new THREE.Vector3();
		x1x2.subVectors(x1, x2);

		let s1 = v1v2.dot(x1x2);
		let dsquared1 = x1.distanceToSquared(x2);
		s1 = s1 / dsquared1;
		x1x2.multiplyScalar(s1);

		let v1new = new THREE.Vector3();
		v1new.subVectors(v1old, x1x2);

		this.velocity = v1new;

		// calculating v2
		let v2v1 = new THREE.Vector3();
		v2v1.subVectors(v2old, v1old);
		let x2x1 = new THREE.Vector3();
		x2x1.subVectors(x2, x1);

		let s2 = v2v1.dot(x2x1);
		let dsquared2 = x2.distanceToSquared(x1);
		s2 = s2 / dsquared2;
		x2x1.multiplyScalar(s2);

		let v2new = new THREE.Vector3();
		v2new.subVectors(v2old, x2x1);

		otherBall.velocity = v2new;

		// moving the ball a little so they don't get stuck together
		this.position.x += 0.01*this.velocity.x;
   		this.position.z += 0.01*this.velocity.z;
	}

	checkWallCollision(){
		// left side wall collision
		if(this.position.z >= limitH/2-ballR){
			this.velocity.z *= -1;
		}
		//right side wall collision
		if(this.position.z <= -limitH/2+ballR){
			this.velocity.z *= -1;
		}
		//bottom wall collision
		if(this.position.x >= limitW/2-ballR){
			//this.position.x = tableW/2+wallD/2 + ballR;
			this.velocity.x *= -1;
		}
		//upper wall collision
		if(this.position.x <= -limitW/2+ballR){
			//this.position.x = -tableW/2-wallD/2 + ballR;
			this.velocity.x *= -1;
		}
	}

	checkCollisions(ball){
		var ourPos = this.position;
		var objPos = ball.position;
		var dist = ourPos.distanceTo(objPos);
		if(dist <= 2*ballR){ //bigger distance so that balls don't "merge" with each other
			this.treatCollision(ball)
		}
	}

	checkCollisionHole(hole) {
		var ourPos = this.position;
		var holePos = new THREE.Vector3(hole.position.x, ballR, hole.position.z);
		var dist = ourPos.distanceTo(holePos);
		if(dist <= 2.5*ballR){
			this.falling = true;
		}
	}
}

function createRandomBall() {
	'use strict'
	let x = getRandFloat(-limitW/2+ballR, limitW/2-ballR);
	let z = getRandFloat(-limitH/2+ballR, limitH/2-ballR);  
	let rotY = getRandFloat(0, 2*Math.PI);
	let speed = getRandFloat(10, 40)
	let ball = new Ball(randomBallColor(), x, z, rotY, speed);
	scene.add(ball);
	return ball;
}

function createWhiteBall(x, z, rotY) {
	'use strict'
	let ball = new Ball('white', x, z, rotY, 150);
	scene.add(ball);
	return ball;
}

function randomBallColor() {
	'use strict' 
	const colors = ['red', 'orange', 'yellow', 'blue'];
	return colors[Math.floor(Math.random() * colors.length)];
}

function changeBallColor(ball){
	'use strict'
	ball.color = 'green';
	return ball;
}

function handleCollisions(){
	for(var i = 0; i < balls.length-1; i++){
		for(var j = i + 1; j < balls.length; j++){
			balls[i].checkCollisions(balls[j]);
		}
		for (var k = 0; k < holes.length; k++) {
			balls[i].checkCollisionHole(holes[k]);
		}
	}

	for (var k = 0; k < holes.length; k++) {
		balls[balls.length-1].checkCollisionHole(holes[k]);
	}
	for(var i = 0; i < balls.length; i++){
		balls[i].checkWallCollision();
	}
}