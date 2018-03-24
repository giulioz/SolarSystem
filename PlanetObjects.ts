import * as THREE from "three";

// Planet Container
export class SolarSystem extends THREE.Object3D {
    update(t) {
        // Update childrens
        this.children.forEach(sat => {
            if (sat instanceof Planet) {
                (sat as Planet).update(t);
            }
        });
    }
}

// A planet mesh that rotates
export class Planet extends THREE.Mesh {
    animator: PlanetAnimator;

    constructor(name: string, radius: number, texture: string, animator: PlanetAnimator, material?: THREE.Material) {
        let geometry = new THREE.SphereGeometry(radius, 64, 64);
        if (!material)
            material = new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load(texture),
            });
        super(geometry, material);
        this.castShadow = true;
        this.receiveShadow = true;

        this.animator = animator;
        this.name = name;
        this.matrixAutoUpdate = false;
    }

    update(t) {
        // Update planet matrix with animator
        this.matrix = this.animator.update(t);

        // Update childrens
        this.children.forEach(sat => {
            if (sat instanceof Planet) {
                (sat as Planet).update(t);
            }
        });
    }
}

// A planet with atmosphere
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

// A planet that emits light
export class Sun extends Planet {
    light: THREE.PointLight;

    constructor(name: string, radius: number, texture: string,
        color: THREE.Color, c: number, p: number, l: number, glowRadius: number,
        animator: PlanetAnimator, camera: THREE.Camera,
        lightColor: number, lightIntensity: number, lightRadius: number) {
        let uniforms = {
            texture1: { type: "t", value: new THREE.TextureLoader().load(texture) }
        };
        let material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('sunVertexShader').textContent,
            fragmentShader: document.getElementById('sunFragmentShader').textContent
        });
        super(name, radius, texture, new PlanetAnimator(0, 0, 0, 0), material);
        this.light = new THREE.PointLight(lightColor, lightIntensity, lightRadius);
        this.light.castShadow = true;
        this.castShadow = false;
        this.receiveShadow = false;
        this.add(this.light);
    }
}

// Glow outer shell
export class PlanetGlow extends THREE.Mesh {
    uniforms: {};

    constructor (radius: number, color: THREE.Color, c: number, p: number, l: number, camera: THREE.Camera) {
        let _uniforms = {
            "c": { type: "f", value: c }, // offset
            "p": { type: "f", value: p }, // exponent
            "l": { type: "f", value: l }, // amount
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
        this.castShadow = false;
        this.receiveShadow = true;
        this.uniforms = _uniforms;
    }
}

// Planet dynamics simulator
export class PlanetAnimator {
    constructor(public distance: number, public rotationSpeed: number,
        public revolutionSpeed: number, public rotationPhase: number) { }

    update(t) {
        let tr = new THREE.Matrix4().makeTranslation(this.distance, 0, 0);
        let rot = new THREE.Matrix4().makeRotationY(this.rotationSpeed * t + this.rotationPhase);
        return new THREE.Matrix4().multiplyMatrices(rot, tr);
    }
}

// Skybox and ambient light
export class Universe extends THREE.Mesh {
    constructor(texture: string, ambientColor: number, ambientIntensity: number) {
        // Skybox
        let skyboxGeometry = new THREE.SphereGeometry(100000, 64, 64);
        let skyboxMaterial = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(texture),
            side: THREE.BackSide
        });
        super(skyboxGeometry, skyboxMaterial);

        // Ambient Light
        let ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
        this.add(ambientLight);
    }
}