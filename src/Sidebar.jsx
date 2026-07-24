import React from 'react';

export default function Sidebar({ isMenuOpen, setIsMenuOpen, navigateTo }) {
  return (
    <div className={`sidebar-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}>
      <div className={`sidebar-menu-content ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-sidebar-btn" onClick={() => setIsMenuOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="sidebar-links">
          <span className="sidebar-link" onClick={() => { setIsMenuOpen(false); navigateTo('home'); }}>Home</span>
          <span className="sidebar-link" onClick={() => { setIsMenuOpen(false); navigateTo('packages'); }}>Packages</span>
          <span className="sidebar-link" onClick={() => { setIsMenuOpen(false); navigateTo('images'); }}>Images</span>
          <span className="sidebar-link" onClick={() => { setIsMenuOpen(false); navigateTo('contact'); }}>Contact</span>
        </div>
      </div>
    </div>
  );
}
