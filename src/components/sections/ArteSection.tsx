/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Artwork } from '../../types/index.ts';
import { MOCK_ARTWORKS } from '../../data/mockData.ts';
import { Palette, Sparkles, Heart, Eye, CheckCircle, X, Brush, Music, Compass } from 'lucide-react';

export const ArteSection: React.FC = () => {
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);
  const [artInquirySuccess, setArtInquirySuccess] = useState(false);
  const [artInquiryData, setArtInquiryData] = useState({ name: '', email: '', message: '' });

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artInquiryData.name || !artInquiryData.email) return;
    setArtInquirySuccess(true);
  };

  const closeArtModal = () => {
    setSelectedArt(null);
    setArtInquirySuccess(false);
    setArtInquiryData({ name: '', email: '', message: '' });
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


      {/* Workshop categories cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
              <Brush className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">Pintura y Dibujo</h3>
              <p className="text-xs text-stone-600 mt-1">Acuarela, óleo y muralismo comunitario para recuperar la expresión propia.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">Música Popular y Canto</h3>
              <p className="text-xs text-stone-600 mt-1">Clases de guitarra criolla, coro y ensamble instrumental los fines de semana.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900">Oficios y Luthería</h3>
              <p className="text-xs text-stone-600 mt-1">Encuadernación artesanal y restauración con salida laboral concreta.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Art Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Galería de Obras y Creaciones
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Cada obra tiene detrás una historia de superación. Los fondos por la adquisición van íntegramente al autor y al fondo de materiales del taller.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_ARTWORKS.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              onClick={() => setSelectedArt(art)}
            >
              <div>
                <div className="h-64 bg-stone-100 relative overflow-hidden">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow ${
                        art.available
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-stone-900/80 text-stone-300'
                      }`}
                    >
                      {art.available ? 'Disponible' : 'Colección / Vendida'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-semibold text-amber-700 tracking-wider block font-cinzel">
                    {art.artistName}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {art.technique} • {art.dimensions}
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-1">
                    {art.artistStory}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Valor Solidario</span>
                  <span className="font-serif text-lg font-bold text-stone-900">
                    ${art.price.toLocaleString('es-AR')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArt(art);
                  }}
                  className="p-2 text-stone-600 hover:text-white hover:bg-stone-900 rounded-xl transition-all"
                  aria-label="Ver obra ampliada y su historia"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Art Modal */}
      {selectedArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
            <button
              onClick={closeArtModal}
              className="absolute top-4 right-4 z-10 p-2 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full bg-stone-100">
                <img
                  src={selectedArt.imageUrl}
                  alt={selectedArt.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                {artInquirySuccess ? (
                  <div className="text-center py-8 space-y-3">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="font-serif text-xl font-bold text-stone-900">
                      ¡Consulta Enviada!
                    </h4>
                    <p className="text-xs text-stone-600">
                      Nos pondremos en contacto contigo a la brevedad para coordinar la entrega o visita al taller del autor.
                    </p>
                    <button
                      onClick={closeArtModal}
                      className="px-6 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl font-cinzel"
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase font-cinzel">
                        Obra de {selectedArt.artistName}
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
                        {selectedArt.title}
                      </h3>
                      <div className="text-xs text-stone-500 space-y-0.5">
                        <p><span className="text-stone-400">Técnica:</span> {selectedArt.technique}</p>
                        <p><span className="text-stone-400">Medidas:</span> {selectedArt.dimensions}</p>
                        <p><span className="text-stone-400">Año:</span> {selectedArt.year}</p>
                      </div>

                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-stone-700 leading-relaxed">
                        <span className="font-bold text-amber-900 block text-[11px] mb-1">Historia del Autor:</span>
                        {selectedArt.artistStory}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-stone-500">Valor Solidario:</span>
                        <span className="font-serif text-2xl font-bold text-stone-900">
                          ${selectedArt.price.toLocaleString('es-AR')}
                        </span>
                      </div>

                      <form onSubmit={handleInquiry} className="space-y-2">
                        <input
                          type="text"
                          required
                          placeholder="Tu Nombre"
                          value={artInquiryData.name}
                          onChange={(e) => setArtInquiryData({ ...artInquiryData, name: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Tu Correo Electrónico"
                          value={artInquiryData.email}
                          onChange={(e) => setArtInquiryData({ ...artInquiryData, email: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all"
                        >
                          Adquirir o Consultar por esta Obra
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
