/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Pilgrimage } from '../../types/index.ts';
import { MOCK_PILGRIMAGES } from '../../data/mockData.ts';
import { Compass, Calendar, MapPin, Users, CheckCircle, ArrowRight, X, Clock, Quote } from 'lucide-react';

export const ViajesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [selectedPilgrimage, setSelectedPilgrimage] = useState<Pilgrimage | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState<Pilgrimage | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    passengers: 1,
    notes: '',
  });

  const upcomingList = MOCK_PILGRIMAGES.filter((p) => p.status === 'upcoming');
  const completedList = MOCK_PILGRIMAGES.filter((p) => p.status === 'completed');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email) return;
    setInquirySuccess(true);
  };

  const closeInquiry = () => {
    setShowInquiryForm(null);
    setInquirySuccess(false);
    setInquiryData({ name: '', email: '', phone: '', passengers: 1, notes: '' });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Hero Banner */}
      <div className="relative bg-stone-900 text-stone-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80"
            alt="Fondo Viajes"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest font-cinzel uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>Peregrinaciones y Caminos de Encuentro</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Viajes con Sentido Humano y Espiritual
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Viajar como peregrinos, no como meros turistas: con el corazón abierto al asombro, la fraternidad compartida y el compromiso solidario.
          </p>

          {/* Toggle Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1 bg-stone-950/80 backdrop-blur-md rounded-full border border-stone-800">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`
                  px-6 py-2 rounded-full text-xs sm:text-sm font-cinzel tracking-wider uppercase font-medium transition-all
                  ${
                    activeTab === 'upcoming'
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-md'
                      : 'text-stone-300 hover:text-white'
                  }
                `}
              >
                Próximas Peregrinaciones ({upcomingList.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`
                  px-6 py-2 rounded-full text-xs sm:text-sm font-cinzel tracking-wider uppercase font-medium transition-all
                  ${
                    activeTab === 'completed'
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-md'
                      : 'text-stone-300 hover:text-white'
                  }
                `}
              >
                Viajes Realizados ({completedList.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* UPCOMING TAB */}
        {activeTab === 'upcoming' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {upcomingList.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative h-56 bg-stone-100 overflow-hidden">
                      <img
                        src={trip.mainImage}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-amber-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10">
                        {trip.spotsLeft ? `${trip.spotsLeft} cupos disponibles` : 'Inscripción abierta'}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-stone-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{trip.destination}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>{trip.dates}</span>
                        <span>•</span>
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{trip.duration}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-stone-900 line-clamp-2">
                        {trip.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {trip.description}
                      </p>

                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-xs text-stone-700">
                        <span className="font-semibold text-amber-900 block text-[11px]">Guía y Animación:</span>
                        <span>{trip.spiritualGuide}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="p-6 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Inversión</span>
                      <span className="font-serif text-xl font-bold text-stone-900">
                        {trip.priceUSD ? `USD $${trip.priceUSD}` : 'A coordinar'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPilgrimage(trip)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 border border-stone-300 transition-colors"
                      >
                        Ver Itinerario
                      </button>
                      <button
                        onClick={() => setShowInquiryForm(trip)}
                        className="px-4 py-2 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all"
                      >
                        Inscribirse
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPLETED TAB */}
        {activeTab === 'completed' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {completedList.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm p-6 space-y-6"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <img
                      src={trip.mainImage}
                      alt={trip.title}
                      className="w-full sm:w-48 h-48 object-cover rounded-2xl shadow"
                    />
                    <div className="space-y-2 flex-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        Edición {trip.dates}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-stone-900">
                        {trip.title}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{trip.destination}</span>
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed pt-1">
                        {trip.description}
                      </p>
                    </div>
                  </div>

                  {/* Testimonies from this pilgrimage */}
                  {trip.testimonies && trip.testimonies.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-stone-100">
                      <h4 className="text-xs font-cinzel uppercase font-semibold text-stone-500 tracking-wider">
                        Testimonios de Peregrinos
                      </h4>
                      <div className="space-y-3">
                        {trip.testimonies.map((test, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-700 italic space-y-1 relative"
                          >
                            <Quote className="w-4 h-4 text-amber-600/40 absolute top-3 right-3" />
                            <p className="pr-6">"{test.quote}"</p>
                            <p className="font-semibold text-stone-900 not-italic text-right text-[11px] pt-1">
                              — {test.name} ({test.year})
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Itinerary Detail Modal */}
      {selectedPilgrimage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200">
            {/* Modal Header */}
            <div className="p-6 bg-stone-900 text-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-cinzel tracking-wider uppercase block">
                  Itinerario Detallado
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {selectedPilgrimage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPilgrimage(null)}
                className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex flex-wrap gap-4 text-xs text-stone-600 pb-4 border-b border-stone-100">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-amber-600" /> {selectedPilgrimage.dates}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-amber-600" /> {selectedPilgrimage.destination}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-amber-600" /> Guía: {selectedPilgrimage.spiritualGuide}</span>
              </div>

              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-4">
                  Programa Día por Día
                </h4>
                <div className="space-y-4">
                  {selectedPilgrimage.itineraryDays.map((d) => (
                    <div key={d.day} className="flex gap-4">
                      <div className="flex-none w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center shadow">
                        Día {d.day}
                      </div>
                      <div className="flex-1 pb-4 border-b border-stone-100 last:border-none">
                        <h5 className="font-semibold text-stone-900 text-sm">{d.title}</h5>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">{d.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPilgrimage(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowInquiryForm(selectedPilgrimage);
                  setSelectedPilgrimage(null);
                }}
                className="px-6 py-2 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all"
              >
                Inscribirme a este Viaje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration / Inquiry Form Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-stone-200">
            <button
              onClick={closeInquiry}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {inquirySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  ¡Solicitud de Inscripción Recibida!
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Gracias por tu interés en sumarte a <span className="font-semibold text-stone-900">{showInquiryForm.title}</span>. Nuestro equipo de coordinación de viajes se comunicará contigo al correo <span className="font-semibold text-amber-700">{inquiryData.email}</span> para brindarte la ficha de inscripción y coordinar la reunión informativa.
                </p>
                <button
                  onClick={closeInquiry}
                  className="w-full py-3 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-widest block font-cinzel">
                    Inscripción y Consulta
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {showInquiryForm.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Fechas: {showInquiryForm.dates} • {showInquiryForm.destination}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                      placeholder="Ej. María Sol Rodríguez"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={inquiryData.email}
                        onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Teléfono / WhatsApp</label>
                      <input
                        type="tel"
                        value={inquiryData.phone}
                        onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                        placeholder="+54 9 11 ..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Cantidad de Pasajeros</label>
                    <select
                      value={inquiryData.passengers}
                      onChange={(e) => setInquiryData({ ...inquiryData, passengers: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      <option value={1}>1 pasajero (individual)</option>
                      <option value={2}>2 pasajeros (habitación doble)</option>
                      <option value={3}>3 pasajeros</option>
                      <option value={4}>4 o más pasajeros (grupo familiar/parroquial)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Preguntas o requerimientos especiales</label>
                    <textarea
                      rows={2}
                      value={inquiryData.notes}
                      onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                      placeholder="Consultas sobre facilidades de pago, dieta especial, etc."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all shadow-md"
                  >
                    Enviar Solicitud
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
