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

// Datos de respaldo por si falla la conexión a Google Sheets
const FALLBACK_SPECIALTIES: Specialty[] = [
  {
    id: 'medicina-general',
    name: 'Medicina General',
    areaColor: '#3B5B28',
    badgeLabel: 'Salud Primaria & Preventiva',
    iconName: 'Stethoscope',
    shortDesc: 'Evaluación clínica integral, diagnóstico oportuno, orden de exámenes y prevención en salud.',
    focus: ['Chequeo médico integral', 'Manejo de patologías generales', 'Orden e interpretación de exámenes'],
    bookingUrl: 'https://consultorio.me/pre/selectexternal/417602?external=true'
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
  const [specialties, setSpecialties] = useState<Specialty[]>(FALLBACK_SPECIALTIES);
  const [loading, setLoading] = useState<boolean>(Boolean(csvUrl));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!csvUrl) return;

    async function loadSpecialties() {
      try {
        setLoading(true);
        const response = await fetch(csvUrl as string);
        if (!response.ok) throw new Error('Error al conectar con Google Sheets (Especialidades)');

        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/).filter((l) => l.trim() !== '');

        if (lines.length < 2) {
          setLoading(false);
          return;
        }

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
          if (!name) continue; // Si no hay nombre, saltamos la fila

          const focusRaw = getValue('focus');
          const focusList = focusRaw ? focusRaw.split(';').map((f) => f.trim()).filter(Boolean) : [];

          fetchedSpecialties.push({
            id: getValue('id') || `spec-${i}`,
            name: name,
            areaColor: getValue('areacolor') || '#3B5B28', // Verde por defecto
            badgeLabel: getValue('badgelabel') || 'Atención Clínica',
            iconName: getValue('iconname') || 'Activity',
            shortDesc: getValue('shortdesc') || 'Atención integral y personalizada para mejorar tu bienestar.',
            focus: focusList.length > 0 ? focusList : ['Atención profesional', 'Evaluación clínica'],
            bookingUrl: getValue('bookingurl') || 'https://consultorio.me/pre/selectexternal/417602?external=true'
          });
        }

        if (fetchedSpecialties.length > 0) {
          setSpecialties(fetchedSpecialties);
        }
      } catch (err: any) {
        console.error('Error sincronizando Especialidades:', err);
        setError(err.message || 'Error al cargar especialidades');
      } finally {
        setLoading(false);
      }
    }

    loadSpecialties();
  }, [csvUrl]);

  return { specialties, loading, error };
}
