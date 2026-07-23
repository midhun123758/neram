import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import FogOverlay from './components/FogOverlay'
import './index.css'

function App() {
  const appRef     = useRef(null)
  const imgRef     = useRef(null)
  const contentRef = useRef(null)
  const logoRef    = useRef(null)
  const navLogoRef = useRef(null)

  const [isVideoOpen, setIsVideoOpen] = useState(false)

  useEffect(() => {
    let currentY  = 0
    let targetY   = 0
    let rafId     = null
    let touchStartY = 0

    const lerp = (a, b, t) => a + (b - a) * t

    // ── Update container height dynamically ──────────────────────────────────
    const updateHeight = () => {
      if (appRef.current && contentRef.current) {
        const vh = window.innerHeight
        const phase1_5End = vh * 1.5 // phases before dark content appears
        const contentH = contentRef.current.scrollHeight
        // We add vh to contentH because the dark section starts fully off-screen (at 100vh)
        // and needs 1 full vh of scrolling just to slide in to position.
        appRef.current.style.height = `${phase1_5End + vh + contentH}px`
      }
    }
    
    // Initial measure + listen for resize
    setTimeout(updateHeight, 100)
    window.addEventListener('resize', updateHeight)

    // ── Scroll target clamping ───────────────────────────────────────────────
    const clampTarget = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      targetY = Math.max(0, Math.min(targetY, maxScroll))
    }

    // ── Mouse wheel ──────────────────────────────────────────────────────────
    const onWheel = (e) => {
      e.preventDefault()
      // Normalize across trackpads (small deltaY) and mice (large deltaY)
      // Lowered sensitivity to make scrolling "less fast"
      const delta = Math.abs(e.deltaY) > 50
        ? e.deltaY * 0.35   // mouse wheel — slow and deliberate
        : e.deltaY * 0.8    // trackpad — slower
      targetY += delta
      clampTarget()
    }

    // ── Touch support ────────────────────────────────────────────────────────
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      e.preventDefault()
      const dy = touchStartY - e.touches[0].clientY
      targetY += dy * 1.5
      touchStartY = e.touches[0].clientY
      clampTarget()
    }

    // ── rAF loop ─────────────────────────────────────────────────────────────
    const tick = () => {
      const diff = targetY - currentY

      // Snap when close enough to avoid infinite tiny updates
      if (Math.abs(diff) < 0.05) {
        currentY = targetY
      } else {
        // Lowered lerp factor from 0.075 to 0.045 for "more smoothly" feel
        currentY = lerp(currentY, targetY, 0.045) 
      }

      window.scrollTo(0, Math.round(currentY))

      const vh = window.innerHeight

      // ── Phase 1 (0 → 1.0*vh): pan image top → bottom ────────────────────
      // Takes a full screen height to pan, so it's slow and fully completes first.
      const phase1End = vh * 1.0
      const phase1 = Math.min(Math.max(currentY / phase1End, 0), 1)
      if (imgRef.current) {
        imgRef.current.style.objectPosition = `center ${phase1 * 100}%`
      }

      // ── Phase 1.5 (1.0*vh → 1.5*vh): smooth logo writing reveal ─────────
      const phase1_5End = vh * 1.5
      const phase1_5 = Math.min(Math.max((currentY - phase1End) / (phase1_5End - phase1End), 0), 1)

      // ── Phase 2 (starts after 1.5*vh): scroll dark sections up ──────────
      // Once phase 1.5 is done, the dark content slides up naturally
      // pixel-for-pixel with the scroll wheel.
      let contentScroll = 0
      let imageOpacity = 1

      if (contentRef.current) {
        if (currentY > phase1_5End) {
          contentScroll = Math.max(0, currentY - phase1_5End)
          
          // As the second section slides up (contentScroll goes from 0 to 100vh),
          // fade the background image to black (opacity 1 to 0)
          const fadeProgress = Math.min(1, contentScroll / window.innerHeight)
          imageOpacity = 1 - fadeProgress
        }
        
        contentRef.current.style.transform = `translateY(calc(100vh - ${contentScroll}px))`
        
        // Apply the calculated opacity to the image
        if (imgRef.current) {
            imgRef.current.style.opacity = imageOpacity
        }
      }

      // phase2 tracks just the first 100vh of this slide (0 to 1)
      const phase2 = Math.min(contentScroll / vh, 1)

      if (navLogoRef.current) {
        if (phase2 > 0) {
          // Disable CSS animation so inline opacity can take effect
          navLogoRef.current.style.animation = 'none'
          
          if (phase2 >= 0.8) {
            // Fade out smoothly in the final 20%
            navLogoRef.current.style.opacity = Math.max(0, 1 - (phase2 - 0.8) * 5)
          } else {
            navLogoRef.current.style.opacity = 1
          }
        } else {
          // Allow initial CSS animation to run when at the top
          navLogoRef.current.style.animation = ''
          navLogoRef.current.style.opacity = ''
        }
      }

      if (logoRef.current) {
        // -20% to 100% to ensure the mask fully clears the width
        logoRef.current.style.setProperty('--reveal', `${(phase1_5 * 120) - 20}%`)
        
        // During the first 100vh (phase2), logo moves to the top left (navbar position).
        // It stops scrolling so it acts as the fixed navbar logo.
        const translateX = `calc(-50% - ${phase2 * 50}vw + ${phase2 * 9}rem)` 
        const translateY = `calc(-50% - ${phase2 * 50}vh + ${phase2 * 3.5}rem)`
        const scale = 1 - (phase2 * 0.8) // shrink to fit navbar
        
        logoRef.current.style.transform = `translate(${translateX}, ${translateY}) scale(${scale})`
      }

      rafId = requestAnimationFrame(tick)
    }

    // ── Register events ──────────────────────────────────────────────────────
    window.addEventListener('wheel',      onWheel,      { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('touchmove',  onTouchMove,  { passive: false })
    
    // Recalculate height once fonts/images load
    window.addEventListener('load', updateHeight)
    
    rafId = requestAnimationFrame(tick)

    // ── Scroll Reveal Intersection Observer ──────────────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active')
          }
        })
      },
      { threshold: 0.45 } // Wait until 45% of the image is on-screen before animating
    )

    const revealElements = document.querySelectorAll('.reveal-on-scroll')
    revealElements.forEach((el) => observer.observe(el))

    return () => {
      window.removeEventListener('resize',     updateHeight)
      window.removeEventListener('load',       updateHeight)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="app-container" ref={appRef}>

      {/* Layer 0 — fixed background image */}
      <div className="image-container">
        <img
          ref={imgRef}
          src="/waterfall.jpeg"
          alt="Background"
          fetchPriority="high"
          decoding="sync"
        />
      </div>

      {/* Layer 1 — fog WebGL canvas, limited DPR for performance */}
      <div className="canvas-container">
        <Canvas
          dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
          frameloop="always"
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <FogOverlay />
          </Suspense>
        </Canvas>
      </div>

      {/* Layer 2 — fixed navbar */}
      <div className="ui-overlay">
        <nav className="navbar">
          <div className="logo" ref={navLogoRef} onClick={() => setIsVideoOpen(true)}>NERAM</div>
          <div className="nav-controls">
            <div className="lang-switch">
              <span className="active">en</span>
              <span className="separator"></span>
              <span>ja</span>
            </div>
            <button className="menu-btn">
              <span className="menu-text">menu</span>
              <div className="menu-lines">
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Layer 2.5 — Centered logo revealed via scroll */}
      <img 
        ref={logoRef}
        src="/logo.png" 
        alt="Neram Logo" 
        className="center-logo"
        onClick={() => setIsVideoOpen(true)}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      />

      {/* Dark section — JS slides this up only AFTER image is fully panned */}
      <div className="scroll-content" ref={contentRef}>
        
        {/* Phase 2: Philosophy Section */}
        <div className="philosophy-section">
          
          {/* Background Video */}
          <div className="section-video-bg">
            <iframe 
              title="vimeo-bg" 
              src="https://player.vimeo.com/video/156891323?h=078885103c&background=1#t=2s" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture"   
            ></iframe>
          </div>

          {/* Decorative Images */}
          <div className="deco-gallery">
            <div className="deco-item img-1 reveal-on-scroll">
              <img src="/nature4.jpg" alt="Landscape" />
            </div>
            <div className="deco-item img-2 reveal-on-scroll">
              <img src="/nature5.jpg" alt="Waterfall" />
            </div>
            <div className="deco-item img-3 reveal-on-scroll">
              <img src="/nature3.jpg" alt="Nature" />
            </div>
            <div className="deco-item img-4 reveal-on-scroll">
              <img src="/nature6.jpg" alt="Mountains" />
            </div>
          </div>

          <div className="philosophy-inner">
            <h2 className="vertical-text">PHILOSOPHY</h2>
            <div className="philosophy-content">
              <h2>Nature is not a place to visit.<br/>It is home.</h2>
            </div>
          </div>
        </div>



        {/* Phase 3: Collage Section */}
        <div className="collage-section">
          <div className="collage-container reveal-on-scroll">
            <img src="/collage.jpg" alt="" style={{ width: '100%', height: 'auto', visibility: 'hidden' }} />
            <div className="collage-slices">
              <div className="slice slice-1"></div>
              <div className="slice slice-2"></div>
              <div className="slice slice-3"></div>
              <div className="slice slice-4"></div>
              <div className="slice slice-5"></div>
            </div>
          </div>
          <div className="collage-inner">
            <h2 className="vertical-text">HEALING</h2>
            <div className="collage-content">
              <p className="collage-subtitle">NATURE · TRAVEL · HEALING</p>
              <h2>
                Every Journey<br/>
                Begins With<br/>
                <span className="text-green" onClick={() => setIsVideoOpen(true)} style={{ cursor: 'pointer' }}>NERAM</span>
              </h2>
              <p className="collage-description">
                NERAM crafts unforgettable travel experiences that bring together nature, adventure, and culture. From peaceful camps and mountain treks to group expeditions and personalized journeys, every trip is thoughtfully designed to inspire exploration, create lasting memories, and help you reconnect with the world around you.
                <span className="text-highlight">Explore More. Live Better.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="footer-section">
          <div className="footer-content">
            
            <div className="footer-brand">
              <h2 className="footer-logo">NERAM</h2>
              <p className="footer-tagline">Nature. Travel. Healing.</p>
            </div>
            
            <div className="footer-grid">
              <div className="footer-col about-col">
                <h3>Nature. Travel. Healing.</h3>
                <p>
                  NERAM creates unforgettable trekking, camping, and outdoor experiences that bring people closer to nature and meaningful connections.
                </p>
              </div>
              
              <div className="footer-col links-col">
                <h4 className="footer-heading">EXPLORE</h4>
                <ul>
                  <li><a href="#">All Packages</a></li>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
              
              <div className="footer-col reach-col">
                <h4 className="footer-heading">REACH US</h4>
                <ul>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    WhatsApp
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    neram.inn@gmail.com
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    @neram.in
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
        </footer>

      </div>

      {/* Video Modal Overlay */}
      {isVideoOpen && (
        <div className="video-modal-overlay" onClick={() => setIsVideoOpen(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-close-btn" onClick={() => setIsVideoOpen(false)}>
              &times;
            </button>
            <div className="video-wrapper">
              <iframe 
                title="vimeo-player" 
                src="https://player.vimeo.com/video/156891323?h=078885103c&background=1&muted=0#t=2s" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"   
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
