/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Quote,
  Users,
} from 'lucide-react';
import { BreakfastMapSection } from '../social/BreakfastMapSection.tsx';

interface SocialSectionProps {
  onOpenVolunteerModal?: () => void;
}

interface MemoryPhoto {
  id: string;
  title: string;
  period: string;
  category: 'todos' | 'comienzos' | 'rondas' | 'cocina' | 'talleres' | 'comunidad';
  image: string;
  anecdote: string;
  location?: string;
  aspect: 'tall' | 'wide' | 'square';
  rotation: string; // CSS rotation for organic collage look
}

const MEMORIES_DATA: MemoryPhoto[] = [
  {
    id: 'mem-1',
    title: 'La primera olla y la esquina de Callao',
    period: 'Primeros Pasos',
    category: 'comienzos',
    image: '/assets/images/social_primeros_dias.jpg',
    anecdote: 'Con solo dos termos prestados, una olla de sopa caliente y muchas ganas de escuchar, salimos por primera vez a caminar la noche porteña. No sabíamos cuánto iba a crecer esto.',
    location: 'Av. Callao y Corrientes',
    aspect: 'tall',
    rotation: '-rotate-1',
  },
  {
    id: 'mem-2',
    title: 'Ronda nocturna bajo la lluvia',
    period: 'Madrugadas de Invierno',
    category: 'rondas',
    image: '/assets/images/social_ronda_nocturna.jpg',
    anecdote: 'Aquel julio fue el más frío que recordamos. Los termos humeaban sin parar y el abrigo humano bajo los aleros de la estación hizo el milagro de transformar la soledad.',
    location: 'Estación Retiro',
    aspect: 'wide',
    rotation: 'rotate-1',
  },
  {
    id: 'mem-3',
    title: 'El calor de la cocina comunitaria',
    period: 'Cada Sábado',
    category: 'cocina',
    image: '/assets/images/social_cocina_comunitaria.jpg',
    anecdote: 'Pelar cincuenta kilos de cebollas y picar verduras entre mates, risas y canciones. La cocina es el corazón palpitante donde la comunidad se gesta antes de pisar la calle.',
    location: 'Sede Central',
    aspect: 'square',
    rotation: '-rotate-2',
  },
  {
    id: 'mem-4',
    title: 'La ronda del mate que desarma soledades',
    period: 'Plaza Constitución',
    category: 'comunidad',
    image: '/assets/images/social_mate_comunidad.jpg',
    anecdote: 'Pasar el mate de mano en mano en el banco de la plaza. No hay etiquetas, ni jerarquías, ni distancias: somos personas compartiendo la vida bajo el mismo cielo.',
    location: 'Constitución',
    aspect: 'tall',
    rotation: 'rotate-2',
  },
  {
    id: 'mem-5',
    title: 'Taller de oficio: manos que transforman madera',
    period: 'Galpón de Oficios',
    category: 'talleres',
    image: '/assets/images/social_taller_oficios.jpg',
    anecdote: 'Aprender carpintería y restauración no es solo lijar una tabla; es recuperar la confianza profunda de saber que uno es capaz de construir valor y belleza con sus manos.',
    location: 'Galpón San José',
    aspect: 'square',
    rotation: '-rotate-1',
  },
  {
    id: 'mem-6',
    title: 'Amasando el primer pan solidario',
    period: 'Horno Comunitario',
    category: 'cocina',
    image: '/assets/images/pan_solidario.jpg',
    anecdote: 'Madrugadas de harina, levadura y fuego de leña. El aroma del pan recién horneado inundaba la cuadra anunciando que el día arrancaba con alimento digno y caliente.',
    location: 'Panadería Social',
    aspect: 'wide',
    rotation: 'rotate-1',
  },
  {
    id: 'mem-7',
    title: 'Pintar para sanar: el taller de arte',
    period: 'Tardes de Expresión',
    category: 'talleres',
    image: '/assets/images/mujer_pintando.jpg',
    anecdote: 'Frente a la dureza del asfalto, el lienzo en blanco devuelve los colores, los sueños y la memoria de la infancia. Una tarde de pintura donde brotaron lágrimas y sonrisas.',
    location: 'Espacio Cultural',
    aspect: 'tall',
    rotation: '-rotate-2',
  },
  {
    id: 'mem-8',
    title: 'El abrazo que lo cambió todo',
    period: 'Noche de Once',
    category: 'comunidad',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1200',
    anecdote: 'Don Ramón nos esperaba todos los jueves en el mismo banco. Cuando cumplió 70 años, la plaza entera se llenó de velas, torta casera y un abrazo colectivo inolvidable.',
    location: 'Plaza Miserere',
    aspect: 'wide',
    rotation: 'rotate-2',
  },
  {
    id: 'mem-9',
    title: 'Preparando las cajas de abrigo de invierno',
    period: 'Campaña Frío Cero',
    category: 'rondas',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200',
    anecdote: 'Cientos de frazadas térmicas clasificadas, medias de abrigo y bufandas tejidas a mano por voluntarias de todo el país, cada una con un mensaje de aliento.',
    location: 'Centro de Acopio',
    aspect: 'square',
    rotation: '-rotate-1',
  },
  {
    id: 'mem-10',
    title: 'Risas y complicidad en el patio',
    period: 'Tarde Comunitaria',
    category: 'comunidad',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200',
    anecdote: 'Celebrar los pequeños y grandes hitos: un documento tramitado, una primera entrevista laboral, un reencuentro con un hijo después de años de distancia.',
    location: 'Patio de Encuentro',
    aspect: 'tall',
    rotation: 'rotate-1',
  },
  {
    id: 'mem-11',
    title: 'Servir con amor en cada plato hondo',
    period: 'Cenas Calientes',
    category: 'cocina',
    image: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&q=80&w=1200',
    anecdote: 'Una olla gigante de guiso de lentejas humeando a las diez de la noche. Servir no es tirar comida: es acercar un plato con reverencia y cariño.',
    location: 'Ronda Congreso',
    aspect: 'wide',
    rotation: '-rotate-2',
  },
  {
    id: 'mem-12',
    title: 'Caminando las calles al atardecer',
    period: 'Inicio de Recorrido',
    category: 'rondas',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1200',
    anecdote: 'El momento sagrado antes de salir: mochilas cargadas, termos revisados y una breve oración o silencio para disponer el corazón a escuchar sin prejuicios.',
    location: 'Barrio Sur',
    aspect: 'square',
    rotation: 'rotate-2',
  },
  {
    id: 'mem-13',
    title: 'La mano tendida que nunca juzga',
    period: 'Encuentro en la Vereda',
    category: 'comunidad',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb7?auto=format&fit=crop&q=80&w=1200',
    anecdote: 'Sentarse en el cordón de la vereda a la misma altura. No miramos desde arriba: nos sentamos al lado para mirar hacia adelante juntos.',
    location: 'San Telmo',
    aspect: 'tall',
    rotation: '-rotate-1',
  },
  {
    id: 'mem-14',
    title: 'Pinceladas colectivas en el mural barrial',
    period: 'Jornada Solidaria',
    category: 'talleres',
    image: 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&q=80&w=1200',
    anecdote: 'Una pared gris del barrio convertida en un estallido de color y esperanza gracias al pincel de quienes vivían en la calle y los vecinos que se sumaron.',
    location: 'Barracas',
    aspect: 'wide',
    rotation: 'rotate-1',
  },
  {
    id: 'mem-15',
    title: 'El primer equipo de voluntarios reunidos',
    period: 'El Origen',
    category: 'comienzos',
    image: '/assets/images/social_primeros_dias.jpg',
    anecdote: 'Éramos apenas siete personas en el garaje de una parroquia amiga. Con más dudas que certezas, pero con una certeza inquebrantable: no podíamos ser indiferentes.',
    location: 'Almagro',
    aspect: 'square',
    rotation: '-rotate-2',
  },
  {
    id: 'mem-16',
    title: 'Mesa larga de Nochebuena en la calle',
    period: 'Fin de Año',
    category: 'cocina',
    image: '/assets/images/social_cocina_comunitaria.jpg',
    anecdote: 'En Nochebuena nadie debe cenar solo ni a oscuras. Cortamos la calle, tendimos manteles largos con flores y brindamos más de doscientas personas como una gran familia.',
    location: 'Plaza Lavalle',
    aspect: 'tall',
    rotation: 'rotate-2',
  },
  {
    id: 'mem-17',
    title: 'Amanecer en Retiro tras una noche de guardia',
    period: 'Ronda de Madrugada',
    category: 'rondas',
    image: '/assets/images/social_ronda_nocturna.jpg',
    anecdote: 'Las primeras luces del alba sobre la torre de los ingleses. Volver a casa con los ojos cansados pero el corazón desbordante de paz y sentido.',
    location: 'Torre Monumental',
    aspect: 'wide',
    rotation: '-rotate-1',
  },
  {
    id: 'mem-18',
    title: 'Taller de calzado y marroquinería',
    period: 'Capacitación Laboral',
    category: 'talleres',
    image: '/assets/images/social_taller_oficios.jpg',
    anecdote: 'Aprender a cortar cuero y coser suelas. Carlos, tras dos años en situación de calle, realizó aquí sus primeros pares de zapatos y hoy trabaja en su propio taller.',
    location: 'Centro de Oficios',
    aspect: 'square',
    rotation: 'rotate-1',
  },
  {
    id: 'mem-19',
    title: 'Tarde de música y juegos con las familias',
    period: 'Tardes de Sol',
    category: 'comunidad',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
    anecdote: 'Una guitarra criolla, una ronda de canciones infantiles y los chicos riéndose a carcajadas. La infancia no puede quedar congelada en la calle.',
    location: 'Parque Patricios',
    aspect: 'tall',
    rotation: '-rotate-2',
  },
  {
    id: 'mem-20',
    title: 'El mate que cruzó generaciones y miradas',
    period: 'Encuentro Eterno',
    category: 'comunidad',
    image: '/assets/images/social_mate_comunidad.jpg',
    anecdote: 'Jóvenes voluntarios que recién empezaban la facultad charlando durante horas con Antonio, que llevaba 15 años viviendo bajo los puentes. Aprendizaje mutuo y genuino.',
    location: 'Bajo Autopista 25 de Mayo',
    aspect: 'wide',
    rotation: 'rotate-2',
  },
];

