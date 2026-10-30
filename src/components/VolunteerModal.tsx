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
      badgeText="Sumate a LumenCor"
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
          <div className="w-full min-w-0">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Profesión / Rol de Colaboración
            </label>
            <select
              value={extraData.profesion}
              onChange={(e) => onChange('profesion', e.target.value)}
              className="w-full max-w-full min-w-0 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white truncate block box-border"
            >
              <option value="Voluntario General (Acompañamiento, Viandas y Tareas Básicas)">
                Voluntario General (Acompañamiento, Viandas y Tareas Básicas)
              </option>
              <option value="Medicina / Enfermería (Salud Comunitaria)">
                Medicina / Enfermería (Salud Comunitaria)
              </option>
              <option value="Psicología / Acompañamiento Terapéutico">
                Psicología / Acompañamiento Terapéutico
              </option>
              <option value="Trabajo Social / Asistencia Social">
                Trabajo Social / Asistencia Social
              </option>
              <option value="Abogacía / Asesoramiento Legal">
                Abogacía / Asesoramiento Legal
              </option>
              <option value="Educación / Docencia / Oficios">
                Educación / Docencia / Capacitación
              </option>
              <option value="Cocina / Manipulación de Alimentos">
                Cocina Comunitaria / Manipulación de Alimentos
              </option>
              <option value="Logística / Chofer / Transporte">
                Logística / Chofer / Transporte
              </option>
              <option value="Comunicación / Diseño / Redes">
                Comunicación / Diseño / Redes Sociales
              </option>
              <option value="Otra profesión u oficio">
                Otra profesión u oficio
              </option>
            </select>
          </div>

          <div className="w-full min-w-0">
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Disponibilidad Horaria
            </label>
            <select
              value={extraData.disponibilidad}
              onChange={(e) => onChange('disponibilidad', e.target.value)}
              className="w-full max-w-full min-w-0 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white truncate block box-border"
            >
              <option value="Noches de semana (Rondas nocturnas)">
                Noches de semana (Rondas nocturnas)
              </option>
              <option value="Fines de semana (Mañana o Tarde)">
                Fines de semana (Mañana o Tarde)
              </option>
              <option value="Días de semana (Mañana o Tarde)">
                Días de semana (Mañana o Tarde)
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