import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import FogOverlay from './components/FogOverlay'
import PackagesPage from './PackagesPage'
import ContactPage from './ContactPage'
import Footer from './Footer'
import Sidebar from './Sidebar'
import './index.css'
import 'lenis/dist/lenis.css'
import Lenis from 'lenis'
import Player from '@vimeo/player'

function App() {
  const appRef     = useRef(null)
  const heroBgRef  = useRef(null)
  const imgRef     = useRef(null)
  const contentRef = useRef(null)
  const logoRef    = useRef(null)
  const navLogoRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const iframeRef = useRef(null)

  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isRain, setIsRain] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPackagesOpen, setIsPackagesOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [currentPage, setCurrentPage] = useState('home')
  const pageRef = useRef('home')
  
  const navigateTo = (page) => {
    setCurrentPage(page)
    pageRef.current = page
    if (page === 'home') {
      window.scrollTo(0, 0)
    }
  }

  // Handle Preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Handle Vimeo looping at 60%
  useEffect(() => {
    let player = null
    if (isVideoOpen && iframeRef.current) {
      player = new Player(iframeRef.current)
      let duration = 0
      
      player.getDuration().then((d) => {
        duration = d
      })

      player.on('timeupdate', (data) => {
        if (duration > 0 && data.seconds >= duration * 0.6) {
          player.setCurrentTime(0)
        }
      })
    }
    return () => {
      if (player) {
        player.destroy()
      }
    }
  }, [isVideoOpen])

  useEffect(() => {
    let previousRenderedY = -1
    let rafId     = null
    let logoTargetX = 0
    let logoTargetY = 0
    let windowWidth = window.innerWidth
    let windowHeight = window.innerHeight

    // ── Lenis smooth scroll (same library as izanami-official.com) ───────
    const lenis = new Lenis({
      autoRaf: true,           // Let Lenis manage its own rAF loop
      duration: 1.2,           // Glide duration — matches Izanami's feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

      // ── Update container height dynamically ──────────────────────────────────
      const updateHeight = () => {
        if (pageRef.current !== 'home') return
        
        windowWidth = window.innerWidth
        windowHeight = window.innerHeight
        
        if (appRef.current && contentRef.current) {
          const vh = windowHeight
          const phase1_5End = vh * 0.8 // Faster NERAM logo reveal
          const contentH = contentRef.current.scrollHeight
          appRef.current.style.height = `${phase1_5End + vh + contentH}px`
          
          // Calculate exact destination for the flying logo
          if (navLogoRef.current) {
            const navRect = navLogoRef.current.getBoundingClientRect()
            logoTargetX = navRect.left + navRect.width / 2
            logoTargetY = navRect.top + navRect.height / 2
          }
          
          // Force a re-render next tick if layout changes
          previousRenderedY = -1
        }
      }

    // ── Initial measure + listen for resize
    setTimeout(updateHeight, 100)
    window.addEventListener('resize', updateHeight)

    // ── rAF loop ─────────────────────────────────────────────────────────────
    const tick = () => {
      if (pageRef.current !== 'home') {
        rafId = requestAnimationFrame(tick)
        return
      }

      // Pure native scroll reading
      const currentY = window.scrollY

      // ── Optimization: Skip heavy DOM updates if scroll barely changed
      if (Math.abs(currentY - previousRenderedY) < 0.5) {
        rafId = requestAnimationFrame(tick)
        return
      }
      previousRenderedY = currentY

      const vw = windowWidth
      const vh = windowHeight

      // ── Phase 1 (0 → 0.4*vh): pan image top → bottom (faster) ────────────
      const phase1End = vh * 0.4
      const phase1 = Math.min(Math.max(currentY / phase1End, 0), 1)
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(-${phase1 * 15}vh)`
      }

      // ── Phase 1.5 (0.4*vh → 0.8*vh): smooth logo writing reveal (faster) ──
      const phase1_5End = vh * 0.8
      const phase1_5 = Math.min(Math.max((currentY - phase1End) / (phase1_5End - phase1End), 0), 1)

      // ── Phase 2 (starts after 0.8*vh): scroll dark sections up ──────────
      // Once phase 1.5 is done, the dark content slides up naturally
      // pixel-for-pixel with the scroll.
      let contentScroll = 0
      let imageOpacity = 1

      if (contentRef.current) {
        if (currentY > phase1_5End) {
          contentScroll = Math.max(0, currentY - phase1_5End)
          
          // Fade the background as the second section slides up
          const fadeProgress = Math.min(1, contentScroll / vh)
          imageOpacity = 1 - fadeProgress
        }
        
        contentRef.current.style.transform = `translateY(calc(100vh - ${contentScroll}px))`
        
        // Apply the calculated opacity to the hero background
        if (heroBgRef.current) {
            heroBgRef.current.style.opacity = imageOpacity
            // Hide completely when faded out to save GPU resources (especially WebGL)
            heroBgRef.current.style.visibility = imageOpacity <= 0.01 ? 'hidden' : 'visible'
        }
      }

      // phase2 tracks just the first 100vh of this slide (0 to 1)
      const phase2 = Math.min(contentScroll / vh, 1)

      const isMobile = window.innerWidth <= 768
      const speedFactor = isMobile ? 1.6 : 1.15
      const logoPhase = Math.min(phase2 * speedFactor, 1)

      if (navLogoRef.current) {
        if (logoPhase > 0) {
          // Disable CSS animation so inline opacity can take effect
          navLogoRef.current.style.animation = 'none'
          
          // Fade out the navbar text logo as the image logo comes to take its place
          navLogoRef.current.style.opacity = Math.max(0, 1 - (logoPhase * 2))
        } else {
          // Allow initial CSS animation to run when at the top
          navLogoRef.current.style.animation = ''
          navLogoRef.current.style.opacity = ''
        }
      }

      if (scrollIndicatorRef.current) {
        // Fade out in the first 20vh of scrolling
        const scrollOpacity = Math.max(0, 1 - (currentY / (vh * 0.2)))
        scrollIndicatorRef.current.style.opacity = scrollOpacity
      }

      if (logoRef.current) {
        // Use high-performance clip-path instead of expensive CSS mask gradients
        const insetRight = 100 - (phase1_5 * 100)
        logoRef.current.style.clipPath = `inset(0 ${insetRight}% 0 0)`
        
        // During the first 100vh (phase2), logo moves to the top left (navbar position).
        // Calculate exact movement from center of screen to the navbar logo center
        const maxMoveX = logoTargetX - (vw / 2)
        const maxMoveY = logoTargetY - (vh / 2)
        
        const moveX = logoPhase * maxMoveX
        const moveY = logoPhase * maxMoveY
        const scale = 1 - (logoPhase * 0.8) // shrink to fit navbar
        
        // Let the image logo stay fully visible as it glides into the navbar position
        logoRef.current.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(${scale})`
        logoRef.current.style.opacity = 1
      }

      rafId = requestAnimationFrame(tick)
    }

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
      lenis.destroy()
      window.removeEventListener('resize',     updateHeight)
      window.removeEventListener('load',       updateHeight)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [currentPage])

  if (currentPage === 'packages') {
    return <PackagesPage navigateTo={navigateTo} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />;
  }

  if (currentPage === 'contact') {
    return <ContactPage navigateTo={navigateTo} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />;
  }

  return (
    <>
      {/* Preloader */}
      <div className={`preloader ${!isLoading ? 'fade-out' : ''}`}>
        <div className="preloader-logo">
          NERAM<span className="preloader-dot">.in</span>
        </div>
      </div>

      <div className="ui-container" ref={appRef}>

      <div ref={heroBgRef} className="hero-bg-wrapper">
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
            dpr={1}
            frameloop="always"
            gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
          >
            <Suspense fallback={null}>
              <FogOverlay isRain={isRain} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Layer 2 — fixed navbar */}
      <div className="ui-overlay">
        <nav className="navbar">
          <div className="logo" ref={navLogoRef} onClick={() => navigateTo('home')}>NERAM</div>
          <div className="nav-controls">
            <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>
              <span className="menu-text">menu</span>
              <div className="menu-lines">
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </nav>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator" ref={scrollIndicatorRef}>
          <span>SCROLL</span>
          <div className="scroll-line"></div>
        </div>
      </div>

      {/* Layer 2.5 — Centered logo revealed via scroll */}
      <img 
        ref={logoRef}
        src="/logo.png" 
        alt="Neram Logo" 
        className="center-logo"
        onClick={() => setIsRain(prev => !prev)}
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
      />

      {/* Dark section — JS slides this up only AFTER image is fully panned */}
      <div className="scroll-content" ref={contentRef}>
        
        {/* Phase 2: Philosophy Section */}
        <div className="philosophy-section">
          
          {/* Background Video - lazy loaded */}
          <div className="section-video-bg reveal-on-scroll">
            <img src="/nature4.jpg" alt="Fallback Background" className="video-fallback-bg" loading="lazy" />
            <iframe 
              title="vimeo-bg" 
              src="https://player.vimeo.com/video/156891323?h=078885103c&background=1#t=2s" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>

          {/* Decorative Images */}
          <div className="deco-gallery">
            <div className="deco-item img-1 reveal-on-scroll">
              <img src="/nature4.jpg" alt="Landscape" loading="lazy" />
            </div>
            <div className="deco-item img-2 reveal-on-scroll">
              <img src="/nature5.jpg" alt="Waterfall" loading="lazy" />
            </div>
            <div className="deco-item img-3 reveal-on-scroll">
              <img src="/nature3.jpg" alt="Nature" loading="lazy" />
            </div>
            <div className="deco-item img-4 reveal-on-scroll">
              <img src="/nature6.jpg" alt="Mountains" loading="lazy" />
            </div>
          </div>

          <div className="philosophy-inner">
            <h2 className="vertical-text">PHILOSOPHY</h2>
            <div className="philosophy-content">
              <h2>&ldquo;Nature is not a place to visit.<br/>It is home.&rdquo;</h2>
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
                <span className="text-green">NERAM</span>
              </h2>
              <p className="collage-description">
                <strong>Neram.in</strong> — More than just a trip—it’s a reset button for your mind. Camping, trekking, and outdoor journeys made for real connection.
                <br /><br />
                Turning every journey into an unforgettable experience.<br />
                Plan your next escape with us today.
              </p>
              
              <div className="horizontal-indicator-btn" onClick={() => navigateTo('packages')} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
                <span>PACKAGES</span>
                <div className="horizontal-indicator-line"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4: Company Section (Who we are) */}
        <div className="company-section">
          <div className="company-bg">
            <img src="/sp_home_company_img.webp" alt="Company Background" />
          </div>
          <div className="company-side-text reveal-on-scroll">COMPANY</div>
          <div className="company-content reveal-on-scroll">
            <h2>Who we are</h2>
            <div className="company-text">
              <p>
                In a world that never stops moving, true stillness has become a rare luxury. We believe that the deepest form of healing is found simply by returning to our roots—breathing the wild air, feeling the earth beneath our feet, and embracing the quiet rhythm of the wilderness.
              </p>
              <p>
                At Neram, we don't just guide journeys across untamed landscapes; we curate experiences where time slows down, genuine connections are forged, and your inner nature is finally free to unfold.
              </p>
            </div>
            <div className="horizontal-indicator-btn" onClick={() => navigateTo('contact')}>
              <span>CONTACT</span>
              <div className="horizontal-indicator-line"></div>
            </div>
          </div>
        </div>

        <Footer navigateTo={navigateTo} />

      </div>

      {/* Sidebar Menu */}
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} navigateTo={navigateTo} />

      {/* Video Modal Overlay */}
      {isVideoOpen && (
        <div className="video-modal-overlay" onClick={() => setIsVideoOpen(false)}>
          <button className="close-video-btn" onClick={() => setIsVideoOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="video-wrapper" onClick={(e) => e.stopPropagation()}>
            <iframe 
              ref={iframeRef}
              title="vimeo-player" 
              src="https://player.vimeo.com/video/156891323?h=078885103c&background=1&muted=0" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"   
              allowFullScreen
            ></iframe>
          </div>
          <img 
            src="/logo.png" 
            alt="NERAM Logo" 
            className="video-center-logo" 
            onClick={(e) => {
              e.stopPropagation();
              setIsVideoOpen(false);
              navigateTo('home');
            }} 
          />
        </div>
      )}

    </div>
    </>
  )
}
export default App