export const SocialSection: React.FC<SocialSectionProps> = ({ onOpenVolunteerModal }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const photos = MEMORIES_DATA;
  const currentPhoto = activePhotoIndex !== null ? photos[activePhotoIndex] : null;

  // Manejador del teclado para navegar el Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, photos.length]);

  return (
    <div className="bg-[#faf8f5] min-h-screen text-stone-900 pb-20 w-full max-w-full overflow-x-hidden">
      {/* HERO HEADER CON FOTO DE FONDO Y BOTÓN DENTRO DE LA PORTADA */}
      <div className="relative bg-stone-950 text-stone-100 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/assets/images/midjourney-social.png"
            alt="Social - Fundación LumenCor"
            style={{ objectPosition: '50% 24%' }}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-950/30 to-stone-950/75" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs tracking-widest font-cinzel uppercase shadow-xs">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>EL CORAZÓN DE NUESTRA MISIÓN</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Acompañamiento y dignidad en situación de calle
          </h1>

          <p className="max-w-2xl mx-auto text-stone-200 text-sm sm:text-base font-light leading-relaxed">
            Estar presentes donde nadie más llega. Salimos al encuentro de cada hermano con un plato caliente, una mirada cálida y la convicción de que nadie sobra en nuestra sociedad.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenVolunteerModal?.()}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-cinzel font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase rounded-full shadow-lg hover:shadow-amber-500/30 transition-all duration-200 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-stone-950 text-stone-950" />
              <span>SUMATE</span>
            </button>
          </div>
        </div>
      </div>


      {/* PRIMERO EN EL CONTENIDO PRINCIPAL: MAPA DE DESAYUNOS, DÍAS, HORARIOS Y FOTOS */}
<BreakfastMapSection onOpenVolunteerModal={onOpenVolunteerModal} />


      {/* MURAL COLLAGE - BENTO / MASONRY GRID CON ESTÉTICA ORGÁNICA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 overflow-x-hidden">
        <div className="mb-8 space-y-1">
  <span className="text-xs font-cinzel font-semibold text-amber-800 tracking-wider">
    Archivo solidario
  </span>
  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
    Recuerdos de nuestras rondas y talleres
  </h2>
</div>
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {photos.map((photo, index) => {
            return (
              <div
                key={`${photo.id}-${index}`}
                onClick={() => setActivePhotoIndex(index)}
                className={`group relative break-inside-avoid bg-white p-3 rounded-2xl shadow-md hover:shadow-2xl border border-stone-200/90 transition-all duration-300 cursor-pointer hover:-translate-y-1.5 sm:${photo.rotation} hover:rotate-0 hover:z-20`}
              >
                {/* Detalle visual estilo cinta adhesiva en la parte superior */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-100/70 border border-amber-300/40 rounded-xs rotate-1 shadow-xs pointer-events-none z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

                {/* Contenedor de la Foto */}
                <div className="relative overflow-hidden rounded-xl bg-stone-100 aspect-[4/3] sm:aspect-auto">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      photo.aspect === 'tall'
                        ? 'h-80 sm:h-96'
                        : photo.aspect === 'wide'
                        ? 'h-52 sm:h-60'
                        : 'h-64 sm:h-72'
                    }`}
                  />

                  {/* Gradiente sutil y badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white">
                    <div className="flex justify-between items-start">
                    </div>

                    <div>
                      <p className="text-xs text-amber-200 font-cinzel tracking-wider">
                        {photo.period}
                      </p>
                      <h3 className="font-serif text-sm font-bold text-white leading-tight">
                        {photo.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Pie de foto estilo Polaroid editorial */}
                <div className="pt-3 pb-1 px-1 flex items-center justify-between text-stone-700">
                  <div className="flex-1 pr-2">
                    <p className="text-xs font-serif font-bold text-stone-900 truncate">
                      {photo.title}
                    </p>
                    <p className="text-[11px] text-stone-500 font-sans flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-700 inline flex-shrink-0" />
                      <span>{photo.period}</span>
                      {photo.location && (
                        <>
                          <span className="text-stone-300">•</span>
                          <span className="truncate">{photo.location}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIGHTBOX MODAL DE MEMORIA COMPLETA */}
      {currentPhoto && activePhotoIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/85 backdrop-blur-md animate-fadeIn">
          {/* Botón cerrar */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50 border border-white/20"
            aria-label="Cerrar visor"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Flecha Anterior */}
          <button
            onClick={() =>
              setActivePhotoIndex((prev) =>
                prev !== null ? (prev - 1 + photos.length) % photos.length : null
              )
            }
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50 border border-white/20"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Flecha Siguiente */}
          <button
            onClick={() =>
              setActivePhotoIndex((prev) =>
                prev !== null ? (prev + 1) % photos.length : null
              )
            }
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-50 border border-white/20"
            aria-label="Foto siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Tarjeta Lightbox */}
          <div
            className="relative max-w-4xl w-full bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lado Imagen */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden max-h-[50vh] md:max-h-none">
              <img
                src={currentPhoto.image}
                alt={currentPhoto.title}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>

            {/* Lado Texto / Testimonio */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-white overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-cinzel tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentPhoto.period}</span>
                  {currentPhoto.location && (
                    <>
                      <span className="text-stone-500">•</span>
                      <span className="flex items-center gap-1 text-stone-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {currentPhoto.location}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  {currentPhoto.title}
                </h2>

                <p className="text-stone-300 text-sm font-light leading-relaxed">
                  {currentPhoto.anecdote}
                </p>

                
              </div>

              {/* Pie de Lightbox con botón de sumarse */}
              <div className="pt-6 border-t border-stone-800/80 mt-6 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Usa las flechas ← → para navegar
                </span>

                <button
                  onClick={() => {
                    setActivePhotoIndex(null);
                    onOpenVolunteerModal?.();
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-cinzel font-extrabold text-xs tracking-[0.18em] uppercase rounded-full transition-all cursor-pointer"
                >
                  SUMATE
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};