"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as lil from "lil-gui";

const BoxMaterial = () => {
  useEffect(() => {
    // Get the mounting element by its ID
    const mountElement = document.getElementById("three-scene-container");

    // Ensure the element exists
    if (!mountElement) return;

    // Set up the Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    scene.add(camera);

    // Loading the Texture
    const textureLoader = new THREE.TextureLoader();
    const color = textureLoader.load("/texture/color.jpg", () => {
      console.log("Texture loaded successfully!");
    });
    const roughness = textureLoader.load("/texture/roughness.jpg");
    const normal = textureLoader.load("/texture/normal.png");

    // Add a 3D object to the scene
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      map: color,
      roughnessMap: roughness,
      normalMap: normal,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 1. Ambient light for general illumination
    const ambientLight = new THREE.AmbientLight("#F5F5DC", 0.5); // Soft white light
    scene.add(ambientLight);

    // 2. Directional light for key light
    const directionalLight = new THREE.DirectionalLight("#F5F5DC", 1);
    directionalLight.position.set(1.9, 3.8, 2.4); // Set the position of the light
    directionalLight.castShadow = true; // Enable shadows
    scene.add(directionalLight);

    // 3. Spotlight for dramatic effects
    const spotLight = new THREE.SpotLight("#F5F5DC", 1); // Ensure sufficient intensity
    spotLight.position.set(15, 5, 45); // Position closer to the object
    spotLight.castShadow = true; // Enable shadows
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 20;

    // Target the mesh
    spotLight.target = mesh;
    scene.add(spotLight.target);

    // Add the spotlight to the scene
    scene.add(spotLight);

    // 4. PointLight for dramatic effects
    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(0.1, -0.3, 0);
    scene.add(pointLight);

    // Add light helpers
    const ambientLightHelper = new THREE.AxesHelper(5); // Ambient light doesn't have a helper, using AxesHelper for visualization
    scene.add(ambientLightHelper);

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      2
    );
    scene.add(directionalLightHelper);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(pointLightHelper);

    // Update SpotLightHelper on each frame
    const updateHelper = () => {
      spotLightHelper.update();
    };

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true; // Enable shadows in the renderer

    // Attach the renderer to the DOM
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountElement.appendChild(renderer.domElement);

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // Set mesh position
    mesh.position.x = 0;
    mesh.position.y = 1;

    // Set camera position
    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 50;
    controls.enableZoom = true;

    // GUI
    const gui = new lil.GUI();
    const meshFolder = gui.addFolder("Mesh Rotation");
    meshFolder.add(mesh.rotation, "x", 0, Math.PI * 2, 0.01).name("Rotation X");
    meshFolder.add(mesh.rotation, "y", 0, Math.PI * 2, 0.01).name("Rotation Y");
    meshFolder.add(mesh.rotation, "z", 0, Math.PI * 2, 0.01).name("Rotation Z");
    meshFolder.open();

    const materialFolder = gui.addFolder("Material");
    materialFolder.add(material, "metalness", 0, 1, 0.01).name("Metalness");
    materialFolder.add(material, "roughness", 0, 1, 0.01).name("Roughness");
    materialFolder.open();

    // Inside the useEffect function where the GUI is being set up
    const positionFolder = gui.addFolder("Light Positions");

    // DirectionalLight position controls
    const directionalLightPositionFolder = positionFolder.addFolder(
      "Directional Light Position"
    );
    directionalLightPositionFolder
      .add(directionalLight.position, "x", -10, 10, 0.1)
      .name("X Position");
    directionalLightPositionFolder
      .add(directionalLight.position, "y", -10, 10, 0.1)
      .name("Y Position");
    directionalLightPositionFolder
      .add(directionalLight.position, "z", -10, 10, 0.1)
      .name("Z Position");
    directionalLightPositionFolder
      .add(directionalLight, "intensity", 0, 2, 0.01)
      .name("Directional Light");
    directionalLightPositionFolder.open();

    // PointLight position controls
    const pointLightPositionFolder = positionFolder.addFolder(
      "Point Light Position"
    );
    pointLightPositionFolder
      .add(pointLight.position, "x", -10, 10, 0.1)
      .name("X Position");
    pointLightPositionFolder
      .add(pointLight.position, "y", -10, 10, 0.1)
      .name("Y Position");
    pointLightPositionFolder
      .add(pointLight.position, "z", -10, 10, 0.1)
      .name("Z Position");
    pointLightPositionFolder
      .add(pointLight, "intensity", 0, 2, 0.01)
      .name("Point Light");
    pointLightPositionFolder.open();

    // Ambient Light position controls
    const ambientLightPositionFolder = positionFolder.addFolder(
      "Ambient Light Position"
    );
    ambientLightPositionFolder
      .add(ambientLight, "intensity", 0, 2, 0.01)
      .name("Ambient Light");

    // Setting Clock
    // const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      // mesh.rotation.x += 0.04;
      // mesh.rotation.y += 0.04;
      // mesh.rotation.z += 0.04;

      // mesh.rotation.x = clock.getElapsedTime() * 0.5;
      // mesh.rotation.y = clock.getElapsedTime() * 0.5;
      // mesh.rotation.z = clock.getElapsedTime() * 0.5;

      controls.update();
      updateHelper();

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function to remove renderer and free resources
    return () => {
      renderer.dispose();
      mountElement.removeChild(renderer.domElement);
      gui.destroy();
    };
  }, []);

  // The div with the ID for mounting the Three.js renderer
  return (
    <div
      id="three-scene-container"
      // className="w-full h-full overflow-hidden fixed top-0 left-0"
      className="fixed inset-0 overflow-hidden"
    />
  );
};

export default BoxMaterial;
