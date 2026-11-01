import { useState, useRef } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { 
  File3DIcon, 
  EyeIcon, 
  AlertTriangleIcon, 
  TrashIcon, 
  InfoIcon,
  ArrowRightIcon,
  DownloadIcon,
  HomeIcon,
  SparklesIcon
} from "./Icons";

export default function ModelImporter({ 
  onModelSelected, 
  onSwitchToSampleRoom, 
  setActiveTab 
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [modelBlobUrl, setModelBlobUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);

  const handleFile = (file) => {
    setErrorMessage(null);
    setWarningMessage(null);

    if (!file) return;

    // Validate file size
    if (file.size === 0) {
      setErrorMessage("The selected file is empty (0 bytes). Please select a valid 3D model.");
      return;
    }

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext !== "glb" && ext !== "gltf") {
      setErrorMessage(`Unsupported format ".${ext}". Namma Space supports .glb (Binary glTF 2.0) and .gltf models. Please select a valid .glb file.`);
      return;
    }

    if (file.size > 150 * 1024 * 1024) {
      setWarningMessage("Note: File size is over 150 MB. Very large models may take longer to parse and affect frame rates on lower-end hardware.");
    }

    // glTF external dependencies check
    if (ext === "gltf") {
      setWarningMessage("Note on .gltf: Plain .gltf files frequently reference external .bin buffers and texture images that cannot be resolved in a single-file upload. If geometry or textures fail to load, please convert or export your model as a standalone .glb binary file (in Blender: File > Export > glTF 2.0 (.glb)).");
    }

    // Revoke previous URL if any to avoid memory leaks
    if (modelBlobUrl && modelBlobUrl.startsWith("blob:")) {
      URL.revokeObjectURL(modelBlobUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setModelBlobUrl(objectUrl);
    setSelectedFile(file);

    setFileDetails({
      name: file.name,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2),
      type: ext.toUpperCase(),
      lastModified: new Date(file.lastModified).toLocaleDateString()
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    if (modelBlobUrl && modelBlobUrl.startsWith("blob:")) {
      URL.revokeObjectURL(modelBlobUrl);
    }
    setSelectedFile(null);
    setModelBlobUrl(null);
    setFileDetails(null);
    setErrorMessage(null);
    setWarningMessage(null);
  };

  const handleLaunchViewer = () => {
    if (modelBlobUrl && selectedFile) {
      onModelSelected(modelBlobUrl, selectedFile.name, fileDetails);
      setActiveTab("viewer");
    }
  };

  const handleLoadSample = () => {
    onSwitchToSampleRoom();
    setActiveTab("viewer");
  };

  // Generate a test indoor room .glb in the browser using Three.js GLTFExporter
  const handleGenerateSampleGlb = (shouldDownload = false) => {
    setIsGeneratingDemo(true);
    setErrorMessage(null);

    try {
      const demoScene = new THREE.Scene();
      demoScene.name = "NammaSpace_Sample_Room";

      // Floor
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshStandardMaterial({ color: 0x8a7565, roughness: 0.7 })
      );
      floor.rotation.x = -Math.PI / 2;
      demoScene.add(floor);

      // Walls
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 0.2), wallMat);
      backWall.position.set(0, 1.5, -4);
      demoScene.add(backWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 8), wallMat);
      leftWall.position.set(-4, 1.5, 0);
      demoScene.add(leftWall);

      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 8), wallMat);
      rightWall.position.set(4, 1.5, 0);
      demoScene.add(rightWall);

      // Desk setup
      const desk = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.8, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
      );
      desk.position.set(0, 0.4, -2.8);
      demoScene.add(desk);

      // Monitor
      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.7, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x00f2fe, roughness: 0.2 })
      );
      monitor.position.set(0, 1.15, -2.8);
      demoScene.add(monitor);

      const exporter = new GLTFExporter();
      exporter.parse(
        demoScene,
        (glbArrayBuffer) => {
          const blob = new Blob([glbArrayBuffer], { type: "model/gltf-binary" });
          const demoFileName = "namma-sample-twin-room.glb";

          if (shouldDownload) {
            const dlUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = dlUrl;
            a.download = demoFileName;
            a.click();
            URL.revokeObjectURL(dlUrl);
            setIsGeneratingDemo(false);
          } else {
            const demoFile = new File([blob], demoFileName, {
              type: "model/gltf-binary",
              lastModified: Date.now()
            });
            handleFile(demoFile);
            setIsGeneratingDemo(false);
          }
        },
        (error) => {
          console.error("GLTFExporter error:", error);
          setErrorMessage("Failed to generate demo GLB: " + error.message);
          setIsGeneratingDemo(false);
        },
        { binary: true }
      );
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not generate demo model: " + err.message);
      setIsGeneratingDemo(false);
    }
  };

  return (
    <div className="importer-page">
      {/* Header */}
      <div className="page-header">
        <div className="section-subtitle">SPATIAL ASSET LOADER</div>
        <h1 className="page-title">Import Existing 3D Model</h1>
        <p className="page-description">
          Load standard 3D digital twins, architectural rooms, or photogrammetry meshes into our interactive WebGL viewer.
        </p>
      </div>

      {/* GLB vs glTF Specifications Card */}
      <div className="format-info-card">
        <div className="flex items-center gap-2 mb-1">
          <InfoIcon size={20} className="text-cyan" />
          <h3 className="format-info-title">Supported 3D Formats: .GLB Recommended</h3>
        </div>
        <p className="format-info-text">
          <strong>.GLB (Binary glTF 2.0)</strong> is the universal container format for browser-based 3D. 
          It bundles 3D geometry meshes, PBR texture maps, and materials into a single self-contained file. 
          If you have a <code>.gltf</code> model with separate <code>.bin</code> files or textures, convert it to <code>.glb</code> 
          (e.g., using Blender: <em>File &gt; Export &gt; glTF 2.0 (.glb)</em>) for seamless single-file loading.
        </p>
      </div>

      {/* Drag & Drop Dropzone */}
      <div 
        className={`upload-dropzone ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".glb,.gltf" 
          style={{ display: "none" }}
          onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
        />

        <div className="dropzone-icon">
          <File3DIcon size={42} className="text-purple animate-bounce-subtle" />
        </div>

        <h3 className="dropzone-prompt">
          Drag & drop your <strong>.GLB</strong> or <strong>.glTF</strong> model here, or <span className="text-cyan underline">Browse files</span>
        </h3>

        <p className="dropzone-hints">
          Supports: <strong>.GLB (Binary glTF)</strong> and <strong>.glTF</strong> • Auto-scales and centers ground level
        </p>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="alert-box alert-error">
          <AlertTriangleIcon size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Warning Message Alert */}
      {warningMessage && (
        <div className="alert-box alert-warning">
          <AlertTriangleIcon size={20} />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Loaded Model Preview Card */}
      {fileDetails && (
        <div className="model-staged-card">
          <div className="model-card-top">
            <div className="flex items-center gap-3">
              <div className="model-format-icon">
                <File3DIcon size={28} className="text-cyan" />
              </div>
              <div>
                <h3 className="model-staged-name">{fileDetails.name}</h3>
                <div className="model-staged-meta">
                  <span>Format: <strong>{fileDetails.type}</strong></span>
                  <span className="meta-sep">•</span>
                  <span>Size: <strong>{fileDetails.sizeMB} MB</strong></span>
                  <span className="meta-sep">•</span>
                  <span>Validated: <strong>Ready to View</strong></span>
                </div>
              </div>
            </div>

            <button className="btn btn-outline btn-sm text-red" onClick={handleClear} title="Remove this model">
              <TrashIcon size={15} />
              <span>Remove</span>
            </button>
          </div>

          <div className="model-card-actions">
            <button className="btn btn-primary btn-lg pulse-hover w-full" onClick={handleLaunchViewer}>
              <EyeIcon size={20} />
              <span>Launch in Interactive 3D Viewer</span>
              <ArrowRightIcon size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Quick Test / Demo Model Generator Card */}
      <div className="sample-test-model-card">
        <div className="sample-test-info">
          <div className="flex items-center gap-2">
            <SparklesIcon size={18} className="text-cyan" />
            <h4 className="sample-test-title">Need a 3D model to test right now?</h4>
          </div>
          <p className="sample-test-desc">
            Try our built-in test indoor twin (.glb) or download it to test file uploading through your local file picker.
          </p>
        </div>

        <div className="sample-test-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => handleGenerateSampleGlb(false)}
            disabled={isGeneratingDemo}
          >
            <SparklesIcon size={16} />
            <span>{isGeneratingDemo ? "Synthesizing..." : "Stage Test .GLB Model"}</span>
          </button>

          <button 
            className="btn btn-outline btn-sm"
            onClick={() => handleGenerateSampleGlb(true)}
            disabled={isGeneratingDemo}
          >
            <DownloadIcon size={15} />
            <span>Download Test .GLB</span>
          </button>
        </div>
      </div>

      {/* Fallback Reference Room Option */}
      <div className="sample-fallback-box">
        <div className="fallback-text">
          <strong>Prefer to explore the default reference room?</strong>
          <span>Walk through our fully configured IIT Bombay Reference Digital Twin Room.</span>
        </div>
        <button className="btn btn-outline btn-md" onClick={handleLoadSample}>
          <HomeIcon size={16} />
          <span>Explore Reference Room</span>
        </button>
      </div>
    </div>
  );
}
