
import Viewer from "./Viewer";
import "./App.css";

function App() {
  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>Namma Space</h1>
          <p>Interactive Indoor Digital Twin</p>
        </div>
        <span className="round">ROUND 1</span>
      </header>

      <section className="intro">
        <h2>Explore your space in 3D</h2>
        <p>
          Walk through the virtual environment using your
          keyboard and mouse.
        </p>
      </section>

      <section className="viewer-section">
        <Viewer />
        <div className="controls">
          <span>W A S D — Move</span>
          <span>Mouse — Look around</span>
          <span>Click the room to enable mouse control</span>
        </div>
      </section>

      <footer>
        Namma Space · Techfest 2026–27
      </footer>
    </main>
  );
}

export default App;
