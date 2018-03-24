import * as THREE from "three";

export class Planet extends THREE.Mesh {
    animator: PlanetAnimator;

    constructor(name: string, radius: number, texture: string, animator: PlanetAnimator, material?: THREE.Material) {
        let geometry = new THREE.SphereGeometry(radius, 64, 64);
        if (!material)
            material = new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load(texture)
            });
        super(geometry, material);
        this.animator = animator;
        this.name = name;
        this.matrixAutoUpdate = false;
    }

    addSatellite(satellite: Planet) {
        this.add(satellite);
    }

    update(t) {
        let tmat = this.animator.update(t);
        this.matrix = tmat;
        // this.normalMatrix = new THREE.Matrix3().setFromMatrix4(tmat);
        this.children.forEach(sat => {
            if (sat instanceof Planet) {
                (sat as Planet).update(t);
            }
        });
    }
}

export class GlowingPlanet extends Planet {
    glow: PlanetGlow;

    constructor(name: string, radius: number, texture: string, color: THREE.Color,
        c: number, p: number, l: number, glowRadius: number,
        animator: PlanetAnimator, camera: THREE.Camera, material?: THREE.Material) {
        super(name, radius, texture, animator, material);
        this.glow = new PlanetGlow(radius * glowRadius, color, c, p, l, camera);
        this.add(this.glow);
    }
}

export class Sun extends GlowingPlanet {
    light: THREE.PointLight;

    constructor(name: string, radius: number, texture: string, camera: THREE.Camera) {
        let uniforms = {
            texture1: { type: "t", value: new THREE.TextureLoader().load(texture) }
        };
        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('sunVertexShader').textContent,
            fragmentShader: document.getElementById('sunFragmentShader').textContent
        });
        super(name, radius, texture, new THREE.Color(0xFE8201), 0.02, 20.0, 1.0, 3.0, new PlanetAnimator(0, 0, 0, 0), camera, material);
        this.light = new THREE.PointLight(0xFFFFFF, 3.0, 40.0);
        this.add(this.light);
    }
}

export class PlanetGlow extends THREE.Mesh {
    uniforms: {};

    constructor (radius: number, color: THREE.Color, c: number, p: number, l: number, camera: THREE.Camera) {
        let _uniforms = {
            "c": { type: "f", value: c },
            "p": { type: "f", value: p },
            "l": { type: "f", value: l },
			glowColor: { type: "c", value: color },
			viewVector: { type: "v3", value: camera.position }
        };
        let material = new THREE.ShaderMaterial({
            uniforms: _uniforms,
            vertexShader: document.getElementById('glowVertexShader').textContent,
            fragmentShader: document.getElementById('glowFragmentShader').textContent,
            transparent: true,
            blending: THREE.AdditiveBlending,
            // side: THREE.DoubleSide
        });
        super(new THREE.SphereGeometry(radius, 128, 128), material);
        this.uniforms = _uniforms;
    }
}

export class PlanetAnimator {
    constructor(public distance: number, public rotationSpeed: number,
        public revolutionSpeed: number, public rotationPhase: number) {

    }

    update(t) {
        let tr = new THREE.Matrix4().makeTranslation(this.distance, 0, 0);
        let rot = new THREE.Matrix4().makeRotationY(this.rotationSpeed * t + this.rotationPhase);
        return new THREE.Matrix4().multiplyMatrices(rot, tr);
    }
}

export class Universe extends THREE.Mesh {
    constructor() {
        let skyboxGeometry = new THREE.SphereGeometry(100000, 64, 64);
        let skyboxMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("stars.jpg"),
            side: THREE.BackSide
        });
        super(skyboxGeometry, skyboxMaterial);

        let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
        this.add(ambientLight);
    }
}