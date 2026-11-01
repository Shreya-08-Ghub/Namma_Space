import { 
  CubeIcon, 
  CameraIcon, 
  EyeIcon, 
  File3DIcon, 
  LayersIcon, 
  SparklesIcon, 
  CpuIcon, 
  ShieldCheckIcon, 
  CompassIcon, 
  ArrowRightIcon
} from "./Icons";

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-blob hero-glow-1"></div>
        <div className="hero-glow-blob hero-glow-2"></div>

        <div className="hero-content">
          <div className="competition-badge">
            <span className="badge-pulse"></span>
            <span>IIT BOMBAY TECHFEST 2026-27</span>
            <span className="badge-sep">•</span>
            <span className="badge-highlight">INDOOR DIGITAL TWIN CHALLENGE</span>
          </div>

          <h1 className="hero-headline">
            Transform Real Indoor Spaces into <br />
            <span className="gradient-text">Interactive 3D Digital Twins</span>
          </h1>

          <p className="hero-description">
            Capture ordinary photos of any indoor room and reconstruct an interactive, 
            dimensionally accurate 3D spatial twin. Walk through virtual environments 
            directly in your web browser with 60 FPS WebGL performance — no specialized software or VR headsets required.
          </p>

          <div className="hero-cta-group">
            <button 
              className="btn btn-primary btn-lg pulse-hover"
              onClick={() => setActiveTab("viewer")}
            >
              <EyeIcon size={20} />
              <span>Explore 3D Space</span>
            </button>

            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => setActiveTab("upload")}
            >
              <CameraIcon size={20} />
              <span>Create Digital Twin</span>
            </button>

            <button 
              className="btn btn-outline btn-lg"
              onClick={() => setActiveTab("import")}
            >
              <File3DIcon size={20} />
              <span>Import 3D Model</span>
            </button>
          </div>

          {/* Quick Metrics Banner */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <span className="metric-val">60 FPS</span>
              <span className="metric-lbl">WebGL Three.js Engine</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-val">0 Plugins</span>
              <span className="metric-lbl">Native Browser First-Person</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-val">GLB / glTF</span>
              <span className="metric-lbl">Open Standard Spatial Format</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-val">Multi-View</span>
              <span className="metric-lbl">Photogrammetry Ready</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="hero-preview-wrapper">
          <div className="hero-preview-frame">
            <div className="preview-top-bar">
              <div className="window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="preview-title">NAMMA-SPACE-VIEWER-PBR-ENGINE // TECHFEST-DEMO</span>
              <span className="preview-badge">LIVE 60 FPS</span>
            </div>
            
            <div className="preview-canvas-placeholder" onClick={() => setActiveTab("viewer")}>
              <div className="preview-spatial-grid"></div>
              <div className="preview-center-hud">
                <div className="hud-radar">
                  <div className="radar-sweep"></div>
                  <CubeIcon size={36} className="text-cyan animate-pulse" />
                </div>
                <div className="hud-room-label">IIT BOMBAY REFERENCE DIGITAL TWIN</div>
                <div className="hud-sub-label">WASD Movement • Mouse-Look Enabled • Height Clamped (1.6m)</div>
                <button className="btn btn-primary btn-sm mt-3">
                  <EyeIcon size={16} />
                  <span>Click to Enter Interactive 3D Room</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-subtitle">CORE CAPABILITIES</div>
          <h2 className="section-title">Engineered for Spatial Visualization & Inspection</h2>
          <p className="section-description">
            Combining state-of-the-art computer vision pipelines with hardware-accelerated 3D browser graphics.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-cyan">
              <CameraIcon size={24} />
            </div>
            <h3 className="feature-title">Multi-Angle Image Capture</h3>
            <p className="feature-text">
              Upload overlapping photos captured with any standard smartphone or camera. 
              Built-in spatial guidance ensures 60–80% overlap coverage for high-fidelity reconstruction.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-purple">
              <CpuIcon size={24} />
            </div>
            <h3 className="feature-title">Photogrammetry Pipeline</h3>
            <p className="feature-text">
              Architecture designed for Structure-from-Motion (SfM), dense multi-view stereo point clouds, 
              and surface Poisson mesh extraction with honest pipeline verification.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-blue">
              <CompassIcon size={24} />
            </div>
            <h3 className="feature-title">First-Person Walkthrough</h3>
            <p className="feature-text">
              Explore spaces at realistic human eye height (1.6m) using intuitive WASD keyboard navigation, 
              sprint controls, and pointer-lock mouse look.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-amber">
              <File3DIcon size={24} />
            </div>
            <h3 className="feature-title">Universal GLB / glTF Import</h3>
            <p className="feature-text">
              Drag-and-drop any standard 3D model into the engine. Automatically calculates bounding box dimensions, 
              normalizes scale, and computes polygon telemetry in real time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-emerald">
              <LayersIcon size={24} />
            </div>
            <h3 className="feature-title">PBR Shading & Wireframe</h3>
            <p className="feature-text">
              Toggle between realistic physically-based rendering (PBR) materials, directional daylight shadows, 
              and wireframe mode for structural geometry analysis.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper bg-indigo">
              <ShieldCheckIcon size={24} />
            </div>
            <h3 className="feature-title">Zero Install, Pure Web</h3>
            <p className="feature-text">
              Built on React 19 and Three.js. Operates seamlessly on Windows, macOS, Linux, and modern mobile browsers 
              without proprietary software or heavy installations.
            </p>
          </div>
        </div>
      </section>

      {/* Reconstruction Pipeline Section */}
      <section className="workflow-section">
        <div className="section-header">
          <div className="section-subtitle">END-TO-END PIPELINE</div>
          <h2 className="section-title">How Namma Space Works</h2>
          <p className="section-description">
            From raw real-world photographs to an interactive browser-based 3D digital twin.
          </p>
        </div>

        <div className="pipeline-steps-grid">
          <div className="pipeline-step-card">
            <div className="step-number">01</div>
            <div className="step-icon">
              <CameraIcon size={28} />
            </div>
            <h3 className="step-title">Indoor Capture</h3>
            <p className="step-desc">
              Walk the perimeter of any indoor room. Capture 15–40 overlapping photos covering walls, corners, 
              openings, and furniture under uniform lighting.
            </p>
            <div className="step-badge">Client Capture</div>
          </div>

          <div className="pipeline-step-arrow">
            <ArrowRightIcon size={24} />
          </div>

          <div className="pipeline-step-card">
            <div className="step-number">02</div>
            <div className="step-icon">
              <CpuIcon size={28} />
            </div>
            <h3 className="step-title">SfM & Point Cloud</h3>
            <p className="step-desc">
              Feature extraction algorithms detect SIFT keypoints across photos, solving camera poses 
              and triangulating millions of 3D spatial coordinate points.
            </p>
            <div className="step-badge">AI Reconstruction</div>
          </div>

          <div className="pipeline-step-arrow">
            <ArrowRightIcon size={24} />
          </div>

          <div className="pipeline-step-card">
            <div className="step-number">03</div>
            <div className="step-icon">
              <LayersIcon size={28} />
            </div>
            <h3 className="step-title">Mesh Synthesis & GLB</h3>
            <p className="step-desc">
              Poisson surface reconstruction wraps dense points into an optimized polygon mesh, unwraps UV coordinates, 
              and exports self-contained GLB binary assets.
            </p>
            <div className="step-badge">Geometry Optimization</div>
          </div>

          <div className="pipeline-step-arrow">
            <ArrowRightIcon size={24} />
          </div>

          <div className="pipeline-step-card">
            <div className="step-number">04</div>
            <div className="step-icon">
              <EyeIcon size={28} />
            </div>
            <h3 className="step-title">Interactive Twin</h3>
            <p className="step-desc">
              Load into the Three.js WebGL engine. Freely walk through the reconstructed room with WASD movement, 
              measure dimensions, inspect wireframe topology, and present.
            </p>
            <div className="step-badge">Three.js WebGL</div>
          </div>
        </div>

        {/* Technical Reality Note */}
        <div className="tech-reality-box">
          <div className="reality-icon">
            <SparklesIcon size={24} />
          </div>
          <div className="reality-content">
            <h4 className="reality-title">Engineering Transparency: Viewer vs Reconstruction Engine</h4>
            <p className="reality-text">
              Three.js is the high-performance WebGL graphics engine used to render and interact with 3D models in real time. 
              Generating dense 3D meshes from raw 2D photographs requires a photogrammetry pipeline (such as COLMAP, OpenMVS, 
              Meshroom, or NeRF). Namma Space provides an end-to-end user workflow: upload and validate photos, 
              view photogrammetry pipeline stages, import pre-computed or external GLB models, or walk through our reference 
              digital twin room immediately!
            </p>
          </div>
        </div>
      </section>

      {/* Target Applications Section */}
      <section className="applications-section">
        <div className="section-header">
          <div className="section-subtitle">IMPACT & USE CASES</div>
          <h2 className="section-title">Where Indoor Digital Twins Matter</h2>
        </div>

        <div className="applications-grid">
          <div className="app-card">
            <div className="app-card-badge">CAMPUS & INFRASTRUCTURE</div>
            <h3 className="app-card-title">Virtual Campus & Smart Facilities</h3>
            <p className="app-card-desc">
              Document college laboratories, lecture halls, and auditoriums at IIT Bombay for remote orientation, 
              spatial planning, and maintenance inspections.
            </p>
          </div>

          <div className="app-card">
            <div className="app-card-badge">SAFETY & DISASTER MANAGEMENT</div>
            <h3 className="app-card-title">Emergency Response & Evacuation</h3>
            <p className="app-card-desc">
              Provide first responders with pre-incident 3D digital twins to map egress paths, emergency exits, 
              fire suppression systems, and structural choke points.
            </p>
          </div>

          <div className="app-card">
            <div className="app-card-badge">REAL ESTATE & ARCHITECTURE</div>
            <h3 className="app-card-title">Zero-Friction Virtual Walkthroughs</h3>
            <p className="app-card-desc">
              Enable prospective buyers and architects to walk through properties in real scale, 
              evaluating room ergonomics without site visits.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <h2 className="cta-banner-title">Experience the Namma Space Digital Twin</h2>
          <p className="cta-banner-text">
            Start exploring our interactive reference room or upload your own indoor photo set now.
          </p>
          <div className="cta-banner-buttons">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => setActiveTab("viewer")}
            >
              <EyeIcon size={20} />
              <span>Launch 3D Viewer</span>
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => setActiveTab("upload")}
            >
              <CameraIcon size={20} />
              <span>Upload Indoor Photos</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="flex items-center gap-2">
              <CubeIcon size={22} className="text-cyan" />
              <span className="font-bold text-lg text-white">NAMMA SPACE</span>
            </div>
            <p className="footer-tagline">
              AI-Powered Indoor Digital Twin Platform for Web-Based Spatial Inspection.
            </p>
            <span className="footer-subtext">Developed for IIT Bombay Techfest 2026-27</span>
          </div>

          <div className="footer-links-col">
            <span className="footer-col-header">Platform</span>
            <button className="footer-link" onClick={() => setActiveTab("dashboard")}>Dashboard</button>
            <button className="footer-link" onClick={() => setActiveTab("viewer")}>3D Spatial Viewer</button>
            <button className="footer-link" onClick={() => setActiveTab("upload")}>Capture & Upload</button>
            <button className="footer-link" onClick={() => setActiveTab("import")}>Import 3D Model</button>
          </div>

          <div className="footer-links-col">
            <span className="footer-col-header">Technical</span>
            <button className="footer-link" onClick={() => setActiveTab("how-it-works")}>Photogrammetry Architecture</button>
            <button className="footer-link" onClick={() => setActiveTab("about")}>About the Project</button>
            <span className="footer-tech-tag">WebGL 2.0</span>
            <span className="footer-tech-tag">Three.js r186</span>
            <span className="footer-tech-tag">React 19</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Namma Space • Indoor Digital Twin Platform • Techfest IIT Bombay</span>
          <span>Open Source WebGL 3D Technology</span>
        </div>
      </footer>
    </div>
  );
}
