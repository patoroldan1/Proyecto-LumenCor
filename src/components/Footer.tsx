/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SectionId } from '../types/index.ts';
import { Heart, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectSection: (section: SectionId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Fundación LUMENCOR
            </h3>
            <p className="text-stone-400 text-xs leading-relaxed">
              Organización sin fines de lucro dedicada al acompañamiento integral, alimentación, revinculación social de personas en situación de calle.
            </p>
          </div>

          

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-semibold uppercase tracking-wider text-amber-400">
              Sede y Contacto
            </h4>
            <div className="space-y-2 text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-500 flex-none mt-0.5" />
                <span>Av. Independencia 2450, Ciudad de Buenos Aires</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-500 flex-none" />
                <span>+54 11 4308-9920</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-500 flex-none" />
                <span>contacto@lumencor.org</span>
              </p>
            </div>
          </div>

          {/* Col 4: Quick Donate */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-semibold uppercase tracking-wider text-rose-400">
              Sumá Tu Aporte
            </h4>
            <p className="text-stone-400 text-xs">
              Tu colaboración sostiene cada plato caliente y cada noche de refugio.
            </p>
            <button
              onClick={() => onSelectSection('donar')}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-cinzel text-xs font-semibold rounded-xl uppercase tracking-wider transition-all shadow"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Donar Ahora</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Fundación LumenCor. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
