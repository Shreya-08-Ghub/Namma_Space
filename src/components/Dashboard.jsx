import { useState, useEffect } from "react";
import { 
  CameraIcon, 
  File3DIcon, 
  EyeIcon, 
  TrashIcon, 
  ArrowRightIcon, 
  RefreshCwIcon,
  InfoIcon
} from "./Icons";

const INITIAL_PROJECTS = [
  {
    id: "proj-sample-1",
    title: "IIT Bombay Techfest Reference Twin",
    description: "Full indoor workstation suite with dual monitors, bookshelf, seating, window daylight, and Techfest banner.",
    date: "2026-10-30",
    type: "Sample Procedural Twin",
    status: "Ready",
    polyCount: "1,850 polys",
    size: "Procedural",
    isSample: true,
    modelUrl: null
  }
];

export default function Dashboard({ 
  setActiveTab, 
  onLoadModel, 
  uploadedImagesCount = 0 
}) {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem("namma_space_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load saved projects from localStorage", e);
    }
    return INITIAL_PROJECTS;
  });

  // Keep localStorage updated
  useEffect(() => {
    try {
      localStorage.setItem("namma_space_projects", JSON.stringify(projects));
    } catch (e) {
      console.warn("Could not save projects to localStorage", e);
    }
  }, [projects]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleLaunchProject = (proj) => {
    if (proj.isSample) {
      onLoadModel(null, proj.title);
    } else if (proj.modelUrl) {
      onLoadModel(proj.modelUrl, proj.title);
    }
    setActiveTab("viewer");
  };

  return (
    <div className="dashboard-page">
      {/* Dashboard Top Header */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-sub">DIGITAL TWIN OPERATIONS CENTER</div>
          <h1 className="dashboard-title">Digital Twin Dashboard</h1>
          <p className="dashboard-lead">
            Manage your indoor 3D digital twins, launch inspection sessions, and initiate photogrammetry reconstructions.
          </p>
        </div>

        {/* System Health Status Box */}
        <div className="system-status-box">
          <div className="status-item">
            <span className="status-dot green"></span>
            <span className="status-label">WebGL Renderer:</span>
            <span className="status-val font-mono">Three.js r186 (Active)</span>
          </div>
          <div className="status-item">
            <span className="status-dot cyan"></span>
            <span className="status-label">Reconstruction:</span>
            <span className="status-val font-mono">Ready (Client Preprocessing)</span>
          </div>
          <div className="status-item">
            <span className="status-dot amber"></span>
            <span className="status-label">Storage:</span>
            <span className="status-val font-mono">Local Browser Persistence</span>
          </div>
        </div>
      </div>

      {/* Primary Action Cards Grid */}
      <div className="dashboard-actions-grid">
        {/* Card 1: Create Digital Twin */}
        <div className="dash-action-card" onClick={() => setActiveTab("upload")}>
          <div className="dash-card-icon-wrapper bg-cyan">
            <CameraIcon size={26} />
          </div>
          <div className="dash-card-content">
            <div className="dash-card-badge">STEP 1</div>
            <h3 className="dash-card-title">Create New Digital Twin</h3>
            <p className="dash-card-text">
              Upload multi-angle indoor photographs of an indoor room with automated spatial coverage validation.
            </p>
          </div>
          <div className="dash-card-footer">
            <span className="dash-footer-link">
              <span>Upload Photos</span>
              <ArrowRightIcon size={16} />
            </span>
            {uploadedImagesCount > 0 && (
              <span className="count-badge">{uploadedImagesCount} photos staged</span>
            )}
          </div>
        </div>

        {/* Card 2: Import 3D Model */}
        <div className="dash-action-card" onClick={() => setActiveTab("import")}>
          <div className="dash-card-icon-wrapper bg-purple">
            <File3DIcon size={26} />
          </div>
          <div className="dash-card-content">
            <div className="dash-card-badge">DIRECT LOAD</div>
            <h3 className="dash-card-title">Import Existing 3D Model</h3>
            <p className="dash-card-text">
              Load your local .GLB or .glTF digital twin model directly into the 3D viewer with telemetry metrics.
            </p>
          </div>
          <div className="dash-card-footer">
            <span className="dash-footer-link">
              <span>Select 3D Model</span>
              <ArrowRightIcon size={16} />
            </span>
            <span className="format-badge">.GLB / .glTF</span>
          </div>
        </div>

        {/* Card 3: Explore Sample Room */}
        <div className="dash-action-card highlight-card" onClick={() => {
          onLoadModel(null, "IIT Bombay Techfest Reference Twin");
          setActiveTab("viewer");
        }}>
          <div className="dash-card-icon-wrapper bg-blue">
            <EyeIcon size={26} />
          </div>
          <div className="dash-card-content">
            <div className="dash-card-badge">INSTANT WALKTHROUGH</div>
            <h3 className="dash-card-title">Explore Reference Room</h3>
            <p className="dash-card-text">
              Jump immediately into our interactive indoor digital twin room with full WASD movement and mouse look.
            </p>
          </div>
          <div className="dash-card-footer">
            <span className="dash-footer-link text-cyan">
              <span>Launch 3D Viewer</span>
              <ArrowRightIcon size={16} />
            </span>
            <span className="fps-badge">60 FPS WebGL</span>
          </div>
        </div>
      </div>

      {/* Quick Start Guide for First-Time Users */}
      <div className="first-time-guide-panel">
        <div className="guide-header">
          <InfoIcon size={22} className="text-cyan" />
          <h3 className="guide-title">First-Time User Walkthrough Guide</h3>
        </div>
        <div className="guide-steps-row">
          <div className="guide-step">
            <div className="step-num-pill">1</div>
            <div className="step-body">
              <strong>Explore First:</strong> Click <em>"Explore Reference Room"</em> to verify WASD and mouse-look navigation right now.
            </div>
          </div>
          <div className="guide-step">
            <div className="step-num-pill">2</div>
            <div className="step-body">
              <strong>Capture Photos:</strong> Click <em>"Create New Digital Twin"</em> and upload overlapping room photos following our capture checklist.
            </div>
          </div>
          <div className="guide-step">
            <div className="step-num-pill">3</div>
            <div className="step-body">
              <strong>Load Custom Model:</strong> Have an existing room model from Blender, Meshroom, or Polycam? Drop it into <em>"Import 3D Model"</em>!
            </div>
          </div>
        </div>
      </div>

      {/* Recent Digital Twin Projects Section */}
      <div className="recent-projects-section">
        <div className="projects-header-bar">
          <div>
            <h2 className="section-title">Digital Twin Projects</h2>
            <p className="section-subtitle-text">
              Saved sessions stored locally in browser storage (no cloud account required).
            </p>
          </div>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => setProjects(INITIAL_PROJECTS)}
            title="Reset to default reference project"
          >
            <RefreshCwIcon size={14} />
            <span>Reset Demo Projects</span>
          </button>
        </div>

        <div className="projects-grid">
          {projects.map((proj) => (
            <div key={proj.id} className="project-card" onClick={() => handleLaunchProject(proj)}>
              <div className="project-card-header">
                <span className="project-badge">{proj.type}</span>
                <span className="status-pill-green">● {proj.status}</span>
              </div>

              <div className="project-card-body">
                <h4 className="project-card-title">{proj.title}</h4>
                <p className="project-card-desc">{proj.description}</p>
              </div>

              <div className="project-telemetry-row">
                <span className="tel-item font-mono">{proj.polyCount}</span>
                <span className="tel-dot">•</span>
                <span className="tel-item font-mono">{proj.size}</span>
                <span className="tel-dot">•</span>
                <span className="tel-item">{proj.date}</span>
              </div>

              <div className="project-card-footer">
                <button className="btn btn-primary btn-sm">
                  <EyeIcon size={15} />
                  <span>Open in 3D Viewer</span>
                </button>
                {!proj.isSample && (
                  <button 
                    className="btn btn-danger-icon" 
                    onClick={(e) => handleDelete(proj.id, e)}
                    title="Remove project"
                  >
                    <TrashIcon size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
