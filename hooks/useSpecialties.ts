'use client';

import { useState, useEffect } from 'react';

export interface Specialty {
  id: string;
  name: string;
  areaColor: string;
  badgeLabel: string;
  iconName: string;
  shortDesc: string;
  focus: string[];
  bookingUrl?: string;
}

const DEFAULT_BOOKING_URL = 'https://consultorio.me/pre/selectexternal/417602?external=true';

export const INITIAL_SPECIALTIES: Specialty[] = [
  {
    id: 'medicina-general',
    name: 'Medicina General',
    areaColor: '#3B5B28',
    badgeLabel: 'Salud Primaria & Preventiva',
    iconName: 'Stethoscope',
    shortDesc: 'Evaluación clínica integral, diagnóstico oportuno, orden de exámenes y prevención en salud.',
    focus: ['Chequeo médico integral', 'Manejo de patologías generales', 'Orden e interpretación de exámenes'],
    bookingUrl: DEFAULT_BOOKING_URL
  },
  {
    id: 'pediatria',
    name: 'Pediatría',
    areaColor: '#C53030',
    badgeLabel: 'Salud Infanto-Juvenil',
    iconName: 'Baby',
    shortDesc: 'Control de desarrollo, nutrición pediátrica y atención médica especializada para niños y adolescentes.',
    focus: ['Control de niño sano', 'Desarrollo psicomotor y físico', 'Atención de morbilidad infantil'],
    bookingUrl: 'https://consultorio.me/pro/annia-diaz-gutt-/pediatra'
  },
  {
    id: 'otomodelacion',
    name: 'Otomodelación',
    areaColor: '#805AD5',
    badgeLabel: 'Procedimiento Estético',
    iconName: 'Sparkles',
    shortDesc: 'Técnica ambulatoria no quirúrgica para remodelar y armonizar el pabellón auricular de forma segura.',
    focus: ['Remodelación sin pabellón quirúrgico', 'Procedimiento ambulatorio', 'Resultados inmediatos'],
    bookingUrl: DEFAULT_BOOKING_URL
  },
  {
    id: 'quiropraxia',
    name: 'Quiropraxia',
    areaColor: '#DD6B20',
    badgeLabel: 'Columna & Postura',
    iconName: 'Activity',
    shortDesc: 'Ajustes articulares y vertebrales para aliviar restricciones biomecánicas y dolor de espalda.',
    focus: ['Ajustes vertebrales', 'Alivio de lumbalgia y cervicalgia', 'Corrección postura y ergonomía'],
    bookingUrl: DEFAULT_BOOKING_URL
  },
  {
    id: 'traumatologia',
    name: 'Traumatología',
    areaColor: '#2B6CB0',
    badgeLabel: 'Sistema Osteoarticular',
    iconName: 'Bone',
    shortDesc: 'Diagnóstico y manejo de lesiones musculares, articulares, tendinosas y molestias óseas.',
    focus: ['Tratamiento de dolor articular', 'Lesiones tendinosas y musculares', 'Evaluación física completa'],
    bookingUrl: DEFAULT_BOOKING_URL
  },
  {
    id: 'estetica-no-invasiva',
    name: 'Estética No Invasiva',
    areaColor: '#D53F8C',
    badgeLabel: 'Armonización & Cuidado Celular',
    iconName: 'Flame',
    shortDesc: 'Tratamientos dermocosméticos y faciales para realzar la vitalidad y frescura natural de la piel.',
    focus: ['Tratamientos de revitalización', 'Limpieza y cuidado facial', 'Procedimientos no invasivos'],
    bookingUrl: 'https://consultorio.me/pro/angelica-zavala'
  },
  {
    id: 'kinesiologia',
    name: 'Kinesiología',
    areaColor: '#319795',
    badgeLabel: 'Rehabilitación & Movimiento',
    iconName: 'Activity',
    shortDesc: 'Terapia física para reintegro funcional, rehabilitación traumatológica y acondicionamiento muscular.',
    focus: ['Rehabilitación traumatológica', 'Terapia manual dirigida', 'Acondicionamiento físico'],
    bookingUrl: 'https://consultorio.me/pro/joseffa-molgas-c/kinesiologa'
  },
  {
    id: 'psicologia',
    name: 'Psicología',
    areaColor: '#3182CE',
    badgeLabel: 'Salud Mental & Bienestar',
    iconName: 'Brain',
    shortDesc: 'Acompañamiento psicoterapéutico individual para adultos y jóvenes en gestión del estrés y ansiedad.',
    focus: ['Gestión de ansiedad y estrés', 'Psicoterapia individual', 'Desarrollo de herramientas emocionales'],
    bookingUrl: 'https://consultorio.me/pro/karina-kam-a/-psicologa'
  },
  {
    id: 'fonoaudiologia',
    name: 'Fonoaudiología',
    areaColor: '#D69E2E',
    badgeLabel: 'Comunicación & Lenguaje',
    iconName: 'MessageSquare',
    shortDesc: 'Evaluación y tratamiento en trastornos del habla, lenguaje, salud vocal y deglución.',
    focus: ['Trastornos del habla y lenguaje', 'Evaluación vocal profesional', 'Terapia de deglución'],
    bookingUrl: 'https://consultorio.me/pro/eugenio-opazo-c/-fonoaudiologo'
  },
  {
    id: 'terapia-ocupacional',
    name: 'Terapia Ocupacional',
    areaColor: '#2B6CB0',
    badgeLabel: 'Integración Sensorial & Autonomía',
    iconName: 'Compass',
    shortDesc: 'Evaluación sensorial, estimulación cognitiva y apoyo en el desarrollo de la vida diaria y neurodivergencias.',
    focus: ['Integración sensorial y apoyo TEA', 'Estimulación cognitiva', 'Estrategias para autonomía'],
    bookingUrl: DEFAULT_BOOKING_URL
  },
  {
    id: 'medicina-complementaria',
    name: 'Medicina Complementaria',
    areaColor: '#5B8246',
    badgeLabel: 'Enfoque Holístico & Bienestar',
    iconName: 'Leaf',
    shortDesc: 'Terapias complementarias para favorecer el equilibrio físico, mental y energético del organismo.',
    focus: ['Enfoque integral de salud', 'Terapias de bienestar corporal', 'Apoyo en autorregulación'],
    bookingUrl: 'https://consultorio.me/pro/paola-zavala-a'
  },
  {
    id: 'podologia',
    name: 'Podología Clínica',
    areaColor: '#2B6CB0',
    badgeLabel: 'Cuidado & Salud del Pie',
    iconName: 'Heart',
    shortDesc: 'Evaluación, prevención y tratamiento integral de afecciones dérmicas y ungueales del pie.',
    focus: ['Tratamiento de afecciones ungueales', 'Atención de pie diabético', 'Cuidado y prevención podológica'],
    bookingUrl: 'https://consultorio.me/pro/miriam-madrid-r/-podologa'
  }
];

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"(.*)"$/, '$1'));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"(.*)"$/, '$1'));
  return result;
}

