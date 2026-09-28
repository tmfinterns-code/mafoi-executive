import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutRole from './components/AboutRole';
import WhyJoin from './components/WhyJoin';
import ApplicationForm from './components/ApplicationForm';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Global Keyboard Shortcut: Ctrl + Shift + M (or Cmd + Shift + M on macOS)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-white position-relative">
      <Navbar />
      <main className="flex-grow-1">
        <Hero />
        <AboutRole />
        <WhyJoin />
        <ApplicationForm />
      </main>
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Panel Modal triggered by Ctrl + Shift + M */}
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}

