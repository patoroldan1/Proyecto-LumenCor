import React, { useState } from 'react';
import { Book } from '../../types/index.ts';
import { MOCK_BOOKS } from '../../data/mockData.ts';
import {
  BookOpen,
  ShoppingBag,
  Eye,
  Star,
  X,
  Feather,
} from 'lucide-react';
import { UniversalFormModal } from '../UniversalFormModal.tsx';

const DEFAULT_MERCADO_LIBRE_URL =
  'https://www.mercadolibre.com.ar/rozas-lucio-v-mansilla-el-ateneo-libro/up/MLAU5144703584?pdp_filters=item_id%3AMLA2072914001#polycard_client=search-desktop&float_highlight=last_units&be_origin=searchv2&overlay_label=not_apply&search_layout=grid&position=2&type=product&tracking_id=5924f953-1868-4fc5-826f-8a59f68afae7&overlay_label_capability=not_apply&wid=MLA2072914001&sid=search';

export const EditorialSection: React.FC = () => {
  const [selectedBookForModal, setSelectedBookForModal] = useState<Book | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Editorial Hero Banner */}
      <div className="relative bg-stone-900 text-stone-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1600&q=80"
            alt="Fondo Libros"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest font-cinzel uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Catálogo Oficial de la Editorial</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Editorial LumenCor
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Libros que dan testimonio de la vida en la calle, reflexiones de peregrinos y ensayos sobre fraternidad. Disponibles directamente a través de Mercado Libre con envío a todo el país.
          </p>
        </div>
      </div>

      {/* Catálogo de Libros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_BOOKS.map((book) => {
            const mlUrl = book.mercadoLibreUrl || DEFAULT_MERCADO_LIBRE_URL;

            return (
              <div
                key={book.id}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => setSelectedBookForModal(book)}
                    className="h-72 bg-stone-100 relative overflow-hidden cursor-pointer flex items-center justify-center p-6 group-hover:bg-amber-50/30 transition-colors"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="max-h-full w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
                    />

                    {book.featured && (
                      <span className="absolute top-4 left-4 bg-amber-500 text-stone-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Destacado
                      </span>
                    )}

                    <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="p-2.5 bg-white text-stone-900 rounded-full shadow-lg">
                        <Eye className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <p className="text-xs text-amber-800 font-medium">{book.author}</p>
                    <h3
                      onClick={() => setSelectedBookForModal(book)}
                      className="font-serif text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer line-clamp-1"
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {book.synopsis}
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-[11px] text-stone-400">
                      <span>{book.format}</span>
                      <span>•</span>
                      <span>{book.pages} págs</span>
                      <span>•</span>
                      <span>Año {book.year}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[11px] text-stone-400 block uppercase font-medium">Precio</span>
                    <span className="font-serif text-xl font-bold text-stone-900">
                      ${book.price.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <a
                    href={mlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider font-cinzel uppercase bg-stone-900 hover:bg-amber-600 text-white hover:shadow-md transition-all shadow-sm cursor-pointer"
                    title="Comprar en Mercado Libre"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-stone-300" />
                    <span>Comprar</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banner Convocatoria de Autores al final del catálogo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <Feather className="w-3.5 h-3.5" />
              <span>Editorial LumenCor</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              ¿Querés publicar tu libro con Editorial LumenCor?
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Acompañamos a autores de obras testimoniales, espiritualidad, filosofía comunitaria y ensayos sociales. Dejanos tus datos de contacto para coordinar una reunión.
            </p>
          </div>

          <div className="z-10 flex-none">
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-cinzel text-xs font-bold uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <Feather className="w-4 h-4" />
              <span>Presentar mi Manuscrito</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Reutilizable Universal de Formulario (Solo Nombre, Email y Teléfono) */}
      <UniversalFormModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        seccion="editorial"
        badgeText="Editorial LumenCor"
        badgeIcon={<Feather className="w-3.5 h-3.5" />}
        title="Publicar con Editorial"
        submitButtonText="Enviar Propuesta"
        successTitle="¡Propuesta Recibida!"
        successDescription={({ name, phone, email }) =>
          `Recibimos tu solicitud, ${name}. Un miembro de nuestro equipo editorial se comunicará con vos al ${phone || email} para coordinar la gestión de tu proyecto literario.`
        }
      />

      {/* Modal de Detalle del Libro */}
      {selectedBookForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
            <button
              onClick={() => setSelectedBookForModal(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full bg-stone-100 relative flex items-center justify-center p-6">
                <img
                  src={selectedBookForModal.coverImage}
                  alt={selectedBookForModal.title}
                  className="max-h-full w-auto object-contain drop-shadow-md"
                />
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                    {selectedBookForModal.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 leading-tight">
                    {selectedBookForModal.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">Por {selectedBookForModal.author}</p>
                  <p className="text-sm text-stone-700 leading-relaxed pt-2">
                    {selectedBookForModal.synopsis}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-3 bg-stone-50 rounded-xl p-3 border border-stone-200 text-center text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Formato</span>
                      <span className="font-semibold text-stone-800">{selectedBookForModal.format}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Páginas</span>
                      <span className="font-semibold text-stone-800">{selectedBookForModal.pages}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Edición</span>
                      <span className="font-semibold text-stone-800">{selectedBookForModal.year}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 block uppercase">Precio</span>
                    <span className="font-serif text-2xl font-bold text-stone-900">
                      ${selectedBookForModal.price.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <a
                    href={selectedBookForModal.mercadoLibreUrl || DEFAULT_MERCADO_LIBRE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-amber-600 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-stone-300" />
                    <span>Comprar</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};