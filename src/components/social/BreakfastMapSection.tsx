/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Clock,
  Calendar,
  Coffee,
  Plus,
  Minus,
  LocateFixed,
  Heart,
  X,
  Camera,
} from 'lucide-react';

interface BreakfastPhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
  scheduleTag: string;
}

const PARQUE_LAS_HERAS_COORDS: [number, number] = [-34.5838, -58.409];
const DEFAULT_ZOOM = 15;
const MIN_ZOOM = 10; // Permite hacer zoom out para ver todo Buenos Aires y alrededores
const MAX_ZOOM = 18;

const BREAKFAST_LOCATION = {
  name: 'Parque Las Heras — Mesa solidaria',
  neighborhood: 'Palermo, CABA',
  address: 'Av. Gral. Las Heras y Av. Coronel Díaz (Parque Las Heras)',
  daysAndHours: 'Todos los días de 10:30 a 12:30 hs',
  menu: 'Café con leche, mate cocido, medialunas, pan casero y fruta fresca.',
  notes:
    'Punto de encuentro semanal en Parque Las Heras donde compartimos un desayuno caliente, escucha y acompañamiento con nuestros vecinos en situación de calle.',
};

const BREAKFAST_PHOTOS: BreakfastPhoto[] = [
  {
    id: 'bp-1',
    src: '/assets/images/desayuno_plaza_cafe.jpg',
    title: 'Termos humeantes en Parque Las Heras',
    caption:
      'Voluntarios sirviendo café con leche caliente y medialunas en el arranque de la mañana en Palermo.',
    scheduleTag: 'Todos los jueves · 8 a 11 hs',
  },
  {
    id: 'bp-2',
    src: '/assets/images/desayuno_mate_facturas.jpg',
    title: 'Mesa larga con mate y facturas',
    caption:
      'Nos sentamos a la par bajo la arboleda de Parque Las Heras para compartir el desayuno y empezar el día acompañados.',
    scheduleTag: 'Parque Las Heras · Palermo',
  },
  {
    id: 'bp-3',
    src: '/assets/images/desayuno_voluntarios_mesas.jpg',
    title: 'Bolsitas de desayuno y abrazo',
    caption:
      'Cada vecino recibe su café caliente, pan fresco y una palabra cercana en la esquina de Las Heras y Coronel Díaz.',
    scheduleTag: 'Jueves por la mañana',
  },
  {
    id: 'bp-4',
    src: '/assets/images/pan_solidario.jpg',
    title: 'Pan casero recién horneado',
    caption:
      'Elaborado bien temprano cada jueves para compartir fresco en el encuentro de Parque Las Heras.',
    scheduleTag: 'Desayunos en Parque Las Heras',
  },
];

interface BreakfastMapSectionProps {
  onOpenVolunteerModal?: () => void;
}

