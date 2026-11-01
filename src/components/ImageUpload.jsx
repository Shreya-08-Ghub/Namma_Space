import { useState, useRef } from "react";
import { 
  CameraIcon, 
  UploadIcon, 
  TrashIcon, 
  AlertTriangleIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  InfoIcon 
} from "./Icons";

export default function ImageUpload({ 
  onStartReconstruction, 
  uploadedImages, 
  setUploadedImages 
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Validate and add files
  const handleFiles = (fileList) => {
    setErrorMessage(null);
    const validExtensions = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const newImages = [];
    const rejectedFiles = [];

    Array.from(fileList).forEach((file) => {
      if (validExtensions.includes(file.type) || /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        newImages.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          file,
          name: file.name,
          size: file.size,
          previewUrl
        });
      } else {
        rejectedFiles.push(file.name);
      }
    });

    if (rejectedFiles.length > 0) {
      setErrorMessage(`Rejected ${rejectedFiles.length} file(s) with unsupported formats. Please upload JPG, PNG, or WebP images.`);
    }

    if (newImages.length > 0) {
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (id, previewUrl) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClearAll = () => {
    uploadedImages.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
    });
    setUploadedImages([]);
    setErrorMessage(null);
  };

  // Compute total size in MB
  const totalSizeBytes = uploadedImages.reduce((acc, curr) => acc + curr.size, 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

  // Quality assessment based on photogrammetry standards
  const getImageCountAdvice = () => {
    const count = uploadedImages.length;
    if (count === 0) return { label: "No photos staged", color: "text-slate" };
    if (count < 3) return { label: "Need at least 3 photos (Recommended: 15–30+)", color: "text-amber" };
    if (count < 10) return { label: "Basic spatial coverage staged", color: "text-blue" };
    return { label: "Optimal multi-view spatial coverage staged", color: "text-emerald" };
  };

  const advice = getImageCountAdvice();

  return (
    <div className="upload-page">
      {/* Header */}
      <div className="page-header">
        <div className="section-subtitle">PHOTOGRAMMETRIC INGESTION</div>
        <h1 className="page-title">Upload Indoor Photos</h1>
        <p className="page-description">
          Upload overlapping photographs of your indoor space. Our computer vision pipeline analyzes 
          multi-view imagery for 3D digital twin reconstruction.
        </p>
      </div>

      {/* Capture Instructions Panel */}
      <div className="capture-instructions-card">
        <div className="instructions-header" onClick={() => setShowInstructions(!showInstructions)}>
          <div className="flex items-center gap-2">
            <InfoIcon size={20} className="text-cyan" />
            <h3 className="instructions-title">Indoor Capture Instructions & Best Practices</h3>
          </div>
          <button className="instructions-toggle-btn">
            {showInstructions ? "Hide Guidelines" : "Show Guidelines"}
          </button>
        </div>

        {showInstructions && (
          <div className="instructions-content">
            <div className="guidelines-grid">
              <div className="guideline-item">
                <div className="guideline-badge">01</div>
                <div>
                  <strong>60–80% Image Overlap:</strong> Take successive photos with heavy overlap so algorithms can match common feature points.
                </div>
              </div>
              <div className="guideline-item">
                <div className="guideline-badge">02</div>
                <div>
                  <strong>360° Room Coverage:</strong> Walk along the room perimeter, photographing walls, corners, doors, and furniture from multiple heights.
                </div>
              </div>
              <div className="guideline-item">
                <div className="guideline-badge">03</div>
                <div>
                  <strong>Consistent Diffuse Lighting:</strong> Turn on ambient room lights. Avoid harsh flashlight glare, direct sunbeams, or switching lights midway.
                </div>
              </div>
              <div className="guideline-item">
                <div className="guideline-badge">04</div>
                <div>
                  <strong>Sharp & Stable Photos:</strong> Avoid motion blur. Hold your camera steady and ensure textures (wood grain, wallpaper, brick) are crisp.
                </div>
              </div>
              <div className="guideline-item">
                <div className="guideline-badge">05</div>
                <div>
                  <strong>Static Objects Only:</strong> Do not move chairs, open doors, or walk people through the room while capturing the photo set.
                </div>
              </div>
              <div className="guideline-item">
                <div className="guideline-badge">06</div>
                <div>
                  <strong>Feature-Rich Surfaces:</strong> Completely blank, glossy white walls or mirrors are hard to triangulate. Frame decorations and baseboards.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drag & Drop Upload Dropzone */}
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
          multiple 
          accept="image/jpeg,image/jpg,image/png,image/webp" 
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="dropzone-icon">
          <UploadIcon size={38} className="text-cyan animate-bounce-subtle" />
        </div>

        <h3 className="dropzone-prompt">
          Drag & drop indoor photographs here, or <span className="text-cyan underline">Browse files</span>
        </h3>

        <p className="dropzone-hints">
          Supported formats: <strong>JPG, JPEG, PNG, WebP</strong> • Recommended: 15–40 overlapping images
        </p>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="alert-box alert-error">
          <AlertTriangleIcon size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Staged Photos Summary Bar */}
      {uploadedImages.length > 0 && (
        <div className="staged-summary-bar">
          <div className="staged-stats">
            <span className="staged-count-pill">
              <CameraIcon size={16} />
              <span><strong>{uploadedImages.length}</strong> photos selected</span>
            </span>
            <span className="staged-size-pill">
              <span>{totalSizeMB} MB total</span>
            </span>
            <span className={`staged-advice-pill ${advice.color}`}>
              <span>{advice.label}</span>
            </span>
          </div>

          <div className="staged-actions">
            <button 
              className="btn btn-outline btn-sm text-red"
              onClick={handleClearAll}
            >
              <TrashIcon size={14} />
              <span>Clear All</span>
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <span>+ Add More Photos</span>
            </button>
          </div>
        </div>
      )}

      {/* Thumbnail Previews Grid */}
      {uploadedImages.length > 0 && (
        <div className="image-previews-container">
          <h3 className="previews-title">Staged Image Previews ({uploadedImages.length})</h3>
          <div className="previews-grid">
            {uploadedImages.map((img, idx) => (
              <div key={img.id} className="preview-tile">
                <img src={img.previewUrl} alt={img.name} className="preview-img" />
                <div className="preview-tile-overlay">
                  <span className="preview-index">#{idx + 1}</span>
                  <button 
                    className="preview-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(img.id, img.previewUrl);
                    }}
                    title="Remove this photo"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
                <div className="preview-meta">
                  <span className="preview-filename" title={img.name}>{img.name}</span>
                  <span className="preview-size">{(img.size / 1024).toFixed(0)} KB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer: Start Reconstruction */}
      <div className="upload-footer-actions">
        <button 
          className="btn btn-primary btn-lg pulse-hover"
          disabled={uploadedImages.length === 0}
          onClick={onStartReconstruction}
        >
          <SparklesIcon size={20} />
          <span>Start Reconstruction ({uploadedImages.length} Photos)</span>
          <ArrowRightIcon size={18} />
        </button>

        {uploadedImages.length === 0 && (
          <p className="upload-hint-sub">Please select at least one photo of your indoor room to proceed.</p>
        )}
      </div>
    </div>
  );
}
