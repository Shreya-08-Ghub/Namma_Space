import { 
  CameraIcon, 
  CpuIcon, 
  LayersIcon, 
  EyeIcon, 
  SparklesIcon, 
  ArrowRightIcon
} from "./Icons";

export default function HowItWorks({ setActiveTab }) {
  return (
    <div className="how-it-works-page">
      {/* Header */}
      <div className="page-header">
        <div className="section-subtitle">TECHNICAL ARCHITECTURE</div>
        <h1 className="page-title">How Namma Space Works</h1>
        <p className="page-description">
          An in-depth look at how multi-angle photography, photogrammetry algorithms, and WebGL 
          combine to produce interactive indoor digital twins.
        </p>
      </div>

      {/* 5-Step Deep Dive */}
      <div className="workflow-detailed-container">
        {/* Step 1 */}
        <div className="workflow-detail-row">
          <div className="workflow-detail-number">01</div>
          <div className="workflow-detail-body">
            <div className="workflow-detail-header">
              <CameraIcon size={22} className="text-cyan" />
              <h3>Multi-Angle Spatial Photography</h3>
            </div>
            <p>
              The user walks through an indoor room (e.g. laboratory, office, classroom, or apartment) 
              taking 15–50 overlapping photographs. Key technical requirements:
            </p>
            <ul className="workflow-checklist">
              <li><strong>Overlap Ratio:</strong> Each adjacent photo must share at least 60–80% common visual features.</li>
              <li><strong>Perimeter Trajectory:</strong> Capturing photos facing outward towards walls, inward towards center furniture, and across corners.</li>
              <li><strong>Lighting Invariance:</strong> Constant ambient illumination prevents false color variations in PBR textures.</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="workflow-detail-row">
          <div className="workflow-detail-number">02</div>
          <div className="workflow-detail-body">
            <div className="workflow-detail-header">
              <CpuIcon size={22} className="text-purple" />
              <h3>Feature Extraction & Structure-from-Motion (SfM)</h3>
            </div>
            <p>
              Computer vision algorithms (SIFT, ORB, SuperPoint) extract mathematical interest points 
              (corners, gradients, high-contrast textures) across all images:
            </p>
            <ul className="workflow-checklist">
              <li><strong>Epipolar Geometry:</strong> Matching keypoints allows the algorithm to calculate fundamental matrices and camera intrinsic calibration.</li>
              <li><strong>Bundle Adjustment:</strong> Solves for camera positions in 3D coordinate space and produces a sparse point cloud of the room.</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="workflow-detail-row">
          <div className="workflow-detail-number">03</div>
          <div className="workflow-detail-body">
            <div className="workflow-detail-header">
              <LayersIcon size={22} className="text-blue" />
              <h3>Multi-View Stereo (MVS) & Dense Point Cloud</h3>
            </div>
            <p>
              Once camera poses are locked, patch-based multi-view stereo generates per-pixel depth maps, 
              producing millions of dense 3D points with surface normal vectors.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="workflow-detail-row">
          <div className="workflow-detail-number">04</div>
          <div className="workflow-detail-body">
            <div className="workflow-detail-header">
              <SparklesIcon size={22} className="text-amber" />
              <h3>Screened Poisson Surface Meshing & UV Unwrapping</h3>
            </div>
            <p>
              Poisson surface reconstruction wraps the point cloud into a continuous triangular mesh. 
              The mesh is decimated for real-time web performance, UV mapped, and textured using the original photographs, 
              packaged into a standard <strong>glTF 2.0 Binary (.glb)</strong> file.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="workflow-detail-row">
          <div className="workflow-detail-number">05</div>
          <div className="workflow-detail-body">
            <div className="workflow-detail-header">
              <EyeIcon size={22} className="text-emerald" />
              <h3>Interactive WebGL Browser Walkthrough</h3>
            </div>
            <p>
              The generated GLB model loads into Three.js. Users navigate with WASD keys and mouse-look at 60 FPS. 
              The engine locks height to realistic eye level (1.6m), provides spatial telemetry, and supports 
              wireframe mode to inspect polygon topology.
            </p>
          </div>
        </div>
      </div>

      {/* Viewer vs Reconstruction Callout */}
      <div className="architecture-separation-card">
        <h3 className="arch-card-title">Understanding System Architecture: Viewer vs Engine</h3>
        <div className="arch-grid">
          <div className="arch-col">
            <div className="arch-col-badge bg-blue">FRONTEND CLIENT (NAMMA SPACE)</div>
            <h4>Three.js WebGL Spatial Engine</h4>
            <ul>
              <li>Runs 100% inside any modern web browser.</li>
              <li>Zero plugins, instant loading, 60 FPS hardware acceleration.</li>
              <li>Provides WASD movement, mouse look, wireframe toggle, and measurement telemetry.</li>
              <li>Loads any standard .GLB / .glTF digital twin file.</li>
            </ul>
          </div>

          <div className="arch-col">
            <div className="arch-col-badge bg-purple">BACKEND / GPU PIPELINE</div>
            <h4>Photogrammetry Reconstruction Cluster</h4>
            <ul>
              <li>Heavy GPU processing pipeline (e.g. COLMAP, AliceVision Meshroom, Nerfstudio).</li>
              <li>Solves complex bundle adjustment equations across hundreds of megapixels.</li>
              <li>Bakes UV textures and outputs optimized .GLB assets.</li>
              <li>Documented in Namma Space with export manifests for easy pipeline integration.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-6">
        <button className="btn btn-primary btn-lg" onClick={() => setActiveTab("viewer")}>
          <EyeIcon size={20} />
          <span>Launch 3D Spatial Viewer</span>
          <ArrowRightIcon size={18} />
        </button>
      </div>
    </div>
  );
}
