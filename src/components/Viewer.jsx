import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { 
  RefreshCwIcon, 
  ArrowLeftIcon, 
  LayersIcon, 
  CrosshairIcon,
  HomeIcon,
  File3DIcon
} from "./Icons";

export default function Viewer({ 
  modelUrl = null, 
  modelTitle = "Reference Digital Twin Room",
  onReturnToDashboard = null,
  onReturnToSample = null,
  onNavigateToImport = null,
  onModelStats = null 
}) {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(modelUrl));
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadProgressText, setLoadProgressText] = useState("");
  const [error, setError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [cameraCoords, setCameraCoords] = useState({ x: 0, y: 1.6, z: 4 });
  const [modelStats, setLocalModelStats] = useState({
    triangles: 0,
    vertices: 0,
    meshes: 0,
    bounds: null
  });

  // Refs for viewer commands
  const resetCameraRef = useRef(null);
  const toggleWireframeRef = useRef(null);
  const requestLockRef = useRef(null);
  const onModelStatsRef = useRef(onModelStats);

  useEffect(() => {
    onModelStatsRef.current = onModelStats;
  }, [onModelStats]);

  // Generate procedural canvas texture for floor tiles
  const createTileTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Warm wooden / architectural tile base
    ctx.fillStyle = "#8a7565";
    ctx.fillRect(0, 0, 512, 512);

    // Plank lines
    ctx.strokeStyle = "#5a483a";
    ctx.lineWidth = 3;
    const tileSize = 64;
    for (let x = 0; x <= 512; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Grain texture
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    for (let i = 0; i < 2000; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.fillRect(rx, ry, 2, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    return texture;
  };

  // Generate poster texture with Techfest branding
  const createPosterTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Dark background with gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, "#0b1329");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Border
    ctx.strokeStyle = "#00f2fe";
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 984, 472);

    // Header badge
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("IIT BOMBAY TECHFEST 2026-27 • COMPETITION ENTRY", 60, 80);

    // Project Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 76px sans-serif";
    ctx.fillText("NAMMA SPACE", 60, 180);

    // Subtitle
    ctx.fillStyle = "#00f2fe";
    ctx.font = "34px sans-serif";
    ctx.fillText("AI-Powered Indoor Digital Twin Platform", 60, 240);

    // Tech stack details
    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px monospace";
    ctx.fillText("• Photogrammetry Mesh Reconstruction Pipeline", 60, 310);
    ctx.fillText("• Real-Time WebGL 60 FPS First-Person Walkthrough", 60, 350);
    ctx.fillText("• Standard GLB/glTF 3D Digital Twin Specification", 60, 390);

    // Status pill
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(75, 440, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("LIVE DIGITAL TWIN VERIFIED", 100, 448);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let scene;
    let camera;
    let renderer;
    let animationId;
    let loadedModelGroup = null;

    const keys = {};
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    const clock = new THREE.Clock();

    const initialCameraPos = new THREE.Vector3(0, 1.6, 4);

    // Touch / pointer drag variables for mobile and non-pointer-lock look
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };

    // Build realistic sample indoor digital twin room
    function createSampleRoom() {
      const roomGroup = new THREE.Group();
      roomGroup.name = "SampleRoom";

      // 1. Floor with texture
      const floorGeo = new THREE.PlaneGeometry(12, 12);
      const floorMat = new THREE.MeshStandardMaterial({
        map: createTileTexture(),
        roughness: 0.6,
        metalness: 0.1
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      roomGroup.add(floor);

      // 2. Ceiling
      const ceilingGeo = new THREE.PlaneGeometry(12, 12);
      const ceilingMat = new THREE.MeshStandardMaterial({
        color: "#1e293b",
        roughness: 0.9
      });
      const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
      ceiling.position.y = 3.2;
      ceiling.rotation.x = Math.PI / 2;
      roomGroup.add(ceiling);

      // Recessed LED lights on ceiling
      const ledGeo = new THREE.BoxGeometry(8, 0.05, 0.4);
      const ledMat = new THREE.MeshBasicMaterial({ color: "#e0f2fe" });
      const led1 = new THREE.Mesh(ledGeo, ledMat);
      led1.position.set(0, 3.18, -2);
      roomGroup.add(led1);

      const led2 = new THREE.Mesh(ledGeo, ledMat);
      led2.position.set(0, 3.18, 2);
      roomGroup.add(led2);

      // 3. Walls
      const wallMat = new THREE.MeshStandardMaterial({
        color: "#f1f5f9",
        roughness: 0.85
      });
      const darkAccentMat = new THREE.MeshStandardMaterial({
        color: "#334155",
        roughness: 0.7
      });

      function addWall(x, y, z, w, h, d, mat = wallMat) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        wall.position.set(x, y, z);
        wall.receiveShadow = true;
        wall.castShadow = true;
        roomGroup.add(wall);
        return wall;
      }

      // Back wall
      addWall(0, 1.6, -6, 12, 3.2, 0.2, darkAccentMat);
      // Left wall
      addWall(-6, 1.6, 0, 0.2, 3.2, 12);
      // Right wall
      addWall(6, 0.6, 0, 0.2, 1.2, 12);
      addWall(6, 2.7, 0, 0.2, 1.0, 12);
      addWall(6, 1.7, -4.5, 0.2, 1.2, 3);
      addWall(6, 1.7, 4.5, 0.2, 1.2, 3);

      // Window Glass & Sky backdrop
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: "#93c5fd",
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.9
      });
      const windowGlass = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.2, 6), glassMat);
      windowGlass.position.set(6, 1.7, 0);
      roomGroup.add(windowGlass);

      const skyGeo = new THREE.PlaneGeometry(16, 8);
      const skyMat = new THREE.MeshBasicMaterial({ color: "#38bdf8" });
      const skyPlane = new THREE.Mesh(skyGeo, skyMat);
      skyPlane.position.set(9, 2.5, 0);
      skyPlane.rotation.y = -Math.PI / 2;
      roomGroup.add(skyPlane);

      // Front wall with doorway
      addWall(-3.5, 1.6, 6, 5, 3.2, 0.2);
      addWall(3.5, 1.6, 6, 5, 3.2, 0.2);
      addWall(0, 2.7, 6, 2, 1.0, 0.2);

      // 4. Framed Techfest Poster on Back Wall
      const posterGeo = new THREE.PlaneGeometry(4.2, 2.1);
      const posterMat = new THREE.MeshBasicMaterial({ map: createPosterTexture() });
      const poster = new THREE.Mesh(posterGeo, posterMat);
      poster.position.set(0, 1.7, -5.88);
      roomGroup.add(poster);

      // 5. Workstation Desk Setup
      const deskTop = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.1, 1.4),
        new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.4 })
      );
      deskTop.position.set(-3.2, 0.8, -4.2);
      deskTop.castShadow = true;
      roomGroup.add(deskTop);

      // Desk Legs
      const legMat = new THREE.MeshStandardMaterial({ color: "#475569", metalness: 0.7, roughness: 0.3 });
      function addDeskLeg(lx, lz) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), legMat);
        leg.position.set(-3.2 + lx, 0.4, -4.2 + lz);
        roomGroup.add(leg);
      }
      addDeskLeg(-1.4, -0.5);
      addDeskLeg(1.4, -0.5);
      addDeskLeg(-1.4, 0.5);
      addDeskLeg(1.4, 0.5);

      // Dual Monitors
      const monStand = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.3), legMat);
      monStand.position.set(-3.2, 0.86, -4.5);
      roomGroup.add(monStand);

      const screenGeo = new THREE.BoxGeometry(1.3, 0.7, 0.05);
      const screenActiveMat = new THREE.MeshBasicMaterial({ color: "#0284c7" });
      const mon1 = new THREE.Mesh(screenGeo, screenActiveMat);
      mon1.position.set(-3.9, 1.35, -4.5);
      mon1.rotation.y = 0.15;
      roomGroup.add(mon1);

      const mon2 = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ color: "#4f46e5" }));
      mon2.position.set(-2.5, 1.35, -4.5);
      mon2.rotation.y = -0.15;
      roomGroup.add(mon2);

      // Chair
      const chairBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.08, 16),
        new THREE.MeshStandardMaterial({ color: "#0f172a" })
      );
      chairBase.position.set(-3.2, 0.5, -3.2);
      roomGroup.add(chairBase);

      const chairSeat = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.12, 0.7),
        new THREE.MeshStandardMaterial({ color: "#0284c7", roughness: 0.8 })
      );
      chairSeat.position.set(-3.2, 0.6, -3.2);
      roomGroup.add(chairSeat);

      const chairBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.8, 0.1),
        new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.7 })
      );
      chairBack.position.set(-3.2, 1.1, -2.8);
      roomGroup.add(chairBack);

      // 6. Bookshelf
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 2.2, 2.4),
        new THREE.MeshStandardMaterial({ color: "#78350f", roughness: 0.7 })
      );
      shelf.position.set(3.8, 1.1, -4.8);
      roomGroup.add(shelf);

      // Books
      const bookColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
      for (let i = 0; i < 8; i++) {
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.35 + (i % 3) * 0.05, 0.08),
          new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length] })
        );
        book.position.set(3.8, 1.4, -5.6 + i * 0.18);
        roomGroup.add(book);
      }

      // 7. Potted Indoor Plant
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.25, 0.7, 16),
        new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.3 })
      );
      pot.position.set(4.8, 0.35, 4.5);
      roomGroup.add(pot);

      const plantLeafMat = new THREE.MeshStandardMaterial({ color: "#15803d", roughness: 0.6 });
      for (let i = 0; i < 6; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 8), plantLeafMat);
        leaf.position.set(
          4.8 + Math.sin(i * 1.05) * 0.2, 
          0.9 + (i % 2) * 0.1, 
          4.5 + Math.cos(i * 1.05) * 0.2
        );
        leaf.rotation.z = Math.sin(i) * 0.4;
        roomGroup.add(leaf);
      }

      scene.add(roomGroup);
      loadedModelGroup = roomGroup;

      initialCameraPos.set(0, 1.6, 4);
      camera.position.copy(initialCameraPos);
      camera.rotation.set(0, 0, 0);

      computeSceneStats(roomGroup);
    }

    function computeSceneStats(rootObject) {
      let triangles = 0;
      let vertices = 0;
      let meshes = 0;
      const box = new THREE.Box3().setFromObject(rootObject);

      rootObject.traverse((obj) => {
        if (obj.isMesh && obj.geometry) {
          meshes++;
          const geo = obj.geometry;
          if (geo.index) {
            triangles += geo.index.count / 3;
          } else if (geo.attributes.position) {
            triangles += geo.attributes.position.count / 3;
          }
          if (geo.attributes.position) {
            vertices += geo.attributes.position.count;
          }
        }
      });

      const stats = {
        triangles: Math.round(triangles),
        vertices: Math.round(vertices),
        meshes,
        bounds: {
          width: (box.max.x - box.min.x).toFixed(1),
          height: (box.max.y - box.min.y).toFixed(1),
          depth: (box.max.z - box.min.z).toFixed(1)
        }
      };

      setLocalModelStats(stats);
      if (onModelStatsRef.current) onModelStatsRef.current(stats);
    }

    function disposeScene() {
      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach((m) => {
              if (m.map) m.map.dispose();
              if (m.lightMap) m.lightMap.dispose();
              if (m.bumpMap) m.bumpMap.dispose();
              if (m.normalMap) m.normalMap.dispose();
              if (m.specularMap) m.specularMap.dispose();
              if (m.envMap) m.envMap.dispose();
              if (m.roughnessMap) m.roughnessMap.dispose();
              if (m.metalnessMap) m.metalnessMap.dispose();
              if (m.alphaMap) m.alphaMap.dispose();
              m.dispose();
            });
          }
        });
      }
      if (renderer) renderer.dispose();
    }

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#090d16");
      scene.fog = new THREE.FogExp2("#090d16", 0.02);

      camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        200
      );
      camera.position.copy(initialCameraPos);
      camera.rotation.order = "YXZ";

      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // Lighting system
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.8);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
      dirLight.position.set(6, 9, 5);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      scene.add(dirLight);

      // Fill ambient light for indoor shadows
      const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
      fillLight.position.set(-6, 4, -4);
      scene.add(fillLight);

      // Warm interior point light
      const interiorLight = new THREE.PointLight(0xfef08a, 1.2, 16);
      interiorLight.position.set(0, 2.8, 0);
      scene.add(interiorLight);

      // Model loading vs Sample room
      if (modelUrl) {
        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            const root = gltf.scene;
            root.name = "ImportedModel";

            // Compute bounding box
            const box = new THREE.Box3().setFromObject(root);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Normalize scale if excessively tiny (< 0.5m) or huge (> 60m)
            const maxDim = Math.max(size.x, size.y, size.z, 0.001);
            if (maxDim > 60 || maxDim < 0.5) {
              const targetDim = 10;
              const scale = targetDim / maxDim;
              root.scale.set(scale, scale, scale);
              // Re-evaluate bounding box after scaling
              box.setFromObject(root);
              box.getSize(size);
              box.getCenter(center);
            }

            // Align bottom to y = 0 and center X and Z
            root.position.x -= center.x;
            root.position.y -= box.min.y;
            root.position.z -= center.z;

            // Enable shadows and double-sided materials so interior walls are visible
            root.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((m) => { m.side = THREE.DoubleSide; });
                  } else {
                    child.material.side = THREE.DoubleSide;
                  }
                }
              }
            });

            scene.add(root);
            loadedModelGroup = root;
            computeSceneStats(root);

            // Position camera nicely facing the model
            const camZ = Math.min(Math.max(size.z * 0.75, 3.2), 22);
            initialCameraPos.set(0, 1.6, camZ);
            camera.position.copy(initialCameraPos);
            camera.rotation.set(0, 0, 0);

            setIsLoading(false);
          },
          (xhr) => {
            if (xhr.lengthComputable && xhr.total > 0) {
              const percent = Math.round((xhr.loaded / xhr.total) * 100);
              setLoadProgress(percent);
              setLoadProgressText(`${percent}%`);
            } else if (xhr.loaded > 0) {
              const mb = (xhr.loaded / (1024 * 1024)).toFixed(1);
              setLoadProgressText(`${mb} MB loaded`);
            }
          },
          (err) => {
            console.error("Failed to load 3D model:", err);
            const errMsg = err?.message || "Invalid or corrupt 3D format.";
            setError(`Failed to load 3D model: ${errMsg}. If this is a .gltf file with external .bin or texture assets, please package it as a standalone .glb binary file.`);
            createSampleRoom();
            setIsLoading(false);
          }
        );
      } else {
        createSampleRoom();
      }

      // Input Listeners
      function onKeyDown(event) {
        keys[event.code] = true;
      }

      function onKeyUp(event) {
        keys[event.code] = false;
      }

      function onBlur() {
        Object.keys(keys).forEach(k => delete keys[k]);
        isDragging = false;
      }

      function onPointerLockChange() {
        const locked = document.pointerLockElement === renderer.domElement;
        setIsLocked(locked);
      }

      // Mouse Look and Touch Drag Handler
      function onPointerDown(e) {
        isDragging = true;
        prevPointer = { x: e.clientX, y: e.clientY };
      }

      function onPointerUp() {
        isDragging = false;
      }

      function onPointerMove(e) {
        if (document.pointerLockElement === renderer.domElement) {
          // Pointer Lock mode (desktop FPS)
          camera.rotation.y -= e.movementX * 0.0022;
          camera.rotation.x -= e.movementY * 0.0022;
        } else if (isDragging) {
          // Click & drag mode (desktop free look or mobile/tablet touch)
          const deltaX = e.clientX - prevPointer.x;
          const deltaY = e.clientY - prevPointer.y;
          prevPointer = { x: e.clientX, y: e.clientY };
          camera.rotation.y -= deltaX * 0.0035;
          camera.rotation.x -= deltaY * 0.0035;
        }

        // Clamp vertical look angle so camera cannot flip upside down
        camera.rotation.x = THREE.MathUtils.clamp(
          camera.rotation.x,
          -Math.PI / 2 + 0.08,
          Math.PI / 2 - 0.08
        );
      }

      function onClick() {
        if (document.pointerLockElement !== renderer.domElement) {
          renderer.domElement.requestPointerLock();
        }
      }

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.addEventListener("blur", onBlur);
      document.addEventListener("pointerlockchange", onPointerLockChange);
      
      renderer.domElement.addEventListener("click", onClick);
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointerup", onPointerUp);
      renderer.domElement.addEventListener("pointermove", onPointerMove);

      // Expose controls to React buttons
      resetCameraRef.current = () => {
        camera.position.copy(initialCameraPos);
        camera.rotation.set(0, 0, 0);
        Object.keys(keys).forEach(k => delete keys[k]);
      };

      toggleWireframeRef.current = () => {
        setIsWireframe((prev) => {
          const next = !prev;
          if (loadedModelGroup) {
            loadedModelGroup.traverse((obj) => {
              if (obj.isMesh && obj.material) {
                if (Array.isArray(obj.material)) {
                  obj.material.forEach(m => m.wireframe = next);
                } else {
                  obj.material.wireframe = next;
                }
              }
            });
          }
          return next;
        });
      };

      requestLockRef.current = () => {
        renderer.domElement.requestPointerLock();
      };

      function resize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }

      window.addEventListener("resize", resize);

      // Animation Loop
      let lastCoordUpdate = 0;
      function animate(time) {
        animationId = requestAnimationFrame(animate);

        const delta = Math.min(clock.getDelta(), 0.05);
        const isSprinting = keys["ShiftLeft"] || keys["ShiftRight"];
        const moveSpeed = (isSprinting ? 5.5 : 3.2) * delta;

        // Forward vector (XZ plane)
        direction.set(
          -Math.sin(camera.rotation.y),
          0,
          -Math.cos(camera.rotation.y)
        ).normalize();

        // Right vector (XZ plane)
        right.set(
          Math.cos(camera.rotation.y),
          0,
          -Math.sin(camera.rotation.y)
        ).normalize();

        // WASD & Arrow Key controls
        if (keys["KeyW"] || keys["ArrowUp"]) camera.position.addScaledVector(direction, moveSpeed);
        if (keys["KeyS"] || keys["ArrowDown"]) camera.position.addScaledVector(direction, -moveSpeed);
        if (keys["KeyA"] || keys["ArrowLeft"]) camera.position.addScaledVector(right, -moveSpeed);
        if (keys["KeyD"] || keys["ArrowRight"]) camera.position.addScaledVector(right, moveSpeed);

        // Keep camera walking at realistic human eye height
        camera.position.y = 1.6;

        // Soft collision bounds to prevent walking into infinity
        if (!modelUrl) {
          camera.position.x = THREE.MathUtils.clamp(camera.position.x, -5.4, 5.4);
          camera.position.z = THREE.MathUtils.clamp(camera.position.z, -5.4, 5.4);
        } else {
          camera.position.x = THREE.MathUtils.clamp(camera.position.x, -40, 40);
          camera.position.z = THREE.MathUtils.clamp(camera.position.z, -40, 40);
        }

        // Throttle coordinate updates to React state
        if (time - lastCoordUpdate > 120) {
          lastCoordUpdate = time;
          setCameraCoords({
            x: Number(camera.position.x.toFixed(2)),
            y: Number(camera.position.y.toFixed(2)),
            z: Number(camera.position.z.toFixed(2))
          });
        }

        renderer.render(scene, camera);
      }

      animate(0);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("blur", onBlur);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointerup", onPointerUp);
        document.removeEventListener("pointerlockchange", onPointerLockChange);

        if (renderer.domElement) {
          renderer.domElement.removeEventListener("click", onClick);
          renderer.domElement.removeEventListener("pointerdown", onPointerDown);
          renderer.domElement.removeEventListener("pointermove", onPointerMove);
        }

        if (document.pointerLockElement === renderer.domElement) {
          document.exitPointerLock();
        }

        disposeScene();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (err) {
      console.error("Viewer initialization error:", err);
      queueMicrotask(() => {
        setError("Failed to initialize WebGL 3D viewer: " + err.message);
        setIsLoading(false);
      });
      disposeScene();
    }
  }, [modelUrl]);

  return (
    <div className="viewer-wrapper">
      {/* Top Toolbar */}
      <div className="viewer-header-bar">
        <div className="viewer-title-group">
          {onReturnToDashboard && (
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onReturnToDashboard}
              title="Return to Dashboard"
            >
              <ArrowLeftIcon size={16} />
              <span>Dashboard</span>
            </button>
          )}

          <div className="viewer-model-badge">
            <span className="live-pulse"></span>
            <strong>{modelTitle}</strong>
          </div>

          {/* Return to Reference Sample Room button */}
          {modelUrl && onReturnToSample && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onReturnToSample}
              title="Switch back to Reference Digital Twin Room"
            >
              <HomeIcon size={15} />
              <span>Reference Room</span>
            </button>
          )}
        </div>

        <div className="viewer-actions-group">
          {onNavigateToImport && (
            <button 
              className="btn btn-outline btn-sm" 
              onClick={onNavigateToImport}
              title="Import another 3D model"
            >
              <File3DIcon size={15} />
              <span>Import Model</span>
            </button>
          )}

          <button 
            className="btn btn-outline btn-sm" 
            onClick={() => resetCameraRef.current && resetCameraRef.current()}
            title="Reset camera position and look orientation"
          >
            <RefreshCwIcon size={15} />
            <span>Reset View</span>
          </button>

          <button 
            className={`btn btn-sm ${isWireframe ? 'btn-accent' : 'btn-outline'}`}
            onClick={() => toggleWireframeRef.current && toggleWireframeRef.current()}
            title="Toggle Wireframe Mesh Mode"
          >
            <LayersIcon size={15} />
            <span>Wireframe: {isWireframe ? 'ON' : 'OFF'}</span>
          </button>

          <button 
            className={`btn btn-sm ${isLocked ? 'btn-success' : 'btn-primary'}`}
            onClick={() => requestLockRef.current && requestLockRef.current()}
            title="Lock cursor for full 3D mouse look"
          >
            <CrosshairIcon size={16} />
            <span>{isLocked ? "First-Person Active" : "Enter First-Person"}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Mount */}
      <div ref={mountRef} className="viewer-canvas-container">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="viewer-overlay loading-overlay">
            <div className="spinner"></div>
            <div className="loading-title">Loading 3D Digital Twin...</div>
            {loadProgress > 0 ? (
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${loadProgress}%` }}></div>
                <span className="progress-text">{loadProgress}%</span>
              </div>
            ) : loadProgressText ? (
              <div className="loading-bytes-text">{loadProgressText}</div>
            ) : null}
            <div className="loading-subtitle">Synthesizing WebGL scene geometry and PBR materials</div>
          </div>
        )}

        {/* Error Notification with recovery actions */}
        {error && (
          <div className="viewer-overlay error-overlay">
            <div className="error-title">⚠️ 3D Model Loading Notice</div>
            <div className="error-message">{error}</div>
            <div className="error-actions-row">
              {onReturnToSample && (
                <button className="btn btn-primary btn-sm" onClick={onReturnToSample}>
                  <HomeIcon size={15} />
                  <span>Return to Reference Room</span>
                </button>
              )}
              {onNavigateToImport && (
                <button className="btn btn-outline btn-sm" onClick={onNavigateToImport}>
                  <File3DIcon size={15} />
                  <span>Import Another Model</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* First Person Active HUD notification */}
        {isLocked && (
          <div className="hud-pointer-locked-banner">
            <span className="hud-icon">🎮</span>
            <span>First-Person Mode Active • Move Mouse to Look • <strong>ESC</strong> to Release Cursor</span>
          </div>
        )}

        {/* Spatial Coordinates & Stats HUD Overlay */}
        <div className="hud-telemetry-panel">
          <div className="hud-row">
            <span className="hud-label">POS:</span>
            <span className="hud-val font-mono">X: {cameraCoords.x} | Y: {cameraCoords.y} | Z: {cameraCoords.z}</span>
          </div>
          {modelStats.triangles > 0 && (
            <div className="hud-row">
              <span className="hud-label">MESH:</span>
              <span className="hud-val font-mono">
                {modelStats.triangles.toLocaleString()} Polys · {modelStats.meshes} Meshes
              </span>
            </div>
          )}
          {modelStats.bounds && (
            <div className="hud-row">
              <span className="hud-label">BOUNDS:</span>
              <span className="hud-val font-mono">
                {modelStats.bounds.width}m × {modelStats.bounds.height}m × {modelStats.bounds.depth}m
              </span>
            </div>
          )}
        </div>

        {/* Click to Look Hint when unlocked */}
        {!isLocked && !isLoading && (
          <div className="click-to-interact-hint" onClick={() => requestLockRef.current && requestLockRef.current()}>
            <span>🖱️ Click or drag to look around • WASD to walk</span>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="viewer-footer-controls">
        <div className="control-chip">
          <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> Move
        </div>
        <div className="control-chip">
          <kbd>Shift</kbd> Sprint Walk
        </div>
        <div className="control-chip">
          <kbd>Mouse</kbd> Click / Drag / Look
        </div>
        <div className="control-chip">
          <kbd>Esc</kbd> Unlock Cursor
        </div>
        <div className="control-chip">
          <span>Eye height locked at 1.6m</span>
        </div>
      </div>
    </div>
  );
}
