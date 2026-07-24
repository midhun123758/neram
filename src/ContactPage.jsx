import { useEffect } from 'react';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function ContactPage({ navigateTo, isMenuOpen, setIsMenuOpen }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onBack = () => navigateTo('home');

  return (
    <div className="contact-page-container">
      
      {/* Navbar */}
      <nav className="packages-navbar">
        <div className="logo" onClick={onBack} style={{ cursor: 'pointer', opacity: 1, animation: 'none' }}>
          NERAM
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>
            <div className="menu-icon">
              <span></span>
              <span></span>
            </div>
            Menu
          </button>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} navigateTo={navigateTo} />

      {/* Main Content */}
      <main className="contact-main">
        <div className="contact-card">
          
          <h1 className="contact-title">
            Get in Touch
          </h1>
          <p className="contact-subtitle">
            Whether you have a question about our packages, want to plan a custom trip, or just want to say hello, we'd love to hear from you.
          </p>
          
          <div className="contact-info-grid">
            
            {/* Phone */}
            <a href="https://wa.me/919605700780" target="_blank" rel="noopener noreferrer" className="contact-item">
              <div className="contact-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <div className="contact-label">WhatsApp</div>
                <div className="contact-value">+91 96057 00780</div>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:neram.inn@gmail.com" className="contact-item">
              <div className="contact-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <div className="contact-label">Email</div>
                <div className="contact-value">neram.inn@gmail.com</div>
              </div>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/neram.in__?igsh=MTE5NnI0cmplejFyMw==" target="_blank" rel="noopener noreferrer" className="contact-item">
              <div className="contact-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <div>
                <div className="contact-label">Instagram</div>
                <div className="contact-value">@neram.in__</div>
              </div>
            </a>

          </div>
        </div>
      </main>

      <Footer navigateTo={navigateTo} />
      
      <style>{`
        .contact-item:hover {
          transform: translateY(-5px);
        }
        .contact-item:hover > div:first-child {
          background-color: rgba(201, 147, 57, 0.2) !important;
        }
      `}</style>
    </div>
  );
}
