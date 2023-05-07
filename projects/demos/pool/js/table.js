class Table extends THREE.Object3D {
	constructor(tableW, tableH, wallH, wallD) {
		super();
		// front and back
		this.addWall(tableW, wallH, wallD, 0, wallH/2, tableH/2+wallD/2);
		this.addWall(tableW, wallH, wallD, 0, wallH/2, -tableH/2-wallD/2);

		// sides
		this.addWall(wallD, wallH, tableH+2*wallD, tableW/2+wallD/2, wallH/2, 0);
		this.addWall(wallD, wallH, tableH+2*wallD, -tableW/2-wallD/2, wallH/2, 0);

		// cloth
		this.addCloth(tableW, tableH);

		// bottom
		this.addBottom(tableW+wallD*2, wallD, tableH+wallD*2, 0, -wallD/2-0.1, 0);

		// middle holes
		this.addHole(wallD+0.22, ballR+5, 0, -wallD/2, -tableH/2, -Math.PI/2, Math.PI);
		this.addHole(wallD+0.22, ballR+5, 0, -wallD/2, tableH/2, Math.PI/2, Math.PI);

		// corner holes
		this.addHole(wallD+0.22, ballR+8, -tableW/2, -wallD/2, -tableH/2, 0, Math.PI/2);
		this.addHole(wallD+0.22, ballR+8, tableW/2, -wallD/2, -tableH/2, -Math.PI/2, Math.PI/2);
		this.addHole(wallD+0.22, ballR+8, -tableW/2, -wallD/2, tableH/2, Math.PI/2, Math.PI/2);
		this.addHole(wallD+0.22, ballR+8, tableW/2, -wallD/2, tableH/2, Math.PI, Math.PI/2);
	}

	addWall(width, height, depth, x, y, z) {
		let material = new THREE.MeshBasicMaterial({color: 'saddlebrown', wireframe: true});
		let geometry = new THREE.BoxGeometry(width, height, depth);
	    let mesh = new THREE.Mesh(geometry, material);
	    mesh.position.set(x, y, z);
	    this.add(mesh);
	}

	addCloth(width, height) {
		let material = new THREE.MeshBasicMaterial({color: 'forestgreen', wireframe: false});
		let geometry = new THREE.PlaneGeometry(width, height);
	    geometry.rotateX(-0.5*Math.PI);
	    let mesh = new THREE.Mesh(geometry, material);
	    this.add(mesh);
	}

	addBottom(width, height, depth, x, y, z) {
		let material = new THREE.MeshBasicMaterial({color: 'saddlebrown', wireframe: false});
		let geometry = new THREE.BoxGeometry(width, height, depth);
	    let mesh = new THREE.Mesh(geometry, material);
	    mesh.position.set(x, y, z);
	    this.add(mesh);
	}

	addHole(height, radius, x, y, z, thetastart, thetalen) {
		let hole = new THREE.Object3D();
		let material = new THREE.MeshBasicMaterial({color: 'black'});
		let geometry = new THREE.CylinderGeometry(radius, radius, height, 12, 1, false, thetastart, thetalen);
		let mesh = new THREE.Mesh(geometry, material);
		hole.add(mesh);
		hole.position.set(x, y, z);
		holes.push(hole);
	}
}

function createTable() {
	'use strict'
	let table = new Table(limitW, limitH, 15, 4);
	scene.add(table);
	for (let i = 0; i < holes.length; i++) {
		scene.add(holes[i]);
	}
	return table;
}