export const BreakfastMapSection: React.FC<BreakfastMapSectionProps> = ({
  onOpenVolunteerModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM);
  const [lightboxPhoto, setLightboxPhoto] = useState<BreakfastPhoto | null>(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapInstanceRef.current) return;

    const map = L.map(container, {
      center: PARQUE_LAS_HERAS_COORDS,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    // Mapa callejero completo de Buenos Aires (OpenStreetMap)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: MAX_ZOOM,
    }).addTo(map);

    // Ícono personalizado: símbolo de ubicación (pin) con corazón en el centro
    const heartPinIcon = L.divIcon({
      className: 'lumencor-heart-pin',
      html: `
        <div style="position:relative;width:54px;height:66px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <span style="position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:22px;height:8px;background:rgba(0,0,0,0.28);border-radius:9999px;filter:blur(2px);"></span>
          <svg viewBox="0 0 54 64" width="54" height="64" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3));overflow:visible;">
            <circle cx="27" cy="24" r="22" fill="#e11d48" fill-opacity="0.18" />
            <path
              d="M27 60 C15 47 7 35 7 23 C7 11.95 15.95 3 27 3 C38.05 3 47 11.95 47 23 C47 35 39 47 27 60 Z"
              fill="#e11d48"
              stroke="#ffffff"
              stroke-width="3"
            />
            <path
              d="M27 33.2 C27 33.2 16.5 26.8 16.5 19.6 C16.5 16.1 19.2 13.5 22.3 13.5 C24.3 13.5 26.1 14.6 27 16.2 C27.9 14.6 29.7 13.5 31.7 13.5 C34.8 13.5 37.5 16.1 37.5 19.6 C37.5 26.8 27 33.2 27 33.2 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      `,
      iconSize: [54, 66],
      iconAnchor: [27, 60],
      popupAnchor: [0, -56],
    });

    const marker = L.marker(PARQUE_LAS_HERAS_COORDS, {
      icon: heartPinIcon,
      title: 'Desayunos LumenCor — Parque Las Heras',
    }).addTo(map);

    marker.bindPopup(
      `<div style="font-family:sans-serif;min-width:190px;padding:2px 0;">
        <div style="font-weight:700;font-size:13px;color:#1c1917;margin-bottom:2px;">Parque Las Heras</div>
        <div style="font-weight:600;font-size:12px;color:#e11d48;margin-bottom:4px;">Todos los jueves de 8 a 11 hs</div>
        <div style="font-size:11px;color:#57534e;">Av. Gral. Las Heras y Av. Coronel Díaz, Palermo</div>
      </div>`
    );

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetMap = () => {
    mapInstanceRef.current?.setView(PARQUE_LAS_HERAS_COORDS, DEFAULT_ZOOM, { animate: true });
    markerRef.current?.openPopup();
  };

  return (
    <section
      aria-labelledby="breakfast-map-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14"
    >
      {/* Encabezado de la sección */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-cinzel font-semibold tracking-wider text-amber-800">
            <Coffee className="w-4 h-4 text-rose-600" />
            <span>Desayunos solidarios en la calle</span>
          </div>
          <h2
            id="breakfast-map-heading"
            className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight"
          >
            Mapa de desayunos
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Nos encontramos en Parque Las Heras, en el corazón de Palermo, Buenos Aires. Cada mañana preparamos termos con café, mate cocido y pan recién horneado para compartir.
          </p>
        </div>

        {/* Destacado rápido del horario principal */}
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 px-5 py-3 rounded-2xl shadow-md border border-amber-400 self-start md:self-auto">
          <Calendar className="w-5 h-5 text-stone-950 shrink-0" />
          <div className="text-left">
            <span className="text-[11px] font-semibold block leading-none opacity-85">
              Parque Las Heras · Palermo
            </span>
            <span className="font-serif text-sm sm:text-base font-bold leading-snug">
              {BREAKFAST_LOCATION.daysAndHours}
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor principal: Mapa interactivo de Buenos Aires + Tarjeta de horario/detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* COLUMNA IZQUIERDA: Mapa interactivo real de Buenos Aires */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-300/90 shadow-lg overflow-hidden flex flex-col">
          {/* Barra superior limpia con ubicación */}
          <div className="px-4 py-3 bg-white border-b border-stone-200 flex items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">
                  {BREAKFAST_LOCATION.name}
                </p>
                <p className="text-[11px] text-stone-500 truncate">
                  {BREAKFAST_LOCATION.address}
                </p>
              </div>
            </div>
          </div>

          {/* Lienzo del Mapa de Buenos Aires (aislado con z-0 para no tapar modales) */}
          <div className="relative isolate z-0 h-[380px] sm:h-[440px] w-full overflow-hidden bg-stone-200">
            <div
              ref={mapContainerRef}
              aria-label="Mapa interactivo de Buenos Aires con el punto de desayuno en Parque Las Heras"
              className="w-full h-full"
            />

            {/* Tarjeta flotante inferior izquierda con día y horario */}
            <div className="absolute bottom-3 left-3 z-[450] max-w-[260px] sm:max-w-xs bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-stone-200 pointer-events-auto">
              <div className="flex items-center gap-2 text-rose-600 text-[11px] font-bold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{BREAKFAST_LOCATION.daysAndHours}</span>
              </div>
              <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                Parque Las Heras · {BREAKFAST_LOCATION.neighborhood}
              </p>
            </div>

            {/* Controles de zoom (+ / - / centrar en Parque Las Heras) */}
            <div className="absolute bottom-7 right-3 z-[450] flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleResetMap}
                title="Centrar en Parque Las Heras"
                aria-label="Centrar mapa en Parque Las Heras"
                className="w-9 h-9 rounded-xl bg-white hover:bg-stone-100 text-stone-800 shadow-md border border-stone-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <LocateFixed className="w-4 h-4 text-rose-600" />
              </button>
              <div className="flex flex-col rounded-xl bg-white shadow-md border border-stone-200 overflow-hidden">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={currentZoom >= MAX_ZOOM}
                  title="Acercar mapa"
                  aria-label="Acercar mapa"
                  className="w-9 h-9 hover:bg-stone-100 disabled:opacity-40 text-stone-800 flex items-center justify-center border-b border-stone-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={currentZoom <= MIN_ZOOM}
                  title="Alejar mapa para ver todo Buenos Aires"
                  aria-label="Alejar mapa"
                  className="w-9 h-9 hover:bg-stone-100 disabled:opacity-40 text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Tarjeta colorida con días, horarios y acción */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-300/90 shadow-lg overflow-hidden flex flex-col justify-between">
          <div>
            {/* Cabecera colorida acorde a LumenCor */}
            <div className="bg-gradient-to-br from-rose-600 via-rose-600 to-amber-600 text-white p-6 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-cinzel font-semibold tracking-wider text-amber-100">
                  {BREAKFAST_LOCATION.neighborhood}
                </span>
                
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                {BREAKFAST_LOCATION.name}
              </h3>
            </div>

            {/* Datos detallados */}
            <div className="p-6 space-y-4">
              {/* Bloque destacado de Días y Horarios */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-amber-900 block">
                    Días y horarios
                  </span>
                  <p className="font-serif text-lg font-bold text-stone-900 leading-tight mt-0.5">
                    {BREAKFAST_LOCATION.daysAndHours}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      Punto exacto de encuentro
                    </span>
                    <span className="text-xs text-stone-600">{BREAKFAST_LOCATION.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Coffee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 block">
                      ¿Qué servimos en cada jornada?
                    </span>
                    <span className="text-xs text-stone-600">{BREAKFAST_LOCATION.menu}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                  {BREAKFAST_LOCATION.notes}
                </p>
              </div>
            </div>
          </div>

          {/* Botón único de acción */}
          <div className="p-6 pt-0">
            <button
              type="button"
              onClick={() => onOpenVolunteerModal?.()}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-stone-950 font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-stone-950 text-stone-950" />
              <span>Sumarme a servir desayunos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tira de fotos reales de los desayunos (solo galería de fotos) */}
      <div className="mt-8 bg-gradient-to-br from-amber-50/80 via-white to-rose-50/50 rounded-3xl border border-amber-200/80 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Fotos de nuestros desayunos
              </h3>
              <p className="text-xs text-stone-600">
                Postales de los jueves de 8 a 11 hs compartiendo mesa caliente en Parque Las Heras.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-rose-700">
            Tocá cualquier foto para ampliarla
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="breakfast-photo-gallery">
          {BREAKFAST_PHOTOS.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxPhoto(photo)}
              aria-label={`Ampliar foto: ${photo.title}`}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer block w-full aspect-[4/3]"
            >
              <img
                src={"https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200"}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox simple para ampliar fotos de desayuno */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxPhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxPhoto.title}
        >
          <div
            className="relative max-w-3xl w-full bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Cerrar foto de desayuno"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.title}
              className="w-full max-h-[82vh] object-contain bg-stone-950"
            />
          </div>
        </div>
      )}

      {/* Lightbox simple para ampliar fotos de desayuno */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxPhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-2xl w-full bg-stone-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-stone-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Cerrar foto de desayuno"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxPhoto.src}
              alt={lightboxPhoto.title}
              className="w-full max-h-[65vh] object-cover"
            />
            <div className="p-5 space-y-1.5">
              <span className="text-xs font-semibold text-amber-300 block">
                {lightboxPhoto.scheduleTag}
              </span>
              <h4 className="font-serif text-xl font-bold text-white">
                {lightboxPhoto.title}
              </h4>
              <p className="text-sm text-stone-300 leading-relaxed">
                {lightboxPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};