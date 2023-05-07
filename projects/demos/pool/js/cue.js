class Cue extends THREE.Object3D {
	constructor(x, z, rotY) {
		super();
		this.currRot = 0;
		
		let material = new THREE.MeshBasicMaterial({color: 'wheat'});
		let geometry = new THREE.CylinderGeometry(1, 2, 80);
		geometry.translate(0, -40-15, 0);
		let mesh = new THREE.Mesh(geometry, material);
		mesh.rotateX(0.5*Math.PI);
		this.add(mesh)
		this.position.set(x, ballR, z);
		this.rotation.y = rotY;
	}

	select() {
		this.children[0].material.color.setColorName('maroon');
	}

	deselect() {
		this.children[0].material.color.setColorName('wheat');
	}

	rotateLeft(rot) {
		if (this.currRot+rot < Math.PI/4) {
			this.currRot += rot;
			this.rotation.y += rot;
		}
	}

	rotateRight(rot) {
		if (this.currRot-rot > -Math.PI/4) {
			this.currRot -= rot;
			this.rotation.y -= rot;
		}
	}

	spawnBall() {
		let ball = createWhiteBall(this.position.x, this.position.z, this.rotation.y);
		return ball;
	}
}

function createCue(x, z, rotY) {
	'use strict'
	let cue = new Cue(x, z, rotY);
	scene.add(cue);
	return cue;
}