# 🏛️ NAMMA SPACE — AI-Powered Indoor Digital Twin Platform
### *Developed for IIT Bombay Techfest 2026–27*

> **Namma Space** is an open-standard, browser-first indoor digital twin platform. It enables users to capture or upload overlapping photographs of any indoor room, inspect the photogrammetry reconstruction pipeline, and interactively explore 3D spaces in real-time WebGL at 60 FPS — requiring zero desktop software, app downloads, or browser extensions.

---

## 🌟 Key Features

### 1. 🚀 Modern Landing Page & Navigation
* Sleek technology aesthetic with deep navy slate backdrop and electric cyan/blue neon accents.
* Live WebGL status telemetry, interactive preview frame, feature showcase, and pipeline flow.
* Full single-page hash navigation (`#home`, `#dashboard`, `#upload`, `#reconstruction`, `#import`, `#viewer`, `#how-it-works`, `#about`).

### 2. 🕹️ Interactive 3D Spatial Viewer (Three.js WebGL)
* **First-Person Walkthrough:** WASD keyboard navigation + Arrow keys support.
* **Sprint Mode:** Hold `Shift` for accelerated walking speed.
* **Mouse-Look:** Pointer-lock first-person view with vertical angle clamping (prevents camera flipping).
* **Realistic Scale:** Camera locked to standard human eye height (`1.6m`).
* **Room Boundary Collisions:** Soft room boundary clamping prevents falling into the void.
* **Wireframe Analysis Mode:** One-click toggle between PBR materials and underlying polygon topology (ideal for competition judges).
* **View Reset:** Smoothly resets camera position to origin `(0, 1.6, 4)` and forward orientation.
* **Real-Time Telemetry HUD:** Displays camera `(X, Y, Z)` position, polygon count, mesh count, and bounding box dimensions in meters.
* **Rich Procedural Reference Room:** Pre-configured with textured wooden tile floor, recessed LED ceiling lights, workstation desk with dual monitors, chair, bookshelf, indoor potted plant, daylight window, and an official IIT Bombay Techfest banner!

### 3. 📸 Indoor Photo Upload & Spatial Quality Analysis
* Drag-and-drop or file browser multi-image ingestion (`JPG`, `JPEG`, `PNG`, `WebP`).
* Real-time image previews with filename, size in KB, and individual removal buttons.
* Automated spatial coverage validation (`<3 photos`: warning; `3–10 photos`: basic; `10+ photos`: optimal).
* Built-in 6-point capture instructions checklist (overlap, perimeter trajectory, lighting invariance, static scenes).

### 4. 🧠 Transparent Photogrammetry Reconstruction Pipeline
* Honest, genuine status reporting distinguishing client-side rendering from offline GPU photogrammetry.
* Multi-stage pipeline monitor:
  1. Image Quality & Metadata Analysis (Client-side verification)
  2. SIFT / ORB Feature Keypoint Matching
  3. Structure-from-Motion (SfM) Camera Pose Estimation
  4. Multi-View Stereo (MVS) Dense Point Cloud
  5. Screened Poisson Surface Reconstruction & GLB Packaging
* **Manifest Export:** Generates a downloadable `namma_space_capture_manifest.json` containing image lists, metadata, and ready-to-run COLMAP/Meshroom commands.
* Dual pathway resolution: launch reference room or load custom reconstructed `.glb`.

### 5. 📂 Universal GLB / glTF 3D Model Importer
* Drag-and-drop or select local `.glb` and `.gltf` 3D files.
* Automatic bounding box computation, scale normalization, and ground-level centering (`y = 0`).
* Real-time memory disposal (`URL.revokeObjectURL`) to prevent memory leaks.
* Instant fallback button to return to the reference demo room.

### 6. 📊 Digital Twin Operations Dashboard
* Quick action cards for capturing photos, importing 3D models, or exploring the reference twin.
* Session manager persisting projects in `localStorage` without requiring mandatory account creation.
* Real-time WebGL engine health and storage indicators.

---

## ⚡ Quickstart Guide

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (comes with Node.js)

### Installation
Clone or navigate to the project directory:
```bash
cd c:\Users\palha\namma-space
npm install
```

### Run Locally (Development Server)
```bash
npm run dev
```
Open your browser and navigate to:
**`http://localhost:5173/`**

### Build for Production
```bash
npm run build
```
*(Produces optimized code-split chunks for application logic and Three.js in `dist/` in <300ms).*

### Preview Production Build
```bash
npm run preview
```
Default preview URL: **`http://localhost:4173/`**

---

## 🎮 Viewer Controls & Shortcuts

| Action | Control |
| :--- | :--- |
| **Walk Forward / Backward** | <kbd>W</kbd> / <kbd>S</kbd> or <kbd>↑</kbd> / <kbd>↓</kbd> |
| **Strafe Left / Right** | <kbd>A</kbd> / <kbd>D</kbd> or <kbd>←</kbd> / <kbd>→</kbd> |
| **Sprint Movement** | Hold <kbd>Shift</kbd> while walking |
| **Look Around** | Click viewer canvas to lock cursor, then move mouse |
| **Release Cursor** | Press <kbd>Esc</kbd> |
| **Reset View** | Click **"Reset View"** toolbar button |
| **Toggle Wireframe** | Click **"Wireframe: ON/OFF"** toolbar button |
| **Return to Dashboard**| Click **"Dashboard"** button in upper-left toolbar |

