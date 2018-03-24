import * as THREE from "three";
import Application from "./BaseApplication";
import { Planet, Sun, Universe, GlowingPlanet, PlanetAnimator, SolarSystem } from "./PlanetObjects";
import dat from 'dat.gui';
import { OrbitControls } from "./OrbitControls";
import { EffectComposer, BloomPass, KernelSize, GodRaysPass, RenderPass } from "postprocessing";

class SolarSystemApplication extends Application {
    // Objects
    solarSystem: SolarSystem;
    universe: Universe;
    godRaysPass: any;

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

        // GUI
        let options = {
        }
        this.gui = new dat.GUI({width: 300});
        // this.gui.add(options, "cameraX", -10, 10).onChange(() => {this.camera.position.x = options.cameraX});

        // Universe: background and ambient light
        this.universe = new Universe("stars.jpg", 0xFFFFFF, 0.1);
        this.scene.add(this.universe);


        //
        // PLANETS
        //
        this.solarSystem = new SolarSystem();
        this.scene.add(this.solarSystem);

        // Sun
        let sun = new Sun("Sole", 3, "sun.jpg", new THREE.Color(0xFE8201),
                0.02, 20.0, 1.0, 3.0, new PlanetAnimator(0, 0, 0, 0),
                this.camera, 0xFFFFFF, 3.0, 40.0);        
        this.selectedPlanet = sun;
        this.solarSystem.add(sun);

        // Earth
        let earthAnimator = new PlanetAnimator(15, 0.0005, 1, 0.0);
        let earth = new GlowingPlanet("Terra", 1.0, "earth.jpg", new THREE.Color(0x0081C6), 0.001, 5.0, 0.4, 1.4, earthAnimator, this.camera);
        this.solarSystem.add(earth);

        // Moon
        let moonAnimator = new PlanetAnimator(3, 0.001, 1, 0.0);
        let moon = new Planet("Luna", 1.0/2.0, "moon.jpg", moonAnimator);
        earth.add(moon);

        // Mars
        let marsAnimator = new PlanetAnimator(20, 0.0003, 1, 0.5);
        let mars = new GlowingPlanet("Marte", 0.9, "mars.jpg", new THREE.Color(0xFE8201), 0.001, 10.0, 0.4, 1.4, marsAnimator, this.camera);
        this.solarSystem.add(mars);

        // Jupiter
        let jupiterAnimator = new PlanetAnimator(35, 0.0001, 1, 1.0);
        let jupiter = new GlowingPlanet("Giove", 1.5, "jupiter.jpg", new THREE.Color(0xFE8233), 0.001, 10.0, 0.4, 1.4, jupiterAnimator, this.camera);
        this.solarSystem.add(jupiter);

        // Ganymede
        let ganymedeAnimator = new PlanetAnimator(5, 0.0005, 1, 0.0);
        let ganymede = new Planet("Ganimede", 0.7, "ganymede.jpg", ganymedeAnimator);
        jupiter.add(ganymede);

        // Godrays
        this.godRaysPass = new GodRaysPass(this.scene, this.camera, sun, {
			resolutionScale: 0.6,
			kernelSize: KernelSize.SMALL,
			intensity: 1.0,
			density: 0.96,
			decay: 0.93,
			weight: 0.4,
			exposure: 0.6,
			samples: 60,
			clampMax: 1.0
        });
        this.godRaysPass.renderToScreen = true;
        this.composer.addPass(this.godRaysPass);
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
        this.solarSystem.update(this.t);
    }
}

//
// Entry point
//
window.onload = () => {
    (window as any).app = new SolarSystemApplication();
    (window as any).app.start();
}