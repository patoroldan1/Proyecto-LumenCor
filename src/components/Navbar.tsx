/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SectionId } from '../types/index.ts';
import { SECTIONS_CONFIG } from '../data/mockData.ts';
import {
  Home,
  Heart,
  Menu,
  X,
  ChevronRight,
  BookOpen,
  Compass,
  Palette,
  Users,
  Tv,
} from 'lucide-react';

import { LumenCorLogo } from './LumenCorLogo.tsx';

interface NavbarProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  onOpenVolunteerModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  onOpenVolunteerModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getSectionIcon = (id: SectionId) => {
    switch (id) {
      case 'social':
        return <Users className="w-4 h-4" />;
      case 'editorial':
        return <BookOpen className="w-4 h-4" />;
      case 'viajes':
        return <Compass className="w-4 h-4" />;
      case 'arte':
        return <Palette className="w-4 h-4" />;
      case 'donar':
        return <Heart className="w-4 h-4" />;
      case 'medios':
        return <Tv className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  const handleNavClick = (id: SectionId) => {
    onSelectSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Izquierda: Botón Volver a HOME y Logo de la Fundación */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-1.5 group px-2 sm:px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-red-600/20 active:scale-95 text-stone-300 hover:text-red-300 border border-stone-700/60 transition-all duration-200 cursor-pointer touch-manipulation flex-none"
            title="Volver a HOME"
          >
            <Home className="w-4 h-4 text-[#E30613] group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-cinzel text-xs font-semibold tracking-wider">HOME</span>
          </button>

          <div className="h-5 w-[1px] bg-stone-700 flex-none" />

          <button
            onClick={() => handleNavClick('home')}
            className="text-left focus:outline-none cursor-pointer flex items-center"
            title="Fundación LumenCor - Inicio"
          >
            <LumenCorLogo variant="light" size="sm" />
          </button>
        </div>

        {/* Centro: Botones en Escritorio */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {(['social', 'editorial', 'viajes', 'arte', 'medios'] as SectionId[]).map((id) => {
            const sec = SECTIONS_CONFIG.find((s) => s.id === id);
            if (!sec) return null;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleNavClick(sec.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel font-medium tracking-widest uppercase transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-sm font-semibold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                  }
                `}
              >
                {getSectionIcon(sec.id)}
                <span>{sec.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Derecha: Botones SUMATE, Donar y Menú Hamburguesa */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-none">
          {/* Botón SUMATE (en tablets y desktop) */}
          <button
            onClick={onOpenVolunteerModal || (() => handleNavClick('social'))}
            className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-400 active:scale-95 active:bg-amber-500 text-stone-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer font-sans whitespace-nowrap touch-manipulation"
            aria-label="SUMATE"
          >
            <Users className="w-3.5 h-3.5 animate-pulse" />
            <span>SUMATE</span>
          </button>

          {/* Botón Donar */}
          <button
            onClick={() => handleNavClick('donar')}
            className={`flex items-center gap-1 text-xs sm:text-sm font-semibold bg-[#E30613] hover:bg-red-700 active:scale-95 active:bg-red-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer font-sans whitespace-nowrap touch-manipulation ${
              activeSection === 'donar' ? 'ring-2 ring-red-400' : ''
            }`}
            aria-label="Donar"
          >
            <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>Donar</span>
          </button>

          {/* Botón Menú Hamburguesa en Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-200 hover:text-white active:scale-90 bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 focus:outline-none cursor-pointer flex-none flex items-center justify-center ml-0.5 transition-transform touch-manipulation"
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {(['social', 'editorial', 'viajes', 'arte', 'medios'] as SectionId[]).map((id) => {
              const sec = SECTIONS_CONFIG.find((s) => s.id === id);
              if (!sec) return null;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleNavClick(sec.id)}
                  className={`
                    flex items-center justify-between p-3 rounded-xl text-left transition-all active:scale-95 cursor-pointer touch-manipulation
                    ${
                      isActive
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold'
                        : 'bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">{getSectionIcon(sec.id)}</span>
                    <span className="font-cinzel text-xs tracking-wider uppercase font-medium">
                      {sec.title}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                </button>
              );
            })}
          </div>

          {/* Botón SUMATE en drawer mobile */}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenVolunteerModal) onOpenVolunteerModal();
                else handleNavClick('social');
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 active:bg-amber-400 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer touch-manipulation"
              aria-label="SUMATE"
            >
              <Users className="w-4 h-4 animate-pulse" />
              <span>SUMATE</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};