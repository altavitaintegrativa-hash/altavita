'use client';

import { useState, useEffect } from 'react';

export interface Specialty {
  id: string;
  specialty: string;
  name: string;
  areaColor: string;
  badgeLabel: string;
  iconName: string;
  shortDesc: string;
  focus: string[];
  bookingUrl: string;
}

const DEFAULT_BOOKING_URL = 'https://consultorio.me/pre/selectexternal/417602?external=true';

export const INITIAL_SPECIALTIES: Specialty[] = [
  {
    id: 'medicina-general',
    specialty: 'Centro Altavita',
    name: 'Elige tu Especialista',
    areaColor: '#3B5B28',
    badgeLabel: 'Salud Primaria & Preventiva',
    iconName: 'Stethoscope',
    shortDesc: 'Evaluación clínica integral, diagnóstico oportuno, orden de exámenes y prevención en salud.',
    focus: ['Chequeo médico integral', 'Manejo de patologías generales', 'Orden e interpretación de exámenes'],
    bookingUrl: 'https://consultorio.me/pre/selectexternal/417602?external=true'
  },
  {
    id: 'pediatria',
    specialty: 'Pediatría',
    name: 'Dra. Annia Díaz',
    areaColor: '#C53030',
    badgeLabel: 'Salud Infanto-Juvenil',
    iconName: 'Baby',
    shortDesc: 'Control de desarrollo, nutrición pediátrica y atención médica especializada para niños y adolescentes.',
    focus: ['Control de niño sano', 'Desarrollo psicomotor y físico', 'Atención de morbilidad infantil'],
    bookingUrl: 'https://consultorio.me/pro/annia-diaz-gutt-pediatra?list=true&external=true'
  },
  {
    id: 'masoterapia',
    specialty: 'Masoterapia',
    name: 'Angélica Zavala',
    areaColor: '#D53F8C',
    badgeLabel: 'Bienestar & Terapia Corporal',
    iconName: 'Flame',
    shortDesc: 'Masajes terapéuticos, descontracturantes y de relajación para aliviar tensiones y mejorar la circulación.',
    focus: ['Masaje descontracturante', 'Masaje de relajación', 'Terapia corporal integral'],
    bookingUrl: 'https://consultorio.me/pro/angelica-zavala-masoterapeuta?list=true&external=true'
  },
  {
    id: 'fonoaudiologia',
    specialty: 'Fonoaudiología',
    name: 'Eugenio Opazo',
    areaColor: '#D69E2E',
    badgeLabel: 'Comunicación & Lenguaje',
    iconName: 'MessageSquare',
    shortDesc: 'Evaluación y tratamiento en trastornos del habla, lenguaje, salud vocal y deglución.',
    focus: ['Trastornos del habla y lenguaje', 'Evaluación vocal profesional', 'Terapia de deglución'],
    bookingUrl: 'https://consultorio.me/pro/eugenio-opazo-c-fonoaudiologo?list=true&external=true'
  },
  {
    id: 'kinesiologia',
    specialty: 'Kinesiología',
    name: 'Joseffa Molgas',
    areaColor: '#319795',
    badgeLabel: 'Rehabilitación & Movimiento',
    iconName: 'Activity',
    shortDesc: 'Terapia física para reintegro funcional, rehabilitación traumatológica y acondicionamiento muscular.',
    focus: ['Rehabilitación traumatológica', 'Terapia manual dirigida', 'Acondicionamiento físico'],
    bookingUrl: 'https://consultorio.me/pro/joseffa-molgas-c-kinesiologa?list=true&external=true'
  },
  {
    id: 'psicologia',
    specialty: 'Psicología',
    name: 'Karina Kam',
    areaColor: '#3182CE',
    badgeLabel: 'Salud Mental & Bienestar',
    iconName: 'Brain',
    shortDesc: 'Acompañamiento psicoterapéutico individual para adultos y jóvenes en gestión del estrés y ansiedad.',
    focus: ['Gestión de ansiedad y estrés', 'Psicoterapia individual', 'Desarrollo de herramientas emocionales'],
    bookingUrl: 'https://consultorio.me/pro/karina-kam-a-psicologa?list=true&external=true'
  },
  {
    id: 'podologia',
    specialty: 'Podología',
    name: 'Miriam Madrid',
    areaColor: '#2B6CB0',
    badgeLabel: 'Cuidado & Salud del Pie',
    iconName: 'Heart',
    shortDesc: 'Evaluación, prevención y tratamiento integral de afecciones dérmicas y ungueales del pie.',
    focus: ['Tratamiento de afecciones ungueales', 'Atención de pie diabético', 'Cuidado y prevención podológica'],
    bookingUrl: 'https://consultorio.me/pro/miriam-madrid-r-podologa?list=true&external=true'
  },
  {
    id: 'medicina-complementaria',
    specialty: 'Terapia Integral',
    name: 'Paola Zavala',
    areaColor: '#5B8246',
    badgeLabel: 'Enfoque Holístico & Bienestar',
    iconName: 'Leaf',
    shortDesc: 'Terapias complementarias e integrales para favorecer el equilibrio físico, mental y energético.',
    focus: ['Enfoque integral de salud', 'Terapias de bienestar corporal', 'Apoyo en autorregulación'],
    bookingUrl: 'https://consultorio.me/pro/paola-zavala-terapeuta-integral?list=true&external=true'
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
    const timeoutId = setTimeout(() => controller.abort(), 3000);

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

          const specialty = getValue('specialty') || getValue('specialty') || getValue('name') || 'Especialidad';
          const name = getValue('name') || getValue('profesional') || getValue('doctor') || '';

          if (!specialty) continue;

          const focusRaw = getValue('focus');
          const focusList = focusRaw ? focusRaw.split(';').map((f) => f.trim()).filter(Boolean) : [];

          fetchedSpecialties.push({
            id: getValue('id') || `spec-${i}`,
            specialty,
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
        // Mantiene INITIAL_SPECIALTIES silenciosamente si falla
      } finally {
        setLoading(false);
      }
    }

    loadSpecialties();

    return () => clearTimeout(timeoutId);
  }, [csvUrl]);

  return { specialties, loading };
}
