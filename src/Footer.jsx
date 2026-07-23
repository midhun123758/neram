export default function Footer({ navigateTo }) {
  return (
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
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('packages'); }}>All Packages</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-col reach-col">
            <h4 className="footer-heading">REACH US</h4>
            <ul>
              <li>
                <a href="https://wa.me/919605700780" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  +91 96057 00780
                </a>
              </li>
              <li>
                <a href="mailto:neram.inn@gmail.com">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  neram.inn@gmail.com
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/neram.in__?igsh=MTE5NnI0cmplejFyMw==" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  @neram.in__
                </a>
              </li>
            </ul>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
