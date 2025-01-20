"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const Sphere = () => {
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

    // Add a 3D object to the scene
    const geometry = new THREE.SphereGeometry(15, 32, 16);
    const material = new THREE.MeshBasicMaterial({
      color: "red",
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });

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
    mesh.position.y = 3;

    // Set camera position
    camera.position.z = 35;

    const clock = new THREE.Clock();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 50;
    controls.enableZoom = true;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      // mesh.rotation.x += 0.04;
      // mesh.rotation.y += 0.04;
      // mesh.rotation.z += 0.04;

      mesh.rotation.x = clock.getElapsedTime() * 0.5;
      mesh.rotation.y = clock.getElapsedTime() * 0.5;
      mesh.rotation.z = clock.getElapsedTime() * 0.5;

      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function to remove renderer and free resources
    return () => {
      renderer.dispose();
      mountElement.removeChild(renderer.domElement);
    };
  }, []);

  // The div with the ID for mounting the Three.js renderer
  return (
    <div
      id="three-scene-container"
      // style={{
      //   width: "100vw",
      //   height: "100vh",
      //   overflow: "hidden", // Prevent scrollbars
      //   margin: 0,
      //   padding: 0,
      //   position: "fixed", // Ensures it fills the screen without affecting layout
      //   top: 0,
      //   left: 0,
      // }}
      className="w-full h-full overflow-hidden fixed top-0 left-0"
    />
  );
};

export default Sphere;
