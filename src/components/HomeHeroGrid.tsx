import React from 'react';
import { SectionId } from '../types/index.ts';
import { SECTIONS_CONFIG } from '../data/mockData.ts';
import { Heart } from 'lucide-react';
import { LumenCorLogo } from './LumenCorLogo.tsx';

interface HomeHeroGridProps {
  onSelectSection: (section: SectionId) => void;
}

export const HomeHeroGrid: React.FC<HomeHeroGridProps> = ({
  onSelectSection,
}) => {
  return (
    <div className="h-screen h-dvh w-full flex flex-col bg-white overflow-hidden select-none">
      {/* Cabecera: Logo de LumenCor centrado, sin textos extras, con botón Donar */}
      <header className="h-16 sm:h-20 flex-none bg-white border-b border-stone-200/80 px-4 sm:px-8 relative flex items-center justify-between z-20 shadow-xs">
        {/* Espaciador izquierdo para centrar perfectamente el logo */}
        <div className="w-20 hidden sm:block" />

        {/* Centro: Logo oficial con isotipo y tipografía */}
        <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center">
          <LumenCorLogo size="md" />
        </div>

        {/* Derecha: Botón Donar */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => onSelectSection('donar')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-[#E30613] hover:bg-red-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer font-sans"
            aria-label="Ir a Donaciones"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Donar</span>
          </button>
        </div>
      </header>

      {/* Grilla 6 franjas en Mobile y 2x3 en Desktop con fotos idénticas y animaciones táctiles */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-6 md:grid-rows-3 w-full h-[calc(100dvh-56px)] sm:h-[calc(100dvh-64px)] overflow-hidden">
        {SECTIONS_CONFIG.map((section) => {
          return (
            <section
              key={section.id}
              className="relative w-full h-full overflow-hidden group cursor-pointer border-b md:border-b-stone-900/20 md:odd:border-r border-stone-900/30 select-none touch-manipulation"
              onClick={() => onSelectSection(section.id)}
            >
              {/* Imagen de fondo (usa la misma en desktop y mobile) */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <img
                  src={section.bgDesktop}
                  alt={section.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 group-active:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>

              {/* Degradado cinematográfico */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/40 group-hover:from-black/45 group-hover:via-black/15 group-active:from-black/45 transition-colors duration-500 pointer-events-none" />

              {/* Botón cápsula: Siempre negro/oscuro, con hover en PC y toque activo en celular */}
              <div className="absolute inset-0 flex items-center justify-center p-2 z-10 pointer-events-none">
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

              {/* Línea inferior roja animada en hover (PC) y touch (Celular) */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E30613] scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-500 origin-center pointer-events-none" />
            </section>
          );
        })}
      </main>
    </div>
  );
};