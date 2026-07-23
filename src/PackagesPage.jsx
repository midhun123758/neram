import React, { useEffect } from 'react';
import Footer from './Footer';

const packagesData = [
  {
    id: 1,
    title: 'Camps',
    category: 'CAMP',
    location: 'VARIOUS LOCATIONS',
    duration: '2 DAYS / 1 NIGHT',
    description: 'Immerse yourself in the tranquility of nature with our bespoke camping experiences. Enjoy starry nights and warm bonfires.',
    image: '/pkg_camps.jpg'
  },
  {
    id: 2,
    title: 'Tours',
    category: 'TOUR',
    location: 'TROPICAL FORESTS',
    duration: '4 DAYS / 3 NIGHTS',
    description: 'Discover hidden gems and breathtaking landscapes with our guided tours through lush environments.',
    image: '/user_image2.jpg'
  },
  {
    id: 3,
    title: 'Treks',
    category: 'TREK',
    location: 'MOUNTAIN PEAKS',
    duration: '5 DAYS / 4 NIGHTS',
    description: 'Challenge yourself and reach new heights. Our curated trekking routes take you through dramatic mountain peaks.',
    image: '/user_image3.jpg'
  },
  {
    id: 4,
    title: 'Group Trips',
    category: 'GROUP',
    location: 'SCENIC RIDGES',
    duration: '3 DAYS / 2 NIGHTS',
    description: 'Share the adventure. Our group trips are designed to foster connection and create lifelong memories.',
    image: '/user_image4.jpg'
  },
  {
    id: 5,
    title: 'Custom Travel Plans',
    category: 'CUSTOM',
    location: 'WORLDWIDE',
    duration: 'FLEXIBLE',
    description: 'Your dream journey, tailored perfectly to you. Let us craft a bespoke itinerary that matches your unique pace.',
    image: '/user_image1.png'
  }
]

export default function PackagesPage({ navigateTo }) {
  // Ensure the window scrolls to top when this page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onBack = () => navigateTo('home');

  return (
    <div className="packages-page-container">
      
      {/* Custom Navbar just for this page */}
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

      {/* Hero Section */}
      <header className="packages-hero">
        <div className="packages-hero-bg">
          <img src="/nature4.jpg" alt="Packages Hero" />
          <div className="packages-hero-overlay"></div>
        </div>
        <div className="packages-hero-content">
          <h1 className="packages-page-title">Curated Experiences</h1>
          <p className="packages-page-subtitle">Find your perfect escape into nature.</p>
        </div>
      </header>

      {/* Packages Grid */}
      <main className="packages-main-content">
        <div className="packages-grid">
          {packagesData.map((pkg) => (
            <article key={pkg.id} className="package-card">
              <div className="package-card-img-wrapper">
                <img src={pkg.image} alt={pkg.title} className="package-card-bg" />
              </div>
              <div className="package-card-content">
                <div className="package-card-meta">
                  <span className="package-card-location">{pkg.category} &middot; {pkg.location}</span>
                </div>
                <h3 className="package-card-title">{pkg.title}</h3>
                <p className="package-card-desc">{pkg.description}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer navigateTo={navigateTo} />
    </div>
  )
}
