import React, { useState } from 'react';
import { SectionId } from './types/index.ts';
import { HomeHeroGrid } from './components/HomeHeroGrid.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { VolunteerModal } from './components/VolunteerModal.tsx';

// Secciones
import { EditorialSection } from './components/sections/EditorialSection.tsx';
import { ViajesSection } from './components/sections/ViajesSection.tsx';
import { DonarSection } from './components/sections/DonarSection.tsx';
import { SocialSection } from './components/sections/SocialSection.tsx';
import { ArteSection } from './components/sections/ArteSection.tsx';
import { MediosSection } from './components/sections/MediosSection.tsx';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  // Navegación
  const handleSelectSection = (section: SectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f5f1eb] font-sans antialiased selection:bg-amber-200 selection:text-stone-900">
      {/* VISTA 1: HOME */}
      {activeSection === 'home' ? (
        <HomeHeroGrid
          onSelectSection={handleSelectSection}
          onOpenVolunteerModal={() => setIsVolunteerModalOpen(true)}
        />
      ) : (
        /* VISTA 2: SECCIONES INTERNAS */
        <div className="flex flex-col min-h-screen">
          <Navbar
            activeSection={activeSection}
            onSelectSection={handleSelectSection}
            onOpenVolunteerModal={() => setIsVolunteerModalOpen(true)}
          />

          <main className="flex-1">
            {activeSection === 'editorial' && <EditorialSection />}
            {activeSection === 'viajes' && <ViajesSection />}
            {activeSection === 'donar' && <DonarSection />}
            {activeSection === 'social' && <SocialSection />}
            {activeSection === 'arte' && <ArteSection />}
            {activeSection === 'medios' && <MediosSection />}
          </main>

          <Footer onSelectSection={handleSelectSection} />
        </div>
      )}

      {/* Formulario de Voluntario accesible desde cualquier botón */}
      <VolunteerModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
      />
    </div>
  );
}