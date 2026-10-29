
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Viewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#211714");

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.set(0, 1.6, 4);
    camera.rotation.order = "YXZ";

    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    container.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(
      0xffffff, 0x625047, 2
    ));

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(3, 6, 4);
    scene.add(light);

    // Temporary sample room.
    // Replace this scene with your reconstructed model later.
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshStandardMaterial({
        color: "#b9a89a",
        roughness: 0.9
      })
    );

    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    function addWall(x, y, z, w, h, d) {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({
          color: "#e1d5c9"
        })
      );

      wall.position.set(x, y, z);
      scene.add(wall);
    }

    addWall(0, 1.5, -6, 12, 3, 0.2);
    addWall(-6, 1.5, 0, 0.2, 3, 12);
    addWall(6, 1.5, 0, 0.2, 3, 12);
    addWall(0, 1.5, 6, 12, 3, 0.2);

    // Temporary furniture
    function addFurniture(x, y, z, w, h, d, color) {
      const item = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color })
      );

      item.position.set(x, y, z);
      scene.add(item);
    }

    addFurniture(-2, 0.5, -2, 2, 1, 1, "#795548");
    addFurniture(2, 0.4, -3, 1.5, 0.8, 0.8, "#657b83");

    const keys = {};

    function onKeyDown(event) {
      keys[event.code] = true;
    }

    function onKeyUp(event) {
      keys[event.code] = false;
    }

    function onMouseMove(event) {
      if (document.pointerLockElement !== renderer.domElement) {
        return;
      }

      camera.rotation.y -= event.movementX * 0.002;
      camera.rotation.x -= event.movementY * 0.002;

      camera.rotation.x = THREE.MathUtils.clamp(
        camera.rotation.x,
        -Math.PI / 2 + 0.05,
        Math.PI / 2 - 0.05
      );
    }

    function onClick() {
      renderer.domElement.requestPointerLock();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onClick);

    function resize() {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener("resize", resize);

    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    const clock = new THREE.Clock();

    let animationId;

    function animate() {
      animationId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const speed = 3 * delta;

      direction.set(
        -Math.sin(camera.rotation.y),
        0,
        -Math.cos(camera.rotation.y)
      );

      right.set(
        Math.cos(camera.rotation.y),
        0,
        -Math.sin(camera.rotation.y)
      );

      if (keys["KeyW"]) camera.position.addScaledVector(direction, speed);
      if (keys["KeyS"]) camera.position.addScaledVector(direction, -speed);
      if (keys["KeyA"]) camera.position.addScaledVector(right, -speed);
      if (keys["KeyD"]) camera.position.addScaledVector(right, speed);

      // Keep the camera at walking height.
      camera.position.y = 1.6;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("click", onClick);

      if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock();
      }

      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="viewer" />;
}
