/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Artwork } from '../../types/index.ts';
import { MOCK_ARTWORKS } from '../../data/mockData.ts';
import { Palette, Sparkles, Heart, Eye, CheckCircle, X, Brush, Music, Compass } from 'lucide-react';
import { SectionCtaBanner } from '../SectionCtaBanner.tsx';
import { UniversalFormModal } from '../UniversalFormModal.tsx';

export const ArteSection: React.FC = () => {
  const [selectedArtForDetail, setSelectedArtForDetail] = useState<Artwork | null>(null);
  const [isArtModalOpen, setIsArtModalOpen] = useState(false);
  const [selectedArtTitle, setSelectedArtTitle] = useState('');

  // Función que abre el modal (puede ser general o sobre una obra específica)
  const handleOpenArtInquiry = (artTitle: string = '') => {
    setSelectedArtTitle(artTitle);
    setIsArtModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Hero Header */}
      <div className="relative bg-stone-900 text-stone-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img
            src="/assets/images/mujer_pintando.jpg"
            alt="Mujer pintando en taller de arte"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest font-cinzel uppercase">
            <Palette className="w-3.5 h-3.5" />
            <span>Talleres de Arte e Inclusión Social</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            El Arte como Puente hacia la Dignidad
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            A través del pincel, la arcilla y las cuerdas de una guitarra, las personas que asisten a nuestros hogares redescubren sus talentos, sanan heridas y expresan su mundo interior.
          </p>
        </div>
      </div>

      
      {/* Galería de Obras */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest font-cinzel">
            Galería Solidaria
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Obras Realizadas en Nuestros Hogares
          </h2>
          <p className="text-xs text-stone-500 mt-2 font-light">
            Cada obra refleja una historia de superación. Al colaborar adquiriendo una pieza, financiás los materiales del taller y apoyás directamente a sus autores.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_ARTWORKS.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div
                  onClick={() => setSelectedArtForDetail(art)}
                  className="h-72 bg-stone-100 relative overflow-hidden cursor-pointer"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 bg-white text-stone-900 rounded-full shadow-lg">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white text-[11px] px-2.5 py-0.5 rounded-full">
                    {art.technique}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3
                    onClick={() => setSelectedArtForDetail(art)}
                    className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">Por {art.artist} ({art.year})</p>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-medium block">Contribución sugerida</span>
                  <span className="font-serif text-lg font-bold text-stone-900">
                    ${art.price.toLocaleString('es-AR')}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenArtInquiry(art.title)}
                  className="px-4 py-2 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                >
                  Consultar Obra
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Plantilla: SectionCtaBanner para Arte */}
      <SectionCtaBanner
        badgeText="Cultura y Talleres Solidarios"
        badgeIcon={<Palette className="w-3.5 h-3.5" />}
        title="¿Sos artista o querés colaborar con los talleres de arte?"
        description="Sumate como tallerista voluntario o coordiná una donación de insumos de pintura, dibujo y cerámica para los hogares de LumenCor."
        buttonText="Participar en Arte"
        buttonIcon={<Palette className="w-4 h-4" />}
        onAction={() => handleOpenArtInquiry('')}
      />

      {/* Modal Universal para Arte (Solo pide Nombre, Email y Teléfono) */}
      <UniversalFormModal
        isOpen={isArtModalOpen}
        onClose={() => setIsArtModalOpen(false)}
        seccion="arte"
        badgeText="Arte LumenCor"
        badgeIcon={<Palette className="w-3.5 h-3.5" />}
        title={selectedArtTitle ? `Consulta sobre: ${selectedArtTitle}` : "Sumarme al Área de Arte"}
        submitButtonText="Enviar Mensaje"
        successTitle="¡Mensaje Recibido!"
        successDescription={({ name, phone, email }) =>
          `Muchas gracias, ${name}. El equipo del Taller de Arte de LumenCor se comunicará con vos al ${phone || email} para coordinar la consulta.`
        }
      />

      {/* Modal de Detalle de Obra (para ver la imagen grande) */}
      {selectedArtForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
            <button
              onClick={() => setSelectedArtForDetail(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full bg-stone-100 relative">
                <img
                  src={selectedArtForDetail.imageUrl}
                  alt={selectedArtForDetail.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest font-cinzel">
                    {selectedArtForDetail.technique}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    {selectedArtForDetail.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">Autor: {selectedArtForDetail.artist} ({selectedArtForDetail.year})</p>
                  <p className="text-sm text-stone-700 leading-relaxed pt-2">
                    {selectedArtForDetail.description}
                  </p>
                  <p className="text-xs text-stone-400">Dimensiones: {selectedArtForDetail.dimensions}</p>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 block uppercase">Contribución</span>
                    <span className="font-serif text-2xl font-bold text-stone-900">
                      ${selectedArtForDetail.price.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const title = selectedArtForDetail.title;
                      setSelectedArtForDetail(null);
                      handleOpenArtInquiry(title);
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Consultar Obra
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};