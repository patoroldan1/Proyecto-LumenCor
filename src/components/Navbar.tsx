/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LumenCorLogo } from './LumenCorLogo.tsx';
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

interface NavbarProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand + Quick Back to Home */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-red-600/20 text-stone-300 hover:text-red-300 border border-stone-700/60 transition-all cursor-pointer"
            title="Volver a la pantalla principal (HOME)"
            aria-label="Volver a la pantalla principal"
          >
            {/* Ícono de la casita en el rojo oficial de LumenCor */}
            <Home className="w-4 h-4 text-[#E30613] group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-cinzel text-xs font-semibold tracking-wider">HOME</span>
          </button>

          <div className="hidden sm:block h-5 w-[1px] bg-stone-700" />

          {/* Logo oficial de LumenCor en tamaño pequeño y versión clara */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left hidden sm:block focus:outline-none cursor-pointer"
          >
            <LumenCorLogo variant="light" size="sm" />
          </button>
        </div>

        {/* Center: Desktop Navigation Buttons */}
        {/* Centro: Botones de navegación (Social, Editorial, Viajes, Arte, Medios) */}
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

        {/* Derecha: Botón Donar rosa y a su derecha el Carrito */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Único botón de Donar (el rosa/rojo destacado) */}
          <button
            onClick={() => handleNavClick('donar')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-xs font-cinzel tracking-wider uppercase font-semibold transition-all shadow cursor-pointer
              ${
                activeSection === 'donar'
                  ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                  : 'bg-rose-600/90 hover:bg-rose-600 text-white hover:shadow-rose-900/40 hover:scale-105'
              }
            `}
          >
            <Heart className="w-4 h-4 fill-current animate-pulse" />
            <span>Donar</span>
          </button>

          

          {/* Menú hamburguesa para celulares */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 focus:outline-none"
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-6 space-y-2 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest font-cinzel">
              Navegar a otra sección:
            </span>
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-1 text-xs text-amber-400 font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Volver a HOME</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {SECTIONS_CONFIG.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleNavClick(sec.id)}
                  className={`
                    flex items-center justify-between p-3 rounded-xl text-left transition-all
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

          <div className="pt-3">
            <button
              onClick={() => handleNavClick('donar')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-cinzel font-semibold text-sm tracking-wider uppercase shadow-lg"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Hacer una Donación</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
