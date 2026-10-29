/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users } from 'lucide-react';
import { UniversalFormModal } from './UniversalFormModal.tsx';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose }) => {
  return (
    <UniversalFormModal
      isOpen={isOpen}
      onClose={onClose}
      seccion="social"
      badgeText="Voluntariado LumenCor"
      badgeIcon={<Users className="w-3.5 h-3.5" />}
      title="Sumate a Nuestra Misión"
      submitButtonText="Postularme"
      initialExtraData={{
        profesion: 'Voluntario General (Acompañamiento, Viandas y Tareas Básicas)',
        disponibilidad: 'Noches de semana (Rondas nocturnas)',
      }}
      successTitle="¡Gracias por sumarte!"
      successDescription={({ name, phone, email, extra }) =>
        `Recibimos tu postulación, ${name}, con perfil de ${extra.profesion || 'Voluntariado'}. El equipo de coordinación se comunicará con vos al ${phone || email} para la bienvenida.`
      }
      renderExtraFields={(extraData, onChange) => (
        <>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Profesión / Rol de Colaboración
            </label>
            <select
              value={extraData.profesion}
              onChange={(e) => onChange('profesion', e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            >
              <option value="Voluntario General (Acompañamiento y Tareas Básicas)">
                Voluntario General (Acompañamiento y Tareas Básicas)
              </option>
              <option value="Medicina / Enfermería">
                Medicina / Enfermería 
              </option>
              <option value="Psicología / Acompañamiento Terapéutico">
                Psicología / Acompañamiento Terapéutico
              </option>
              <option value="Educación / Capacitación">
                Educación / Capacitación
              </option>
              <option value="Comunicación / Diseño / Redes">
                Comunicación / Diseño / Redes Sociales
              </option>
              <option value="Asistencia Social">
                Asistencia Social
              </option>
              <option value="Cocina">
                Cocina
              </option>
              <option value="Otra profesión u oficio">
                Otra profesión u oficio
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Disponibilidad Horaria
            </label>
            <select
              value={extraData.disponibilidad}
              onChange={(e) => onChange('disponibilidad', e.target.value)}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            >
              <option value="Días de semana (Mañana o Tarde)">
                Días de semana (Mañana o Tarde)
              </option>
              <option value="Fines de semana (Mañana o Tarde)">
                Fines de semana (Mañana o Tarde)
              </option>
              <option value="Horarios flexibles / A coordinar">
                Horarios flexibles / A coordinar
              </option>
            </select>
          </div>
        </>
      )}
    />
  );
};