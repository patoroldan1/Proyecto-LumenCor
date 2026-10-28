/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOCK_SOCIAL_PROGRAMS } from '../../data/mockData.ts';
import {
  Users,
  Clock,
  MapPin,
  Heart,
  CheckCircle,
  AlertCircle,
  PhoneCall,
  Coffee,
  Sparkles,
} from 'lucide-react';

export const SocialSection: React.FC = () => {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    availability: 'Noches de semana',
    programPreference: 'Rondas Nocturnas (Viandas)',
    experience: '',
  });

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerForm.name || !volunteerForm.email) return;
    setVolunteerSubmitted(true);
  };

  const resetVolunteerModal = () => {
    setShowVolunteerModal(false);
    setVolunteerSubmitted(false);
    setVolunteerForm({
      name: '',
      email: '',
      phone: '',
      availability: 'Noches de semana',
      programPreference: 'Rondas Nocturnas (Viandas)',
      experience: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Hero Banner */}
      <div className="relative bg-stone-900 text-stone-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
            alt="Acción Social en la Calle"
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
              onClick={() => setShowVolunteerModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-cinzel font-semibold text-xs tracking-wider uppercase rounded-full shadow-lg transition-all"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Sumarme como Voluntario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Impact Indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-md">
          <div className="text-center p-3">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 block">1.200</span>
            <span className="text-xs text-stone-500 font-medium">Viandas calientes por semana</span>
          </div>
          <div className="text-center p-3 border-l border-stone-100">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 block">350</span>
            <span className="text-xs text-stone-500 font-medium">Duchas y cambios de ropa</span>
          </div>
          <div className="text-center p-3 border-l border-stone-100">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 block">180+</span>
            <span className="text-xs text-stone-500 font-medium">Voluntarios activos en rondas</span>
          </div>
          <div className="text-center p-3 border-l border-stone-100">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 block">365</span>
            <span className="text-xs text-stone-500 font-medium">Noches al año sin interrupción</span>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Nuestros Cuatro Ejes de Acción
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Un abordaje integral que va desde la urgencia alimentaria hasta el acompañamiento en salud mental y reinserción.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_SOCIAL_PROGRAMS.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-52 relative overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-amber-300 text-xs px-3 py-1 rounded-full font-semibold border border-white/10">
                    {program.impactMetric} {program.impactLabel}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase font-cinzel">
                    {program.subtitle}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {program.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {program.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>{program.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span>{program.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setVolunteerForm((prev) => ({ ...prev, programPreference: program.title }));
                    setShowVolunteerModal(true);
                  }}
                  className="w-full py-2.5 rounded-xl border border-stone-300 hover:border-amber-600 text-stone-800 hover:text-amber-800 hover:bg-amber-50/50 font-cinzel text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  Sumarme a este Programa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Alert Hotline info */}
        <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 text-stone-950 rounded-2xl">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-stone-900">
                ¿Viste a alguien durmiendo en la calle con frío o descompensado?
              </h4>
              <p className="text-xs text-stone-600">
                Línea Social gratuita las 24 horas: comunicate al 108 (CABA) o enviá un WhatsApp a nuestra guardia nocturna.
              </p>
            </div>
          </div>
          <a
            href="tel:108"
            className="flex-none px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-cinzel text-xs font-semibold uppercase tracking-wider rounded-xl"
          >
            Llamar al 108
          </a>
        </div>
      </div>

      {/* Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-stone-200">
            {volunteerSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  ¡Gracias por querer transformar realidades!
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Recibimos tus datos, <span className="font-semibold text-stone-900">{volunteerForm.name}</span>. Te invitamos a la próxima reunión de bienvenida y capacitación que realizamos todos los sábados a las 11:00 hs en la sede central.
                </p>
                <button
                  onClick={resetVolunteerModal}
                  className="w-full py-3 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-widest block font-cinzel">
                    Convocatoria Abierta
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Sumate al Equipo de Voluntarios
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    No necesitás experiencia previa, solo ganas de compartir tiempo y afecto.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      value={volunteerForm.name}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, name: e.target.value })}
                      placeholder="Ej. Lucas Gómez"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={volunteerForm.email}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">WhatsApp / Teléfono *</label>
                      <input
                        type="tel"
                        required
                        value={volunteerForm.phone}
                        onChange={(e) => setVolunteerForm({ ...volunteerForm, phone: e.target.value })}
                        placeholder="+54 9 11 ..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Área o Programa de Interés</label>
                    <select
                      value={volunteerForm.programPreference}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, programPreference: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      <option value="Rondas Nocturnas (Viandas)">Rondas Nocturnas (Viandas)</option>
                      <option value="Duchas Solidarias y Ropero">Duchas Solidarias y Ropero</option>
                      <option value="Talleres de Arte y Música">Talleres de Arte y Música</option>
                      <option value="Apoyo Legal y DNI">Apoyo Legal y DNI</option>
                      <option value="Cocina Comunitaria y Logística">Cocina Comunitaria y Logística</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Disponibilidad Horaria</label>
                    <select
                      value={volunteerForm.availability}
                      onChange={(e) => setVolunteerForm({ ...volunteerForm, availability: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      <option value="Noches de semana (19:30 a 23:30)">Noches de semana (19:30 a 23:30)</option>
                      <option value="Sábados por la mañana">Sábados por la mañana</option>
                      <option value="Domingos por la tarde">Domingos por la tarde</option>
                      <option value="Horarios flexibles / Tareas remotas">Horarios flexibles / Tareas remotas</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={resetVolunteerModal}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all"
                  >
                    Postularme
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
