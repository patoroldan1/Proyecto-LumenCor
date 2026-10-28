/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Image as ImageIcon, Smartphone, Monitor } from 'lucide-react';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-100">Bocetos Guía del Proyecto</h3>
              <p className="text-xs text-stone-400">Diseño de referencia enviado por el cliente (Desktop y Mobile)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Cerrar modal de bocetos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop Mockup */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div className="flex items-center gap-2 mb-3 text-stone-300 font-medium text-sm">
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>Boceto Desktop (2 columnas x 3 filas)</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-stone-800 bg-stone-900">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-14_at_13.57.38_8acd07a0.jpeg"
                  alt="Boceto Desktop Original"
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="mt-2 text-xs text-stone-400">
                Disposición en cuadrícula sin scroll que ocupa el 100% de la altura visible.
              </p>
            </div>

            {/* Mobile Mockup */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div className="flex items-center gap-2 mb-3 text-stone-300 font-medium text-sm">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Boceto Mobile (6 bandas apiladas)</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-stone-800 bg-stone-900 max-h-[460px] overflow-y-auto">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-14_at_13.53.19_534da7a4.jpeg"
                  alt="Boceto Mobile Original"
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="mt-2 text-xs text-stone-400">
                Las 6 franjas se adaptan en 100dvh para no requerir scroll al ingresar al sitio.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors font-medium"
          >
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  );
};
