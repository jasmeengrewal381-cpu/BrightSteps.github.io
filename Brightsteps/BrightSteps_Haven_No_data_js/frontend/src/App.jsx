
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import ParentAuthPopup from './components/ParentAuthPopup';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Activities from './pages/Activities';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';
import Facilities from './pages/Facilities';
import HospitalCare from './pages/HospitalCare';
import ResidentialCare from './pages/ResidentialCare';
import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function NotFound() {
  return (
    <main className="not-found container">
      <span className="eyebrow">Page not found</span>
      <h1>Let’s find the right path.</h1>
      <p>The page you’re looking for may have moved.</p>
      <a href="/" className="button">Back to home</a>
    </main>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />

      {location.pathname !== '/admin' && <ParentAuthPopup />}

      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/hospital-care" element={<HospitalCare />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/residential-care" element={<ResidentialCare />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/team" element={<Team />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {location.pathname !== '/admin' && <Footer />}
    </>
  );
}
