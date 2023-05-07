var currentCamera, scene, renderer;
var clock, deltaTime;
var overviewCamera, topCamera, ballCamera

var balls = [];
var cues = [];
var holes = [];

var ballForCam;
var selectedCue = null;
var rotateCueLeft, rotateCueRight;
const cueSpeed = 1;

const limitW = 200, limitH = 100;
const ballR = 3;

var goal;
var temp = new THREE.Vector3;

function createBalls() {
    'use strict'
    for (let i = 0; i < 15; i++) {
        balls.push(createRandomBall());
    }
}

function checkDeletion(i) {
    let ball = balls[i];
    if (ball.position.y < -120) {
        scene.remove(ball);
        ball.destruct();
        balls.splice(i, 1);
    }
}

function createCues() {
    'use strict'
    cues.push(createCue(-limitW/4, -limitH/2+4, 0));
    cues.push(createCue(limitW/4, -limitH/2+4, 0));
    cues.push(createCue(limitW/2-4, 0, -0.5*Math.PI));
    cues.push(createCue(limitW/4, limitH/2-4, Math.PI));
    cues.push(createCue(-limitW/4, limitH/2-4, Math.PI));
    cues.push(createCue(-limitW/2+4, 0, 0.5*Math.PI));
}

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    //scene.add(new THREE.AxesHelper(10));

    createTable();
    createBalls();
    createCues();
}

function createCamera() {
    'use strict';
    overviewCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    overviewCamera.position.set(80, 110, 100);
    overviewCamera.lookAt(scene.position);
    topCamera = new THREE.OrthographicCamera( window.innerWidth / - 5, window.innerWidth / 5, window.innerHeight / 5, window.innerHeight / - 5, 1, 1000 );
    topCamera.position.set(0, 40, 0);
    topCamera.lookAt(scene.position);
    ballCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    ballCamera.position.set(0, 130, 150);
    ballCamera.lookAt(scene.position);
    ballForCam = new THREE.Object3D;
    // (0, 130, 150) random values
    ballForCam.position.set(0, 130, 150);
    currentCamera = overviewCamera;
}

function selectCue(num) {
    'use strict'
    if (selectedCue) { selectedCue.deselect(); }
    cues[num].select();
    selectedCue = cues[num];
}

function shootBall() {
    if (!selectedCue) return;
    let ball = selectedCue.spawnBall();
    balls.push(ball);
    ballForCam = ball;
    ballCamera.position.set(selectedCue.position.x, selectedCue.position.y + 90, selectedCue.position.z);
    ballCamera.lookAt(ballForCam.position.x, ballForCam.position.y, ballForCam.position.z);
}

function onKeyDown(e) {
    'use strict';
    var keyCode = e.keyCode;
    // 1
    if (keyCode == 49) {
        currentCamera = topCamera; 
    }
    // 2
    if (keyCode == 50) {
        currentCamera = overviewCamera; 
    }
    // 3
    if (keyCode == 51) {
        currentCamera = ballCamera;
    }
    // 4 - 9
    if (keyCode >= 52 && keyCode <= 57) {
        selectCue(keyCode-52); 
    }
    // Arrow Left
    if (keyCode == 37) {
        rotateCueLeft = true;
    }
    // Arrow Right
    if (keyCode == 39) {
        rotateCueRight = true;
    }
    // Space
    if (keyCode == 32) {
        shootBall();
    }
}

function onKeyUp(e) {
    'use strict'
    var keyCode = e.keyCode;
    // Arrow Left
    if (keyCode == 37) {
        rotateCueLeft = false;
    }
    // Arrow Right
    if (keyCode == 39) {
        rotateCueRight = false;
    }
}

function update() {
    'use strict'
    deltaTime = clock.getDelta();

    if (rotateCueLeft && selectedCue) {
        selectedCue.rotateLeft(cueSpeed*deltaTime);
    }
    if (rotateCueRight && selectedCue) {
        selectedCue.rotateRight(cueSpeed*deltaTime);
    }
    for (let i = 0; i < balls.length; i++) {
        balls[i].move(deltaTime);
        checkDeletion(i);
    }
    // adjust camera to new position of the ball, follows with and dynamic angle
	ballCamera.position.x = ballForCam.position.x
	ballCamera.position.z = ballForCam.position.z
    
    handleCollisions();

}

function animate() {
    'use strict';
    update();
    render();
    requestAnimationFrame(animate);
}

function render() {
    'use strict';
    renderer.render(scene, currentCamera);
}

function init() {
    'use strict';
    clock = new THREE.Clock(true);
    
    goal = new THREE.Object3D();

    renderer = new THREE.WebGLRenderer({antialias: true});

    let democ = document.querySelector('#pool-canvas').getBoundingClientRect();
    let cwidth = democ.right - democ.left;
    let cheight = cwidth * (8/16);

    renderer.setSize(cwidth, cheight);
    document.getElementById("pool-canvas").appendChild(renderer.domElement);

    createScene();
    createCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

function startGame() {
    document.getElementById("canvas-overlay").style.visibility = "hidden";
    document.getElementById("canvas-overlay-black").style.visibility = "hidden";
    animate();
}