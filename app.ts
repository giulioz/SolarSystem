import * as THREE from "three";
import Application from "./BaseApplication";
import { Planet, Sun, Universe, GlowingPlanet, PlanetAnimator } from "./SolarSystem";
import dat from 'dat.gui';
import { OrbitControls } from "./OrbitControls";

class SolarSystemApplication extends Application {
    // Objects
    sun: Sun;
    universe: Universe;

    // Controls
    orbitControl: OrbitControls;
    raycaster: THREE.Raycaster;
    mousePos: THREE.Vector2;
    gui;
    info: HTMLDivElement;
    selectedPlanet: Planet;
    overPlanet: Planet;

    // Animation time
    t: number = 0;

    constructor() {
        super();

        // Textbox info
        this.info = document.createElement("div");
        this.info.className = "planetName";
        this.info.textContent = "Sole";
        document.body.appendChild(this.info);

        // Camera and controls
        this.camera.position.z = 8;
        this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement, () => {
            // Click event
            let delta = new THREE.Vector3().add(this.selectedPlanet.position).sub(this.overPlanet.position);
            this.selectedPlanet = this.overPlanet;
            this.info.textContent = this.selectedPlanet.name;
            this.camera.position.add(delta);
            this.orbitControl.update();
        });

        // Mouse position for raycaster
        this.mousePos = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        window.addEventListener('mousemove', event => {
            this.mousePos.x =  (event.clientX / window.innerWidth)  * 2 - 1;
            this.mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }, false);

        // Universe: background and ambient light
        this.universe = new Universe();
        this.scene.add(this.universe);


        //
        // PLANETS
        //

        // Sun
        this.sun = new Sun("Sole", 2, "sun.jpg", this.camera);
        this.selectedPlanet = this.sun;
        this.scene.add(this.sun);

        // Earth
        let earthAnimator = new PlanetAnimator(13, 0.0005, 1, 0.0);
        let earth = new GlowingPlanet("Terra", 1.0, "earth.jpg", new THREE.Color(0x0081C6), 0.001, 5.0, 0.4, 1.4, earthAnimator, this.camera);
        this.sun.addSatellite(earth);

        // Moon
        let moonAnimator = new PlanetAnimator(2, 0.001, 1, 0.0);
        let moon = new Planet("Luna", 1.0/2.0, "moon.jpg", moonAnimator);
        earth.addSatellite(moon);

        // Mars
        let marsAnimator = new PlanetAnimator(17, 0.0004, 1, 0.5);
        let mars = new GlowingPlanet("Marte", 0.9, "mars.jpg", new THREE.Color(0xFE8201), 0.001, 10.0, 0.4, 1.4, marsAnimator, this.camera);
        this.sun.addSatellite(mars);

        //
        // GUI
        //
        let options = {
        }
        this.gui = new dat.GUI({width: 300});
        // this.gui.add(options, "cameraX", -10, 10).onChange(() => {this.camera.position.x = options.cameraX});
    }

    update(dt: number) {
        this.t += dt;

        // Find planet-mouse intersection
        this.raycaster.setFromCamera(this.mousePos, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);
        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object instanceof Planet) {
                this.overPlanet = intersects[i].object as Planet;
            }
        }

        this.orbitControl.update();
        this.sun.update(this.t);
    }
}

//
// Entry point
//
window.onload = () => {
    (window as any).app = new SolarSystemApplication();
    (window as any).app.start();
}