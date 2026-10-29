/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface SectionCtaBannerProps {
  badgeText: string;
  badgeIcon?: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onAction: () => void;
}

export const SectionCtaBanner: React.FC<SectionCtaBannerProps> = ({
  badgeText,
  badgeIcon,
  title,
  description,
  buttonText,
  buttonIcon,
  onAction,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Lado izquierdo: Textos */}
        <div className="space-y-3 text-center md:text-left z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
            {badgeIcon}
            <span>{badgeText}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            {description}
          </p>
        </div>

        {/* Lado derecho: Botón Amarillo */}
        <div className="z-10 flex-none">
          <button
            onClick={onAction}
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-cinzel text-xs font-bold uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            {buttonIcon}
            <span>{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};