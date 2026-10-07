import React, { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { LanguageCode, NavSection } from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  t: UITranslations;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  language,
  onLanguageChange,
  t,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'journey', label: t.nav.myJourney },
    { id: 'recovery', label: t.nav.recovery },
    { id: 'whatif', label: t.nav.whatIf },
    { id: 'howitworks', label: t.nav.howItWorks },
    { id: 'dashboard', label: t.nav.dashboard },
  ];

  const handleNavClick = (section: NavSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050914]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-white hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
        >
          {t.nav.brand}
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded ${
                  isActive
                    ? 'text-cyan-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-cyan-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Selector + Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center">
            <Globe
              className="w-4 h-4 text-cyan-400 absolute left-2.5 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="language-selector" className="sr-only">
              {t.preferences.language}
            </label>
            <select
              id="language-selector"
              aria-label="Select Language"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="pl-8 pr-6 py-1.5 text-xs font-medium bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-lg hover:border-cyan-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('recovery')}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {t.nav.startRecovery}
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg border border-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden bg-[#080E1E] border-b border-slate-800 px-4 py-3 space-y-1"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
