"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as lil from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const StudioLightScene = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let model: any;

    const mountElement = document.getElementById("three-scene-container");
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

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountElement.appendChild(renderer.domElement);

    // Load the GLB model
    const loader = new GLTFLoader();

    loader.load(
      "/buddha_-_100k_vertices_decimation.glb",
      // "https://drive.google.com/uc?export=download&id=1l1Nag3LSCsOc4Bt1QzKVPyoE00YBHOwc",

      (gltf) => {
        model = gltf.scene;

        // Compute the bounding box to center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Reset model's position to the center
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        // Optionally scale the model to fit in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 3 / maxDim; // Adjust this value for desired size
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Set the OrbitControls target to the model's center

        controls.target.copy(center);
        // controls.update();

        // Traverse the model and set material properties
        model.traverse(
          (
            child: THREE.Mesh<
              THREE.BufferGeometry<THREE.NormalBufferAttributes>,
              THREE.Material | THREE.Material[],
              THREE.Object3DEventMap
            >
          ) => {
            if ((child as THREE.Mesh).isMesh) {
              // Type casting to Mesh
              const mesh = child as THREE.Mesh; // Type cast to Mesh

              // Check if the mesh has a single material or an array of materials
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((material) => {
                  if (material instanceof THREE.MeshStandardMaterial) {
                    material.roughness = 0.5;
                    material.metalness = 0.5;
                  }
                });
              } else {
                // If it's a single material
                if (mesh.material instanceof THREE.MeshStandardMaterial) {
                  mesh.material = new THREE.MeshStandardMaterial({
                    color: mesh.material.color, // Preserve the original color
                    roughness: 0.5, // Default roughness
                    metalness: 0.5, // Default metalness
                  });
                }
              }
            }
          }
        );

        scene.add(model);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    // Add studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight3.position.set(0, 10, 0);
    scene.add(directionalLight3);

    // Camera position
    camera.position.set(3, 3, 5);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // GUI for debugging lights
    const gui = new lil.GUI();

    // Add roughness control
    const materialProperties = {
      roughness: 0.5,
      metalness: 0.5,
    };

    gui
      .add(materialProperties, "roughness", 0, 1, 0.01)
      .name("Roughness")
      .onChange((value: number) => {
        model.traverse((child: unknown) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material instanceof THREE.MeshStandardMaterial) {
              mesh.material.roughness = value;
            }
          }
        });
      });
    // Add metalness control
    gui
      .add(materialProperties, "metalness", 0, 1, 0.01)
      .name("Metalness")
      .onChange((value: number) => {
        model.traverse(
          (
            child: THREE.Mesh<
              THREE.BufferGeometry<THREE.NormalBufferAttributes>,
              THREE.Material | THREE.Material[],
              THREE.Object3DEventMap
            >
          ) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.metalness = value;
              }
            }
          }
        );
      });

    // Ambient Light GUI
    const ambientLightFolder = gui.addFolder("Ambient Light");
    ambientLightFolder
      .add(ambientLight, "intensity", 0, 2, 0.01)
      .name("Intensity");
    ambientLightFolder
      .addColor(new THREE.Color(ambientLight.color), "getHex")
      .name("Color")
      .onChange((value: THREE.ColorRepresentation) =>
        ambientLight.color.set(value)
      );
    ambientLightFolder.open();

    // Directional Light 1 GUI
    const directionalLight1Folder = gui.addFolder("Directional Light 1");
    directionalLight1Folder
      .add(directionalLight1, "intensity", 0, 2, 0.01)
      .name("Intensity");
    directionalLight1Folder
      .addColor(new THREE.Color(directionalLight1.color), "getHex")
      .name("Color")
      .onChange((value: THREE.ColorRepresentation) =>
        directionalLight1.color.set(value)
      );
    directionalLight1Folder
      .add(directionalLight1.position, "x", -10, 10, 0.1)
      .name("Position X");
    directionalLight1Folder
      .add(directionalLight1.position, "y", -10, 10, 0.1)
      .name("Position Y");
    directionalLight1Folder
      .add(directionalLight1.position, "z", -10, 10, 0.1)
      .name("Position Z");
    directionalLight1Folder.open();

    // Directional Light 2 GUI
    const directionalLight2Folder = gui.addFolder("Directional Light 2");
    directionalLight2Folder
      .add(directionalLight2, "intensity", 0, 2, 0.01)
      .name("Intensity");
    directionalLight2Folder
      .addColor(new THREE.Color(directionalLight2.color), "getHex")
      .name("Color")
      .onChange((value: THREE.ColorRepresentation) =>
        directionalLight2.color.set(value)
      );
    directionalLight2Folder
      .add(directionalLight2.position, "x", -10, 10, 0.1)
      .name("Position X");
    directionalLight2Folder
      .add(directionalLight2.position, "y", -10, 10, 0.1)
      .name("Position Y");
    directionalLight2Folder
      .add(directionalLight2.position, "z", -10, 10, 0.1)
      .name("Position Z");
    directionalLight2Folder.open();

    // Directional Light 3 GUI
    const directionalLight3Folder = gui.addFolder("Directional Light 3");
    directionalLight3Folder
      .add(directionalLight3, "intensity", 0, 2, 0.01)
      .name("Intensity");
    directionalLight3Folder
      .addColor(new THREE.Color(directionalLight3.color), "getHex")
      .name("Color")
      .onChange((value: THREE.ColorRepresentation) =>
        directionalLight3.color.set(value)
      );
    directionalLight3Folder
      .add(directionalLight3.position, "x", -10, 10, 0.1)
      .name("Position X");
    directionalLight3Folder
      .add(directionalLight3.position, "y", -10, 10, 0.1)
      .name("Position Y");
    directionalLight3Folder
      .add(directionalLight3.position, "z", -10, 10, 0.1)
      .name("Position Z");
    directionalLight3Folder.open();

    // Handle resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);

      if (renderer.domElement.parentElement === mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
      gui.destroy();
    };
  }, []);

  return (
    <div id="three-scene-container" className="fixed inset-0 overflow-hidden" />
  );
};

export default StudioLightScene;
