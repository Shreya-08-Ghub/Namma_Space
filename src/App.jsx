import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import ImageUpload from "./components/ImageUpload";
import ReconstructionView from "./components/ReconstructionView";
import ModelImporter from "./components/ModelImporter";
import Viewer from "./components/Viewer";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import "./App.css";

export default function App() {
  // Navigation tab state: 'home' | 'dashboard' | 'upload' | 'reconstruction' | 'import' | 'viewer' | 'how-it-works' | 'about'
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    const validTabs = ["home", "dashboard", "upload", "reconstruction", "import", "viewer", "how-it-works", "about"];
    return validTabs.includes(hash) ? hash : "home";
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [currentModelUrl, setCurrentModelUrl] = useState(null);
  const [currentModelTitle, setCurrentModelTitle] = useState("Reference Digital Twin Room");
  const activeObjectUrlRef = useRef(null);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      if (activeObjectUrlRef.current && activeObjectUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(activeObjectUrlRef.current);
      }
    };
  }, []);

  // Sync tab with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validTabs = ["home", "dashboard", "upload", "reconstruction", "import", "viewer", "how-it-works", "about"];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleModelSelected = (url, name, details) => {
    // Revoke previous object URL if replacing with a new one
    if (activeObjectUrlRef.current && activeObjectUrlRef.current !== url && activeObjectUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
    }
    activeObjectUrlRef.current = url;

    setCurrentModelUrl(url);
    setCurrentModelTitle(name);

    // Save to localStorage recent projects
    try {
      const saved = localStorage.getItem("namma_space_projects");
      let list = saved ? JSON.parse(saved) : [];
      const newProj = {
        id: `proj-${Date.now()}`,
        title: name,
        description: `Custom 3D model imported (${details?.type || "GLB"}, ${details?.sizeMB || "0"} MB).`,
        date: new Date().toISOString().split("T")[0],
        type: "Imported 3D Model",
        status: "Ready",
        polyCount: "User Model",
        size: `${details?.sizeMB || "<1"} MB`,
        isSample: false,
        modelUrl: url
      };
      list = [newProj, ...list.filter(p => p.title !== name)];
      localStorage.setItem("namma_space_projects", JSON.stringify(list));
    } catch (e) {
      console.warn("Could not update local projects", e);
    }
  };

  const handleSwitchToSampleRoom = () => {
    if (activeObjectUrlRef.current && activeObjectUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(activeObjectUrlRef.current);
      activeObjectUrlRef.current = null;
    }
    setCurrentModelUrl(null);
    setCurrentModelTitle("Reference Digital Twin Room");
  };

  return (
    <div className="namma-app-root">
      {/* Top Universal Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content View Switcher */}
      <main className="main-content-area">
        {activeTab === "home" && (
          <LandingPage setActiveTab={handleTabChange} />
        )}

        {activeTab === "dashboard" && (
          <Dashboard 
            setActiveTab={handleTabChange}
            onLoadModel={(url, title) => {
              if (url) {
                setCurrentModelUrl(url);
                setCurrentModelTitle(title);
              } else {
                handleSwitchToSampleRoom();
              }
            }}
            uploadedImagesCount={uploadedImages.length}
          />
        )}

        {activeTab === "upload" && (
          <ImageUpload 
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            onStartReconstruction={() => handleTabChange("reconstruction")}
          />
        )}

        {activeTab === "reconstruction" && (
          <ReconstructionView 
            uploadedImages={uploadedImages}
            onReturnToUpload={() => handleTabChange("upload")}
            setActiveTab={handleTabChange}
            onLaunchReferenceRoom={() => {
              handleSwitchToSampleRoom();
              handleTabChange("viewer");
            }}
            onLaunchImport={() => handleTabChange("import")}
          />
        )}

        {activeTab === "import" && (
          <ModelImporter 
            onModelSelected={handleModelSelected}
            onSwitchToSampleRoom={handleSwitchToSampleRoom}
            setActiveTab={handleTabChange}
          />
        )}

        {activeTab === "viewer" && (
          <div className="viewer-tab-wrapper">
            <Viewer 
              key={currentModelUrl || "sample"}
              modelUrl={currentModelUrl}
              modelTitle={currentModelTitle}
              onReturnToDashboard={() => handleTabChange("dashboard")}
              onReturnToSample={handleSwitchToSampleRoom}
              onNavigateToImport={() => handleTabChange("import")}
            />
          </div>
        )}

        {activeTab === "how-it-works" && (
          <HowItWorks setActiveTab={handleTabChange} />
        )}

        {activeTab === "about" && (
          <About setActiveTab={handleTabChange} />
        )}
      </main>
    </div>
  );
}