---

## 🔬 Photogrammetry & Offline Pipeline Integration

Namma Space separates the **Browser Inspection Engine** (Three.js WebGL) from the **Reconstruction Pipeline** (GPU compute):

```
[ Indoor Room ]
      │
      ▼ (Multi-Angle Photography)
[ 15–40 Overlapping Photos ]
      │
      ▼ (Namma Space Image Ingestion & Validation)
[ Preprocessed Dataset + Manifest (.json) ]
      │
      ▼ (COLMAP / Meshroom / Nerfstudio)
[ Sparse SfM Point Cloud -> Dense MVS -> Poisson Mesh ]
      │
      ▼ (GLB Binary Export)
[ room_model.glb ]
      │
      ▼ (Drag-and-Drop into Namma Space Importer)
[ 60 FPS Interactive Three.js WebGL Digital Twin ]
```

### Running COLMAP on Exported Photos:
```bash
# 1. Feature Extraction
colmap feature_extractor --database_path database.db --image_path ./images

# 2. Keypoint Matching
colmap exhaustive_matcher --database_path database.db

# 3. Sparse Structure-from-Motion
colmap mapper --database_path database.db --image_path ./images --output_path ./sparse

# 4. Dense Reconstruction & Meshing
colmap image_undistorter --image_path ./images --input_path ./sparse/0 --output_path ./dense
colmap patch_match_stereo --workspace_path ./dense
colmap stereo_fusion --workspace_path ./dense --output_path ./dense/fused.ply
colmap poisson_mesher --input_path ./dense/fused.ply --output_path ./dense/meshed.ply
```
*(Open `meshed.ply` in Blender and export as `room_model.glb`).*

---

## ⏱️ Suggested 3–5 Minute Competition Presentation Script (IIT Bombay Techfest)

* **Minute 0:00 – 0:45 (The Problem & The Vision):**
  * Introduce **Namma Space**: Indoor digital twins typically require heavy proprietary BIM software or expensive LIDAR scanners ($5,000+).
  * Show the landing page: Namma Space democratizes indoor spatial twins using standard photography and browser-native WebGL.
* **Minute 0:45 – 1:45 (Interactive 3D Walkthrough):**
  * Click **"Explore 3D Space"**.
  * Click the canvas to enter first-person mouse look. Walk through the room with **WASD**.
  * Highlight the human eye height clamp (`1.6m`), realistic lighting, and Techfest banner on the wall.
  * Click **"Wireframe: ON"** to show judges the underlying polygon topology and 60 FPS efficiency.
* **Minute 1:45 – 2:45 (Capture & Ingestion Workflow):**
  * Navigate to **"Create Twin"** (`#upload`).
  * Show the capture guidelines (60–80% overlap, perimeter trajectory).
  * Upload a set of sample indoor room photos. Point out real-time previews, coverage scoring, and file validation.
  * Click **"Start Reconstruction"** to show the pipeline monitor and export manifest.
* **Minute 2:45 – 3:30 (Model Importer & Standards):**
  * Navigate to **"Import 3D Model"** (`#import`).
  * Explain why **GLB** is the universal container for web 3D.
  * Demonstrate loading a custom model or returning to the reference twin.
* **Minute 3:30 – 4:00 (Q&A and Future Roadmap):**
  * Summarize architecture: React 19 + Three.js r186 + Vite 8.
  * Mention future work: 3D Gaussian Splatting (3DGS) web rasterization and spatial measurement tools.

---

## 🛠️ Technology Stack
* **Frontend:** React 19, HTML5 Canvas, Vanilla CSS3 (Custom Glassmorphism Design System)
* **3D Graphics Engine:** Three.js r186 (PerspectiveCamera, PCFSoftShadowMap, MeshStandardMaterial, CanvasTexture)
* **Model Loader:** GLTFLoader (`three/examples/jsm/loaders/GLTFLoader.js`)
* **Build Tool:** Vite 8 with optimized manual chunking for Three.js
* **Icons:** Tailored zero-dependency inline SVG components

---

## 📋 Competition Checklist
- [x] Responsive dark navy & cyan tech design suitable for presentation
- [x] Working WASD navigation and first-person mouse-look
- [x] Eye height lock (1.6m) and room boundary collision clamp
- [x] Reset View and Esc cursor release functionality
- [x] Wireframe topology toggle for technical scrutiny
- [x] Multi-image upload, previews, validation, and removal
- [x] Photogrammetry capture guidelines and manifest export
- [x] Local GLB/glTF 3D model importer with scale auto-centering
- [x] Digital twin operations dashboard with local project persistence
- [x] Zero ESLint errors, zero build errors, production build verified (<300ms)

*Created for IIT Bombay Techfest 2026–27.*
