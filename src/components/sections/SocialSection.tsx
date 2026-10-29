/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MOCK_SOCIAL_PROGRAMS } from '../../data/mockData.ts';
import {
  Users,
  Clock,
  MapPin,
  Heart,
  Coffee,
  Sparkles,
} from 'lucide-react';

interface SocialSectionProps {
  onOpenVolunteerModal?: () => void;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ onOpenVolunteerModal }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <div className="relative bg-stone-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=2000"
            alt="Comunidad"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest font-cinzel uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>El Corazón de Nuestra Misión</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Acompañamiento y Dignidad en Situación de Calle
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Estar presentes donde nadie más llega. Salimos al encuentro de cada hermano con un plato caliente, una mirada cálida y la convicción de que nadie sobra en nuestra sociedad.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenVolunteerModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-cinzel font-semibold text-xs tracking-wider uppercase rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Sumarme como Voluntario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filosofía */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100/80 rounded-3xl p-8 border border-stone-200/60">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest font-cinzel">
              Nuestra Filosofía de Trabajo
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              No asistencialismo, sino encuentro fraterno
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Creemos que la comida y el abrigo son el puente para lo verdaderamente importante: reconstruir vínculos de confianza, recuperar la identidad y acompañar los procesos individuales hacia una vida con oportunidades y esperanza.
            </p>
          </div>
        </div>
      </div>

      {/* Grilla de Programas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest font-cinzel">
            Líneas de Acción
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Programas Activos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_SOCIAL_PROGRAMS.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="h-52 relative overflow-hidden">
                <img
                  src={program.imageUrl}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-stone-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[11px] font-medium tracking-wide">
                  {program.schedule}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {program.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <MapPin className="w-4 h-4 text-amber-600 flex-none" />
                    <span>{program.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Users className="w-4 h-4 text-amber-600 flex-none" />
                    <span>Coordinado por voluntarios</span>
                  </div>
                </div>

                <button
                  onClick={onOpenVolunteerModal}
                  className="w-full py-2.5 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Sumarme como Voluntario
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};