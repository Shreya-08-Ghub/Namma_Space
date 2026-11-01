import { useState } from "react";
import { CubeIcon, CameraIcon, File3DIcon, EyeIcon, InfoIcon, CompassIcon } from "./Icons";

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: CompassIcon },
    { id: "dashboard", label: "Dashboard", icon: CubeIcon },
    { id: "upload", label: "Create Twin", icon: CameraIcon },
    { id: "import", label: "Import 3D Model", icon: File3DIcon },
    { id: "viewer", label: "3D Viewer", icon: EyeIcon },
    { id: "how-it-works", label: "How It Works", icon: InfoIcon },
    { id: "about", label: "About", icon: InfoIcon }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.location.hash = id;
  };

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        {/* Brand Identity */}
        <div className="navbar-brand" onClick={() => handleNavClick("home")}>
          <div className="brand-logo-icon">
            <CubeIcon size={24} className="text-cyan" />
          </div>
          <div className="brand-text">
            <span className="brand-title">NAMMA SPACE</span>
            <span className="brand-tagline">AI Indoor Digital Twin</span>
          </div>
          <span className="techfest-pill">IIT BOMBAY TECHFEST</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link-btn ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Launch CTA */}
        <div className="navbar-actions">
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => handleNavClick("viewer")}
          >
            <EyeIcon size={16} />
            <span>Launch Viewer</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`bar ${mobileMenuOpen ? "open-1" : ""}`}></span>
            <span className={`bar ${mobileMenuOpen ? "open-2" : ""}`}></span>
            <span className={`bar ${mobileMenuOpen ? "open-3" : ""}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`mobile-nav-btn ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="mobile-menu-footer">
            <button 
              className="btn btn-primary w-full"
              onClick={() => handleNavClick("viewer")}
            >
              <EyeIcon size={18} />
              <span>Launch 3D Viewer</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

