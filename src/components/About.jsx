import { EyeIcon } from "./Icons";

export default function About({ setActiveTab }) {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="page-header">
        <div className="section-subtitle">PROJECT OVERVIEW</div>
        <h1 className="page-title">About Namma Space</h1>
        <p className="page-description">
          Building accessible, browser-first indoor spatial twins for real-world inspection, campus navigation, 
          and emergency planning.
        </p>
      </div>

      <div className="about-content-card">
        <div className="about-section-block">
          <h2 className="about-heading">
            <span className="text-cyan">01.</span> Project Vision & Context
          </h2>
          <p>
            Traditional Building Information Modeling (BIM) and 3D architectural software are heavy, 
            expensive, and require proprietary desktop applications. <strong>Namma Space</strong> was born out of 
            the desire to make indoor digital twins instantly accessible to anyone with a web browser.
          </p>
          <p>
            Whether documenting laboratories at IIT Bombay, mapping emergency evacuation routes for first responders, 
            or providing virtual property walkthroughs, Namma Space bridges the gap between real-world 
            photography and interactive spatial computing.
          </p>
        </div>

        <div className="about-section-block">
          <h2 className="about-heading">
            <span className="text-cyan">02.</span> IIT Bombay Techfest 2026 Competition Focus
          </h2>
          <div className="techfest-focus-grid">
            <div className="focus-item">
              <div className="focus-badge">REAL-TIME PERFORMANCE</div>
              <h4>60 FPS WebGL Engine</h4>
              <p>Hardware-accelerated rendering with physically-based lighting, soft shadows, and sub-16ms frame times.</p>
            </div>
            <div className="focus-item">
              <div className="focus-badge">USER ACCESSIBILITY</div>
              <h4>Zero-Install Browser First</h4>
              <p>Pure web execution without requiring users to download gigabyte-sized executables or mobile apps.</p>
            </div>
            <div className="focus-item">
              <div className="focus-badge">STANDARDS-BASED</div>
              <h4>Open glTF / GLB Ecosystem</h4>
              <p>Complete interoperability with Blender, Unity, Unreal Engine, and photogrammetry suites.</p>
            </div>
            <div className="focus-item">
              <div className="focus-badge">HONEST ENGINEERING</div>
              <h4>Transparent Pipeline</h4>
              <p>Honest status reporting distinguishing client-side rendering from offline GPU photogrammetry.</p>
            </div>
          </div>
        </div>

        <div className="about-section-block">
          <h2 className="about-heading">
            <span className="text-cyan">03.</span> Technical Specifications
          </h2>
          <div className="tech-specs-table">
            <div className="spec-row">
              <span className="spec-name">Frontend Framework</span>
              <span className="spec-val">React 19 (Component-driven UI, zero rerender overhead)</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">3D Graphics Engine</span>
              <span className="spec-val">Three.js r186 (WebGL 2.0, PBR Shaders, PCF Soft Shadows)</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Build System</span>
              <span className="spec-val">Vite 8 (Lightning fast HMR & optimized production chunking)</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Supported 3D Format</span>
              <span className="spec-val">glTF 2.0 Binary (.glb) and .glTF embedded</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Camera & Controls</span>
              <span className="spec-val">First-person pointer lock, WASD movement, Sprint, Height clamp</span>
            </div>
          </div>
        </div>

        <div className="about-section-block">
          <h2 className="about-heading">
            <span className="text-cyan">04.</span> Next Steps & Future Roadmap
          </h2>
          <ul className="about-roadmap-list">
            <li><strong>Gaussian Splatting (3DGS):</strong> WebGL rasterization of real-time 3D Gaussian splats for photorealistic reflections.</li>
            <li><strong>Spatial Measurement Tool:</strong> Click-to-measure real-world distance between walls and furniture in meters.</li>
            <li><strong>Point Cloud Layer Toggle:</strong> Inspect raw LIDAR or SfM point cloud alongside surface polygon meshes.</li>
            <li><strong>Multiplayer Spatial Collaboration:</strong> WebRTC-based shared presence for team inspections.</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-6">
        <button className="btn btn-primary btn-lg" onClick={() => setActiveTab("viewer")}>
          <EyeIcon size={20} />
          <span>Explore 3D Digital Twin Now</span>
        </button>
      </div>
    </div>
  );
}
