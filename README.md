# SolarSystem
Assignment for Javascript course.

Test it here: https://rawgit.com/giulioz/SolarSystem/master/dist/index.html

## Usage
The project is already compiled in the *dist* folder, you must serve it using a web server. To start a web server type:
```
npm install
npm test
```
This will start the web server listening at port 8080.

### Compiling
The project is written in Typescript, it must be compiled after editing:
```
npm install --only=dev
npm run-script build
```

## Description
- ``app.ts`` is the main application file
- ``BaseApplication.ts`` contains general-purpose THREE.js application abstract class (boilerplate code)
- ``PlanetObjects.ts`` contains the planet classes
- ``OrbitControls.ts`` is a Typescript port of THREE.js OrbitControls
- ``stats.ts`` is a Typescript port of an fps counter