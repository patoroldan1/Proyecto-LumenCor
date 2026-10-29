/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SectionId } from '../types/index.ts';
import { SECTIONS_CONFIG } from '../data/mockData.ts';
import { Heart, Users } from 'lucide-react';

import { LumenCorLogo } from './LumenCorLogo.tsx';

interface HomeHeroGridProps {
  onSelectSection: (section: SectionId) => void;
  onOpenVolunteerModal?: () => void;
}

export const HomeHeroGrid: React.FC<HomeHeroGridProps> = ({
  onSelectSection,
  onOpenVolunteerModal,
}) => {
  return (
    <div className="h-screen h-[100dvh] w-full flex flex-col bg-white overflow-hidden select-none">
      {/* Header Bar */}
      <header className="h-14 sm:h-20 flex-none bg-white border-b border-stone-200/80 px-2.5 sm:px-8 relative flex items-center justify-between z-20 shadow-xs">
        <div className="w-12 sm:w-20 hidden md:block" />

        {/* Logo LumenCor */}
        <div className="flex-none md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-start md:justify-center">
          <div className="block sm:hidden">
            <LumenCorLogo size="sm" />
          </div>
          <div className="hidden sm:block">
            <LumenCorLogo size="md" />
          </div>
        </div>

        {/* Right: Volunteer CTA & Direct Donate Button */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-3 flex-none">
          {/* Botón Sumarme como Voluntario (abre modal directamente) */}
          <button
            onClick={onOpenVolunteerModal || (() => onSelectSection('social'))}
            className="flex items-center gap-1 text-[11px] sm:text-sm font-semibold bg-amber-500 hover:bg-amber-400 active:scale-95 active:bg-amber-400 text-stone-950 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer font-sans whitespace-nowrap touch-manipulation"
            aria-label="Sumarme como Voluntario"
          >
            <Users className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Sumarme como Voluntario</span>
            <span className="sm:hidden">Voluntario</span>
          </button>

          {/* Botón Donar */}
          <button
            onClick={() => onSelectSection('donar')}
            className="flex items-center gap-1 text-[11px] sm:text-sm font-semibold bg-[#E30613] hover:bg-red-700 active:scale-95 active:bg-red-800 text-white px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer font-sans whitespace-nowrap touch-manipulation"
            aria-label="Ir a Donaciones"
          >
            <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>Donar</span>
          </button>
        </div>
      </header>

      {/* Grilla de 6 tarjetas: entra exacta en el alto total de cualquier celular */}
      <main className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 grid-rows-6 md:grid-rows-3 w-full h-full overflow-hidden">
        {SECTIONS_CONFIG.map((section) => {
          return (
            <section
              key={section.id}
              className="relative w-full h-full overflow-hidden group cursor-pointer border-b md:border-b-stone-900/20 md:odd:border-r border-stone-900/30 select-none touch-manipulation"
              onClick={() => onSelectSection(section.id)}
            >
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <img
                  src={section.bgDesktop}
                  alt={section.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 group-active:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/40 group-hover:from-black/45 group-hover:via-black/15 group-active:from-black/45 transition-colors duration-500 pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
                <button
                  type="button"
                  aria-label={`Ingresar a la sección ${section.title}`}
                  className="
                    w-auto max-w-[85%] sm:max-w-none text-center
                    font-cinzel text-xs sm:text-sm md:text-base lg:text-lg
                    font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em]
                    px-6 sm:px-10 md:px-12 py-2 sm:py-3 md:py-3.5
                    rounded-full shadow-xl transition-all duration-300
                    cursor-pointer border-2
                    bg-stone-950/65 text-white border-white/80 backdrop-blur-md shadow-stone-950/60
                    group-hover:scale-105 group-hover:bg-stone-950/90 group-hover:text-white group-hover:border-[#E30613] group-hover:shadow-[0_0_25px_rgba(227,6,19,0.35)]
                    group-active:scale-95 group-active:bg-stone-950/90 group-active:border-[#E30613] group-active:shadow-[0_0_25px_rgba(227,6,19,0.5)]
                  "
                >
                  {section.title}
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E30613] scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-500 origin-center pointer-events-none" />
            </section>
          );
        })}
      </main>
    </div>
  );
};