export function useSpecialties(csvUrl?: string) {
  const [specialties, setSpecialties] = useState<Specialty[]>(INITIAL_SPECIALTIES);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!csvUrl) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Max 3s timeout

    async function loadSpecialties() {
      try {
        setLoading(true);
        const response = await fetch(csvUrl as string, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) return;

        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/).filter((l) => l.trim() !== '');

        if (lines.length < 2) return;

        const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
        const fetchedSpecialties: Specialty[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          if (row.length < 3) continue;

          const getValue = (key: string) => {
            const idx = headers.indexOf(key.toLowerCase());
            return idx !== -1 && row[idx] ? row[idx] : '';
          };

          const name = getValue('name');
          if (!name) continue;

          const focusRaw = getValue('focus');
          const focusList = focusRaw ? focusRaw.split(';').map((f) => f.trim()).filter(Boolean) : [];

          fetchedSpecialties.push({
            id: getValue('id') || `spec-${i}`,
            name,
            areaColor: getValue('areacolor') || '#3B5B28',
            badgeLabel: getValue('badgelabel') || 'Atención Clínica',
            iconName: getValue('iconname') || 'Activity',
            shortDesc: getValue('shortdesc') || 'Atención integral y personalizada para mejorar tu bienestar.',
            focus: focusList.length > 0 ? focusList : ['Atención profesional', 'Evaluación clínica'],
            bookingUrl: getValue('bookingurl') || DEFAULT_BOOKING_URL
          });
        }

        if (fetchedSpecialties.length > 0) {
          setSpecialties(fetchedSpecialties);
        }
      } catch (err) {
        // En caso de abort o error de red, mantiene silenciosamente INITIAL_SPECIALTIES
      } finally {
        setLoading(false);
      }
    }

    loadSpecialties();

    return () => clearTimeout(timeoutId);
  }, [csvUrl]);

  return { specialties, loading };
}
