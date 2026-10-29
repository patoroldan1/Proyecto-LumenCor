/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';

export interface UniversalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  seccion: string; // 'social' | 'editorial' | 'viajes' | 'arte'
  badgeText: string;
  badgeIcon?: React.ReactNode;
  title: string;
  submitButtonText?: string;
  successTitle?: string;
  successDescription?: (formData: { name: string; phone: string; email: string; extra: Record<string, string> }) => string;
  initialExtraData?: Record<string, string>;
  renderExtraFields?: (
    extraData: Record<string, string>,
    onChange: (key: string, value: string) => void
  ) => React.ReactNode;
}

export const UniversalFormModal: React.FC<UniversalFormModalProps> = ({
  isOpen,
  onClose,
  seccion,
  badgeText,
  badgeIcon,
  title,
  submitButtonText = 'Enviar',
  successTitle,
  successDescription,
  initialExtraData = {},
  renderExtraFields,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [baseForm, setBaseForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [extraData, setExtraData] = useState<Record<string, string>>(initialExtraData);

  if (!isOpen) return null;

  const handleExtraChange = (key: string, value: string) => {
    setExtraData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseForm.name.trim() || !baseForm.email.trim()) return;

    setIsSending(true);

    // Paquete unificado para el backend
    const payload = {
      seccion,
      nombre: baseForm.name.trim(),
      email: baseForm.email.trim(),
      telefono: baseForm.phone.trim(),
      datos: extraData,
      fechaEnvio: new Date().toISOString(),
    };

    try {
      await fetch('/api/formularios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.info(`[LumenCor Form - ${seccion}] Envío registrado localmente:`, payload);
    } finally {
      setIsSending(false);
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setIsSending(false);
    setBaseForm({ name: '', email: '', phone: '' });
    setExtraData(initialExtraData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-stone-200 my-auto">
        {/* Cruz de cierre */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Cerrar formulario"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Pantalla de éxito con tilde verde */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              {successTitle || `¡Muchas gracias, ${baseForm.name}!`}
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              {successDescription
                ? successDescription({
                    name: baseForm.name,
                    phone: baseForm.phone,
                    email: baseForm.email,
                    extra: extraData,
                  })
                : `Recibimos tu solicitud para el área de ${badgeText}. El equipo de LumenCor se comunicará con vos al ${baseForm.phone || baseForm.email} a la brevedad.`}
            </p>
            <div className="pt-4">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-stone-900 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* Formulario Base (Nombre, Correo, Teléfono + extras) */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                {badgeIcon}
                <span>{badgeText}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 pt-1">
                {title}
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              {/* Campo 1: Nombre */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={baseForm.name}
                  onChange={(e) => setBaseForm({ ...baseForm, name: e.target.value })}
                  placeholder="Ej. Lucas Gómez"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Campos 2 y 3: Correo y Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={baseForm.email}
                    onChange={(e) => setBaseForm({ ...baseForm, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    WhatsApp / Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={baseForm.phone}
                    onChange={(e) => setBaseForm({ ...baseForm, phone: e.target.value })}
                    placeholder="+54 9 11 ..."
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
                </div>
            </div>

              {/* Si alguna sección tiene campos extra, se renderizan acá */}
            {renderExtraFields && renderExtraFields(extraData, handleExtraChange)}
            </div>

            <div className="pt-3 flex gap-2">
            <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={isSending}
                className="flex-1 py-2.5 bg-stone-900 hover:bg-amber-600 disabled:bg-stone-400 text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
                {isSending ? (
                <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Enviando...</span>
                </>
                ) : (
                <span>{submitButtonText}</span>
                )}
            </button>
            </div>
        </form>
        )}
    </div>
    </div>
);
};