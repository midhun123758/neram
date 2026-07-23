import { useEffect } from 'react';
import Footer from './Footer';

export default function ContactPage({ navigateTo }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onBack = () => navigateTo('home');

  return (
    <div className="contact-page-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#050806' }}>
      
      {/* Navbar */}
      <nav className="packages-navbar">
        <div className="logo" onClick={onBack} style={{ cursor: 'pointer', opacity: 1, animation: 'none' }}>
          NERAM
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button className="back-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="contact-main" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
        <div className="contact-card" style={{ 
          maxWidth: '800px', 
          width: '100%', 
          backgroundColor: '#0a0d0b', 
          padding: '4rem', 
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '3rem', fontWeight: 400, color: '#fff', marginBottom: '1rem' }}>
            Get in Touch
          </h1>
          <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', maxWidth: '500px', lineHeight: 1.6 }}>
            Whether you have a question about our packages, want to plan a custom trip, or just want to say hello, we'd love to hear from you.
          </p>
          
          <div className="contact-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%' }}>
            
            {/* Phone */}
            <a href="https://wa.me/919605700780" target="_blank" rel="noopener noreferrer" className="contact-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: '#fff', transition: 'transform 0.3s' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(201, 147, 57, 0.1)', color: '#c99339', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>WhatsApp</div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '1.2rem', fontWeight: 500 }}>+91 96057 00780</div>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:neram.inn@gmail.com" className="contact-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: '#fff', transition: 'transform 0.3s' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(201, 147, 57, 0.1)', color: '#c99339', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Email</div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '1.2rem', fontWeight: 500 }}>neram.inn@gmail.com</div>
              </div>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/neram.in__?igsh=MTE5NnI0cmplejFyMw==" target="_blank" rel="noopener noreferrer" className="contact-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: '#fff', transition: 'transform 0.3s' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(201, 147, 57, 0.1)', color: '#c99339', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>Instagram</div>
                <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '1.2rem', fontWeight: 500 }}>@neram.in__</div>
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
