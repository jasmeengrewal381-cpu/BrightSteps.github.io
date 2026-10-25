
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';


const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Hospital Care', '/hospital-care'],
  ['Development & Therapy', '/services'],
  [' Facilities', '/facilities'],
  ['Residential Care', '/residential-care'],
  ['Activities', '/activities'],
  ['Our Team', '/team'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact']
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>Care that sees the child, not just the diagnosis.</span>
          <span className="topbar-right">+91 98765 43210 | Mon–Sat, 9 AM–6 PM</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-wrap">
          <Link className="brand" to="/" aria-label="BrightSteps home">
            <span className="brand-mark">BS</span>
            <span className="brand-copy">
              <strong>brightsteps</strong>
              <small>HOSPITAL & DEVELOPMENT CENTRE</small>
            </span>
          </Link>

          <button
            className="mobile-toggle"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
          >
            {menuOpen ? 'Close menu' : 'Menu'}
          </button>

          <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'}>
            {links.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                {label}
              </NavLink>
            ))}
            <Link className="button button-small nav-cta" to="/appointment">
              Book a visit
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link className="brand" to="/">
            <span className="brand-mark">BS</span>
            <span className="brand-copy">
              <strong>brightsteps</strong>
              <small>HOSPITAL & DEVELOPMENT CENTRE</small>
            </span>
          </Link>
          <p>Every child has a way to grow. We help families discover it, one small step at a time.</p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            {links.slice(1, 6).map(([label, path]) => (
              <li key={path}><Link to={path}>{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Get in touch</h4>
          <ul className="footer-contact">
            <li>Your centre address, City, India</li>
            <li>+91 98765 43210</li>
            <li>hello@brightsteps.example</li>
          </ul>
          <p className="footer-note">Please call to confirm appointment availability.</p>
        </div>

        <div className="footer-cta">
          <span className="eyebrow">A good first step</span>
          <h3>Let’s find the right support for your child.</h3>
          <Link to="/appointment" className="button">Plan a first visit</Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BrightSteps Haven Hospital & Development Centre</span>
        <span>Made with care for every kind of growth</span>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, text, image, imageAlt }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-grid">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
        {image && (
          <div className="page-hero-image">
            <img src={image} alt={imageAlt || 'Child-centred care and developmental support'} />
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, text, center = false }) {
  return (
    <div className={`section-heading ${center ? 'center' : ''}`}>
      <span className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
