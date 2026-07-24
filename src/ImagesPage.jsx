import React, { useEffect, useRef, useState } from 'react';

const galleryImages = [
  {
    id: 1,
    url: '/user_image1.png',
    title: 'DISCOVER'
  },
  {
    id: 2,
    url: '/user_image2.jpg',
    title: 'WANDER'
  },
  {
    id: 3,
    url: '/user_image3.jpg',
    title: 'JOURNEY'
  },
  {
    id: 4,
    url: '/user_image4.jpg',
    title: 'ESCAPE'
  }
];

export default function ImagesPage({ navigateTo }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const rafId = useRef(null);
  
  // For smooth lerping
  const currentX = useRef(0);
  const targetX = useRef(0);
  const panelsCache = useRef([]);
  
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Trigger entry animation
    setTimeout(() => {
      setHasEntered(true);
    }, 100);

    const handleScroll = () => {
      if (!containerRef.current) return;
      const containerTop = containerRef.current.offsetTop;
      const scrollY = window.scrollY - containerTop;
      const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
      
      let progress = scrollY / maxScroll;
      progress = Math.max(0, Math.min(progress, 1));
      
      const maxTranslate = (galleryImages.length - 1) * window.innerWidth;
      targetX.current = progress * -maxTranslate;
    };

    const animate = () => {
      currentX.current += (targetX.current - currentX.current) * 0.08;
      
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${currentX.current}px)`;
        
        // Use cached DOM nodes to avoid 60fps querySelectorAll lag on mobile
        const w = window.innerWidth;
        panelsCache.current.forEach((panelObj, index) => {
          const panelLeft = index * w;
          const distFromCenter = panelLeft + currentX.current;
          const normalizedDist = distFromCenter / w;
          
          if (panelObj.bg) {
            panelObj.bg.style.transform = `translateX(${normalizedDist * 15}vw) scale(${1 + Math.abs(normalizedDist) * 0.15})`;
          }
          if (panelObj.content) {
            panelObj.content.style.opacity = 1 - Math.abs(normalizedDist) * 1.5;
            panelObj.content.style.transform = `translateY(${Math.abs(normalizedDist) * 50}px)`;
          }
        });
      }
      
      rafId.current = requestAnimationFrame(animate);
    };

    // Cache DOM nodes once
    if (trackRef.current) {
      const panels = trackRef.current.querySelectorAll('.gallery-panel');
      panelsCache.current = Array.from(panels).map(panel => ({
        bg: panel.querySelector('.gallery-panel-bg img'),
        content: panel.querySelector('.gallery-panel-content')
      }));
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
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
      <nav className="images-navbar">
        <div className="nav-logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
          NERAM
        </div>
        <div className="nav-menu-btn" onClick={() => navigateTo('home')}>
          BACK
        </div>
      </nav>

      <div className="horizontal-sticky-container">
        <div className="horizontal-track" ref={trackRef}>
          {galleryImages.map((img, index) => (
            <div key={img.id} className="gallery-panel">
              <div className="gallery-panel-bg">
                <img src={img.url} alt={img.title} />
                <div className="gallery-panel-overlay"></div>
              </div>
              <div className="gallery-panel-content">
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
