import { useState, useEffect, useRef } from 'react'
import './App.css'
import mostlyBackendImg from './assets/mostly_backend.png'
import mostlyBackendWhiteImg from './assets/mostly-backend-white.png'
import spotifyTUIImg from './assets/spotifyTUI.png'
import gauriCooksImg from './assets/gauriCooks.png'
import ponkeVideo from './assets/ponke-ponkesol.mp4'
import resumePdf from './assets/resume.pdf'
import resumePhoto from './assets/resumephoto.jpg'

function App() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [theme, setTheme] = useState('light');
  
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const projectImageRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate offset from center
      const x = (e.clientX - window.innerWidth / 2) / 8;
      const y = (e.clientY - window.innerHeight / 2) / 8;
      
      if (projectImageRef.current) {
        projectImageRef.current.style.setProperty('--mouse-x', `${x}px`);
        projectImageRef.current.style.setProperty('--mouse-y', `${y}px`);
      }

      // Custom cursor position
      const posX = e.clientX;
      const posY = e.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${posX}px`;
        cursorDotRef.current.style.top = `${posY}px`;
      }
      
      if (cursorOutlineRef.current) {
        // Using animate for smoother trailing effect without CSS transition lag on rapid movement
        cursorOutlineRef.current.animate({
          left: `${posX}px`,
          top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
      }
    };

    const handleMouseDown = () => {
      if (cursorOutlineRef.current)
        cursorOutlineRef.current.classList.add('cursor-active');
    };

    const handleMouseUp = () => {
      if (cursorOutlineRef.current)
        cursorOutlineRef.current.classList.remove('cursor-active');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const projects = [
    {
      name: "Gauri Cooks",
      year: "2025",
      link: "https://github.com/thenakulmistry/chefV1",
      image: gauriCooksImg
    },
    {
      name: "SpotifyTUI",
      year: "2025",
      link: "https://github.com/thenakulmistry/spotifyTUI",
      image: spotifyTUIImg
    },
    {
      name: "AI Trading Simulator",
      year: "2025",
      link: "https://github.com/thenakulmistry/RetroTrade",
      video: ponkeVideo
    },
    {
      name: "Resume",
      link: resumePdf,
      image: resumePhoto
    }
  ];

  return (
    <div className="app-container">
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-outline" ref={cursorOutlineRef}></div>

      {/* Centered Project Image */}
      <div 
        ref={projectImageRef}
        className={`project-image-container ${hoveredProject ? 'visible' : ''}`}
      >
        {hoveredProject && (
          hoveredProject.video ? (
            <video 
              src={hoveredProject.video} 
              className="centered-image" 
              autoPlay 
              loop 
              muted 
              playsInline
            />
          ) : (
            <img src={hoveredProject.image} alt={hoveredProject.name} className="centered-image" />
          )
        )}
      </div>

      {/* Mobile Modal */}
      {selectedProject && (
        <div className="mobile-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="mobile-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProject(null)}>×</button>
            
            <div className="mobile-preview-media">
              {selectedProject.video ? (
                <video 
                  src={selectedProject.video} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                />
              ) : (
                <img src={selectedProject.image} alt={selectedProject.name} />
              )}
            </div>
            
            <a 
              href={selectedProject.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mobile-project-link"
            >
              {selectedProject.name === "Resume" ? "View Resume" : "View Project"}
            </a>
          </div>
        </div>
      )}

      <main className="content">
        {/* Projects List */}
        <div className="projects-section">
          <div className="projects-list">
            {projects.map((project, index) => (
              <a 
                key={index} 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-item"
                onMouseEnter={() => !isMobile && setHoveredProject(project)}
                onMouseLeave={() => !isMobile && setHoveredProject(null)}
                onClick={(e) => {
                  if (isMobile) {
                    e.preventDefault();
                    setSelectedProject(project);
                  }
                }}
              >
                <span className="project-name">{project.name}</span>
                <span className="project-year">{project.year}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Intro Section */}
        <div className={`intro-section ${hoveredProject ? 'hidden' : ''}`}>
          <h1 className="intro-line">Nakul Mistry</h1>
          <div className="role-container">
            <p className="intro-line">Full Stack Developer</p>
            <img 
              src={theme === 'dark' ? mostlyBackendWhiteImg : mostlyBackendImg} 
              alt="Mostly Backend" 
              className="handwritten-img" 
            />
          </div>
          
          <div className="social-links">
            <a href="https://github.com/thenakulmistry" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/nakul7" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:mistrynakul2001@gmail.com">Email</a>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
