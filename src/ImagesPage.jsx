import React, { useEffect, useRef, useState } from 'react';

const galleryImages = [
  {
    id: 1,
    url: '/nature1.jpg',
    title: 'THE WILD',
    subtitle: 'INTO THE UNKNOWN'
  },
  {
    id: 2,
    url: '/nature2.jpg',
    title: 'SERENITY',
    subtitle: 'FIND YOUR PEACE'
  },
  {
    id: 3,
    url: '/nature3.jpg',
    title: 'ELEVATION',
    subtitle: 'REACH THE PEAK'
  },
  {
    id: 4,
    url: '/nature4.jpg',
    title: 'AWAKENING',
    subtitle: 'BREATHE THE WILD AIR'
  },
  {
    id: 5,
    url: '/nature5.jpg',
    title: 'HORIZON',
    subtitle: 'ENDLESS POSSIBILITIES'
  }
];

export default function ImagesPage({ navigateTo }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const rafId = useRef(null);
  
  // For smooth lerping
  const currentX = useRef(0);
  const targetX = useRef(0);
  
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Trigger entry animation
    setTimeout(() => {
      setHasEntered(true);
    }, 100);

    const handleScroll = () => {
      if (!containerRef.current) return;
      // Calculate how far we've scrolled down the container
      const containerTop = containerRef.current.offsetTop;
      const scrollY = window.scrollY - containerTop;
      const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
      
      // Calculate percentage (0 to 1)
      let progress = scrollY / maxScroll;
      progress = Math.max(0, Math.min(progress, 1));
      
      // Max translate X is (Total panels - 1) * 100vw
      const maxTranslate = (galleryImages.length - 1) * window.innerWidth;
      targetX.current = progress * -maxTranslate;
    };

    const animate = () => {
      // Lerp (smooth follow)
      currentX.current += (targetX.current - currentX.current) * 0.08;
      
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${currentX.current}px)`;
        
        // Advanced Parallax: Adjust images inside the track based on position
        const panels = trackRef.current.querySelectorAll('.gallery-panel');
        panels.forEach((panel, index) => {
          const panelLeft = index * window.innerWidth;
          // Distance from screen center
          const distFromCenter = panelLeft + currentX.current;
          const normalizedDist = distFromCenter / window.innerWidth;
          
          const bg = panel.querySelector('.gallery-panel-bg img');
          const content = panel.querySelector('.gallery-panel-content');
          
          if (bg) {
            // Parallax the image inside the panel slightly opposite to scroll
            bg.style.transform = `translateX(${normalizedDist * 15}vw) scale(${1 + Math.abs(normalizedDist) * 0.15})`;
          }
          if (content) {
            // Fade and move content based on how far from center
            content.style.opacity = 1 - Math.abs(normalizedDist) * 1.5;
            content.style.transform = `translateY(${Math.abs(normalizedDist) * 50}px)`;
          }
        });
      }
      
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Start loop
    handleScroll();
    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className={`horizontal-gallery-wrapper ${hasEntered ? 'has-entered' : ''}`} ref={containerRef}>
      {/* 
        The wrapper has height = 500vh (number of images * 100vh).
        This forces the browser to have a long vertical scrollbar. 
      */}
      
      <nav className="images-navbar">
        <div className="nav-logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
          NERAM
        </div>
        <div className="nav-menu-btn" onClick={() => navigateTo('home')}>
          BACK
        </div>
      </nav>

      <div className="horizontal-sticky-container">
        {/* This container sticks to the screen while we scroll down the wrapper */}
        <div className="horizontal-track" ref={trackRef}>
          {galleryImages.map((img, index) => (
            <div key={img.id} className="gallery-panel">
              <div className="gallery-panel-bg">
                <img src={img.url} alt={img.title} />
                <div className="gallery-panel-overlay"></div>
              </div>
              <div className="gallery-panel-content">
                <h3>{img.subtitle}</h3>
                <h2>{img.title}</h2>
                <div className="panel-indicator">
                  {String(index + 1).padStart(2, '0')} &mdash; {String(galleryImages.length).padStart(2, '0')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
