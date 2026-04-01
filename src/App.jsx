import { useState, useEffect, useRef } from 'react'
import './App.css'
import mostlyBackendImg from './assets/mostly_backend.png'
import mostlyBackendWhiteImg from './assets/mostly-backend-white.png'
import spotifyTUIImg from './assets/spotifyTUI.png'
import gauriCooksImg from './assets/gauricooks.png'
import ponkeVideo from './assets/ponke-ponkesol.mp4'
import resumePdf from './assets/resume.pdf'
import resumePhoto from './assets/resumephoto.png'
import brainCacheImg from './assets/braincache.png'

function App() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [theme, setTheme] = useState('light');
  
  const projectImageRef = useRef(null);
  const canvasRef = useRef(null);

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
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Dots animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let mouse = { x: -1000, y: -1000 };
    let lastMouseMoveTime = 0;
    let activityMultiplier = 0;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMouseMoveTime = Date.now();
    };
    
    // For smooth lerping
    let currentDots = [];
    let isInitialized = false;

    const initDots = () => {
      currentDots = [];
      const spacing = 20; // Decreased from 40 for more dots
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          currentDots.push({ x, y, baseX: x, baseY: y });
        }
      }
      isInitialized = true;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = theme === 'dark';
      
      // Use subtle colors that don't get in the way of reading
      const baseR = isDark ? 150 : 120;
      const baseG = isDark ? 150 : 130;
      const baseB = isDark ? 160 : 150;
      
      const maxDist = 150;
      
      const now = Date.now();
      const timeSinceLastMove = now - lastMouseMoveTime;
      const targetMultiplier = timeSinceLastMove > 50 ? 0 : 1;
      
      // Smoothly transition the activity multiplier
      activityMultiplier += (targetMultiplier - activityMultiplier) * 0.1;
      
      currentDots.forEach(dot => {
        const dx = dot.baseX - mouse.x;
        const dy = dot.baseY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Slightly bigger base radius and base opacity to be visible without interaction
        let radius = 0.4; 
        let opacity = 0.4; 
        let yOffset = 0;
        
        if (dist < maxDist) {
          const effect = ((maxDist - dist) / maxDist) * activityMultiplier; // 0 to 1 scaled by activity
          radius += effect * 1.5; // Scale up
          opacity += effect * 0.7; // Light up
          yOffset = effect * -10; // Raise up
        }
        
        // Lerp position for smooth movement
        dot.y += ((dot.baseY + yOffset) - dot.y) * 0.1;
        
        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const projects = [
    {
      name: "Gauri Cooks",
      year: "2025",
      link: "https://www.gauricooks.com",
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
      name: "Brain Cache",
      year: "2026",
      link: "https://brain-cache-frontend.vercel.app/",
      image: brainCacheImg
    },
    {
      name: "Resume",
      link: resumePdf,
      image: resumePhoto
    }
  ];

  return (
    <div className="app-container">
      {/* Background Dots Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

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
