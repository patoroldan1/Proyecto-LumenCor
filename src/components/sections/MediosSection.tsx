/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOCK_MEDIA } from '../../data/mockData.ts';
import {
  Tv,
  Play,
  FileText,
  Download,
  Mail,
  CheckCircle,
  ExternalLink,
  Radio,
  Newspaper,
  Video,
} from 'lucide-react';

export const MediosSection: React.FC = () => {
  const [pressFormSubmitted, setPressFormSubmitted] = useState(false);
  const [pressFormData, setPressFormData] = useState({
    journalistName: '',
    mediaOutlet: '',
    email: '',
    topic: '',
  });

  const handlePressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pressFormData.journalistName || !pressFormData.email) return;
    setPressFormSubmitted(true);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video':
      case 'documental':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'entrevista':
        return <Radio className="w-4 h-4 text-blue-500" />;
      default:
        return <Newspaper className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Hero Header */}
      <div className="relative bg-stone-900 text-stone-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1600&q=80"
            alt="Fondo Medios y Prensa"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest font-cinzel uppercase">
            <Tv className="w-3.5 h-3.5" />
            <span>Prensa y Comunicación Institucional</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Medios y Visibilidad Social
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Dar voz a quienes no la tienen en el espacio público. Coberturas periodísticas, informes especiales y documentales sobre la realidad de las personas en situación de calle.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Media Articles & Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_MEDIA.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-60 relative overflow-hidden group">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                  {item.videoDuration && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-amber-500/90 text-stone-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-stone-900/80 backdrop-blur-sm text-stone-200 text-xs px-3 py-1 rounded-full">
                    {getMediaIcon(item.type)}
                    <span className="capitalize font-medium">{item.type}</span>
                    {item.videoDuration && <span>• {item.videoDuration}</span>}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold text-amber-800">{item.outlet}</span>
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                <span className="text-xs font-semibold text-stone-500">Material de archivo público</span>
                <button
                  type="button"
                  onClick={() => alert(`Abriendo cobertura: "${item.title}" en nueva pestaña.`)}
                  className="flex items-center gap-1.5 text-xs font-cinzel uppercase font-semibold text-amber-800 hover:text-amber-900"
                >
                  <span>Ver Cobertura</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Press Kit & Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Media Kit Download */}
          <div className="lg:col-span-5 bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-cinzel text-xs uppercase tracking-wider font-semibold">
                <FileText className="w-4 h-4" />
                <span>Kit de Prensa Institucional 2026</span>
              </div>
              <h4 className="font-serif text-2xl font-bold text-white">
                Dossier para Periodistas y Productores
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Descargá fotografías de alta resolución en rondas de calle, logos vectoriales de la fundación, estadísticas auditadas y perfil biográfico de los voceros oficiales.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <button
                type="button"
                onClick={() => alert('Descargando kit de prensa institucional (PDF + Assets en ZIP)')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Press Kit Completo (18 MB)</span>
              </button>
              <p className="text-[11px] text-stone-500 text-center">
                Licencia de uso libre para notas de interés social y comunitario.
              </p>
            </div>
          </div>

          {/* Press Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            {pressFormSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-stone-900">
                  ¡Mensaje de Prensa Recibido!
                </h4>
                <p className="text-xs text-stone-600">
                  Nuestro equipo de comunicación institucional se comunicará con <span className="font-semibold text-stone-900">{pressFormData.journalistName}</span> ({pressFormData.mediaOutlet}) en menos de 2 horas hábiles.
                </p>
                <button
                  onClick={() => {
                    setPressFormSubmitted(false);
                    setPressFormData({ journalistName: '', mediaOutlet: '', email: '', topic: '' });
                  }}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-cinzel uppercase font-semibold"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handlePressSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-widest font-cinzel">
                  <Mail className="w-4 h-4" />
                  <span>Contacto para Medios y Entrevistas</span>
                </div>
                <h4 className="font-serif text-xl font-bold text-stone-900">
                  Coordinar Nota o Cobertura en Calle
                </h4>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Periodista / Productor *</label>
                      <input
                        type="text"
                        required
                        value={pressFormData.journalistName}
                        onChange={(e) => setPressFormData({ ...pressFormData, journalistName: e.target.value })}
                        placeholder="Ej. Paula Rossi"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Medio / Canal / Radio *</label>
                      <input
                        type="text"
                        required
                        value={pressFormData.mediaOutlet}
                        onChange={(e) => setPressFormData({ ...pressFormData, mediaOutlet: e.target.value })}
                        placeholder="Ej. Canal 13 / Radio con Vos"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Correo Electrónico de Contacto *</label>
                    <input
                      type="email"
                      required
                      value={pressFormData.email}
                      onChange={(e) => setPressFormData({ ...pressFormData, email: e.target.value })}
                      placeholder="prensa@medio.com"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Tema de la Nota o Entrevista</label>
                    <textarea
                      rows={3}
                      value={pressFormData.topic}
                      onChange={(e) => setPressFormData({ ...pressFormData, topic: e.target.value })}
                      placeholder="Describí brevemente el enfoque de la nota, fecha prevista y si precisás acompañar una ronda nocturna..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all shadow"
                  >
                    Enviar Solicitud a Prensa
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
