/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SectionId = 'home' | 'social' | 'editorial' | 'viajes' | 'arte' | 'donar' | 'medios';

export interface SectionMeta {
  id: SectionId;
  title: string;
  subtitle: string;
  description: string;
  bgDesktop: string;
  bgMobile: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  synopsis: string;
  category: 'Espiritualidad' | 'Crónicas y Testimonios' | 'Filosofía' | 'Arte y Solidaridad';
  pages: number;
  year: number;
  format: 'Tapa Blanda' | 'Edición Especial' | 'Digital / eBook';
  stock: number;
  featured?: boolean;
  mercadoLibreUrl?: string;
}


export interface Pilgrimage {
  id: string;
  title: string;
  destination: string;
  status: 'upcoming' | 'completed';
  dates: string;
  duration: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  spiritualGuide: string;
  spotsTotal?: number;
  spotsLeft?: number;
  priceUSD?: number;
  itineraryDays: { day: number; title: string; detail: string }[];
  testimonies?: { name: string; year: string; quote: string }[];
}

export interface SocialProgram {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  schedule: string;
  location: string;
  image: string;
  impactMetric: string;
  impactLabel: string;
  volunteersNeeded: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  artistName: string;
  artistStory: string;
  technique: string;
  dimensions: string;
  price: number;
  imageUrl: string;
  year: number;
  available: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'video' | 'entrevista' | 'comunicado' | 'documental';
  outlet: string;
  date: string;
  description: string;
  imageUrl: string;
  videoDuration?: string;
  externalUrl?: string;
}
