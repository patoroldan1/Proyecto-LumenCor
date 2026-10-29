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
  ExternalLink,
  Radio,
  Newspaper,
  Video,
} from 'lucide-react';
import { SectionCtaBanner } from '../SectionCtaBanner.tsx';
import { UniversalFormModal } from '../UniversalFormModal.tsx';

export const MediosSection: React.FC = () => {
  // Estado simple para controlar si el modal está abierto o cerrado
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);

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
            <span>Prensa, Testimonios y Comunicación</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            La Realidad de la Calle en Primera Persona
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Historias que rompen la indiferencia. Notas periodísticas, entrevistas radiales y documentales que visibilizan el trabajo silencioso por los más vulnerables.
          </p>
        </div>
      </div>


      {/* Grilla de Notas y Coberturas en Medios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-8">
        <div>
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest font-cinzel">
            Apariciones en Medios
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Coberturas y Entrevistas Destacadas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_MEDIA.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-52 relative overflow-hidden group">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                    {getMediaIcon(item.type)}
                    <span className="capitalize">{item.type}</span>
                  </div>
                  {item.duration && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      {item.duration}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-semibold text-amber-800 uppercase">{item.outlet}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between mt-4">
                <span className="text-xs text-stone-400 font-medium">Cobertura pública</span>
                <a
                  href={item.linkUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-amber-600 group transition-colors"
                >
                  <span>Ver Nota</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Plantilla: SectionCtaBanner para Medios */}
      <SectionCtaBanner
        badgeText="Prensa y Relaciones Institucionales"
        badgeIcon={<Tv className="w-3.5 h-3.5" />}
        title="¿Sos periodista o querés coordinar una nota con la fundación?"
        description="Brindamos información de primera mano sobre la realidad de la calle, gacetillas, testimonios y coordinamos entrevistas con voceros de LumenCor."
        buttonText="Contacto de Prensa"
        buttonIcon={<Tv className="w-4 h-4" />}
        onAction={() => setIsPressModalOpen(true)}
      />

      {/* Modal Universal para Prensa (Solo pide Nombre, Email y Teléfono) */}
      <UniversalFormModal
        isOpen={isPressModalOpen}
        onClose={() => setIsPressModalOpen(false)}
        seccion="medios"
        badgeText="Prensa LumenCor"
        badgeIcon={<Tv className="w-3.5 h-3.5" />}
        title="Contacto para Medios y Prensa"
        submitButtonText="Enviar Consulta"
        successTitle="¡Solicitud de Prensa Recibida!"
        successDescription={({ name, phone, email }) =>
          `Muchas gracias, ${name}. El equipo de comunicación institucional de LumenCor se comunicará con vos al ${phone || email} a la brevedad.`
        }
      />
    </div>
  );
};