import Stats from "./stats";
import * as THREE from "three";

export default abstract class Application {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
    stats: Stats;
    time: number;

    constructor() {
        // THREE.js
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Resize event
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

        // Stats element
        this.stats = new Stats();
	    document.body.appendChild(this.stats.dom);
    }

    // Delta Time
    get dt(): number {
        let now = new Date().getTime();
        let dt = now - this.time;
        this.time = now;
        return dt;
    }

    // Rendering Cycle
    cycle = () => {
        requestAnimationFrame(this.cycle);
        this.update(this.dt);

        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    };

    // Start rendering cycle
    start() {
        this.time = new Date().getTime();
        this.cycle();
    }

    protected abstract update(dt: number);
}