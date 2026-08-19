'use client';

import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  category: 'Hongos Adaptógenos' | 'Vitaminas & Minerales' | 'Salud Digestiva';
  tagline: string;
  description: string;
  benefits: string[];
  normalPrice: number;
  salePrice: number;
  rating: number;
  reviewsCount: number;
  format: string;
  badge?: string;
  colorScheme: {
    bg: string;
    badgeBg: string;
  };
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'cola-de-pavo',
    name: 'Cola de Pavo Extracto 30ml',
    category: 'Hongos Adaptógenos',
    tagline: 'Concentración 3:1 · Inmunomodulador y salud intestinal',
    description: 'Extracto líquido concentrado de Trametes versicolor. Refuerza las defensas naturales y equilibra la microbiota.',
    benefits: ['Acción inmunomoduladora', 'Apoyo prebiótico natural', 'Equilibrio biológico interno'],
    normalPrice: 18990,
    salePrice: 14250,
    rating: 4.9,
    reviewsCount: 42,
    format: 'Gotario 30 ml',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-amber-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'cordyceps-militaris',
    name: 'Cordyceps Militaris Extracto 30ml',
    category: 'Hongos Adaptógenos',
    tagline: 'Concentración 3:1 · Energía celular y vitalidad',
    description: 'Incremente la energía física, resistencia e inmunidad sin sobreestimular el sistema nervioso.',
    benefits: ['Aumenta niveles de energía (ATP)', 'Mayor resistencia física', 'Mejora la vitalidad'],
    normalPrice: 18990,
    salePrice: 14250,
    rating: 4.9,
    reviewsCount: 31,
    format: 'Gotario 30 ml',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-orange-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'melena-de-leon-gotas',
    name: 'Melena de León Extracto 30ml',
    category: 'Hongos Adaptógenos',
    tagline: 'Concentración 3:1 · Neurogénesis y claridad mental',
    description: 'Estimula el sistema nervioso, mejorando la concentración, memoria y el enfoque diario.',
    benefits: ['Estimula la memoria y foco', 'Soporte del sistema nervioso', 'Claridad mental'],
    normalPrice: 18990,
    salePrice: 14250,
    rating: 5.0,
    reviewsCount: 58,
    format: 'Gotario 30 ml',
    badge: 'MÁS VENDIDO',
    colorScheme: { bg: 'from-sky-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'reishi-gotas',
    name: 'Reishi Extracto 30ml',
    category: 'Hongos Adaptógenos',
    tagline: 'Concentración 3:1 · Calma profunda y sueño reparador',
    description: 'Reduce el cortisol, equilibra las hormonas y disminuye la ansiedad para mejorar el descanso nocturno.',
    benefits: ['Reduce el cortisol y estrés', 'Disminuye la ansiedad', 'Mejora la calidad del sueño'],
    normalPrice: 18990,
    salePrice: 14250,
    rating: 4.8,
    reviewsCount: 39,
    format: 'Gotario 30 ml',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-purple-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'melena-gomitas',
    name: 'Melena de León Gomitas',
    category: 'Hongos Adaptógenos',
    tagline: 'Enfoque y salud cerebral en formato masticable',
    description: '30 gomitas de delicioso sabor natural para potenciar la función cognitiva de forma práctica.',
    benefits: ['Formato práctico y delicioso', 'Soporte neuroprotector', 'Enfoque diario'],
    normalPrice: 18990,
    salePrice: 14250,
    rating: 4.9,
    reviewsCount: 27,
    format: 'Frasco 30 Gomitas',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-rose-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'berberina-60',
    name: 'Berberina 60 Cápsulas',
    category: 'Salud Digestiva',
    tagline: 'Regulación metabólica y equilibrio de glucosa',
    description: 'Favorece la sensibilidad a la insulina, modula el metabolismo lipídico y apoya el equilibrio intestinal.',
    benefits: ['Control natural de glucosa', 'Optimiza metabolismo', 'Equilibrio de microbiota'],
    normalPrice: 18990,
    salePrice: 14240,
    rating: 5.0,
    reviewsCount: 64,
    format: '60 Cápsulas',
    badge: 'DESTACADO',
    colorScheme: { bg: 'from-emerald-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'biotics-60',
    name: 'Biotics Probióticos Multi-Cepa',
    category: 'Salud Digestiva',
    tagline: 'Restaura y fortalece la flora intestinal',
    description: 'Cepas seleccionadas para combatir la hinchazón, mejorar la digestión y reforzar las defensas.',
    benefits: ['Reduce pesantez y gases', 'Fortalece la flora bacteriana', 'Alta absorción'],
    normalPrice: 22990,
    salePrice: 17240,
    rating: 4.9,
    reviewsCount: 51,
    format: '60 Cápsulas',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-teal-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'deshincha-60',
    name: 'Deshincha Fórmula Digestiva',
    category: 'Salud Digestiva',
    tagline: 'Alivio rápido de la pesantez e hinchazón abdominal',
    description: 'Fórmula especializada que actúa sobre el segundo cerebro para combatir el estreñimiento y la digestión lenta.',
    benefits: ['Alivio de la hinchazón', 'Mejora el tránsito intestinal', 'Bienestar digestivo diario'],
    normalPrice: 22990,
    salePrice: 17250,
    rating: 4.8,
    reviewsCount: 46,
    format: '60 Cápsulas',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-lime-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'bisglicinato-magnesio',
    name: 'Bisglicinato de Magnesio 60 Cápsulas',
    category: 'Vitaminas & Minerales',
    tagline: 'Alta biodisponibilidad para relajación y descanso',
    description: 'Forma quelada de magnesio de máxima absorción que no causa molestias digestivas.',
    benefits: ['Relajación muscular profunda', 'Apoyo del sistema nervioso', 'Sin efecto laxante'],
    normalPrice: 10990,
    salePrice: 8240,
    rating: 5.0,
    reviewsCount: 88,
    format: '60 Cápsulas',
    badge: 'EXCELENTE PRECIO',
    colorScheme: { bg: 'from-indigo-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'citrato-magnesio',
    name: 'Magnesio Citrato 60 Cápsulas',
    category: 'Vitaminas & Minerales',
    tagline: 'Energía muscular y prevención de calambres',
    description: 'Citrato de magnesio puro para respaldar la función muscular y ósea diaria.',
    benefits: ['Soporte muscular activo', 'Combate la fatiga', 'Fácil asimilación'],
    normalPrice: 8990,
    salePrice: 6740,
    rating: 4.7,
    reviewsCount: 33,
    format: '60 Cápsulas',
    badge: 'OFERTA',
    colorScheme: { bg: 'from-blue-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'melena-magnesio-combo',
    name: 'Melena de León + Magnesio 60 Cápsulas',
    category: 'Hongos Adaptógenos',
    tagline: 'Sinergia perfecta para sistema nervioso y enfoque',
    description: 'Combinación balanceada de Melena de León con Magnesio para un soporte cognitivo y relajación integral.',
    benefits: ['Doble acción focalizada', 'Protección neuronal', 'Rendimiento equilibrado'],
    normalPrice: 14990,
    salePrice: 11240,
    rating: 4.9,
    reviewsCount: 41,
    format: '60 Cápsulas',
    badge: 'COMBO ESPECIAL',
    colorScheme: { bg: 'from-[#3B5B28]/20 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'omega-3-60',
    name: 'Omega 3 1430mg (EPA/DHA)',
    category: 'Vitaminas & Minerales',
    tagline: 'Salud cardiovascular, cerebral y articular',
    description: 'Concentración óptima de ácidos grasos esenciales para cuidar tu corazón, visión y articulaciones.',
    benefits: ['Protección cardiovascular', 'Soporte de visión y cerebro', 'Antiinflamatorio natural'],
    normalPrice: 19990,
    salePrice: 14990,
    rating: 5.0,
    reviewsCount: 72,
    format: '60 Cápsulas Softgel',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-cyan-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'omega-3-premium-fnl',
    name: 'Omega 3 Premium 1200mg FNL',
    category: 'Vitaminas & Minerales',
    tagline: 'EPA 800mg + DHA 400mg de alta pureza',
    description: 'Fórmula ultra concentrada para máxima protección neurológica y de articulaciones.',
    benefits: ['Alta dosis EPA/DHA', 'Pureza garantizada', 'Sin regusto'],
    normalPrice: 16900,
    salePrice: 12740,
    rating: 4.9,
    reviewsCount: 29,
    format: '60 Cápsulas FNL',
    badge: 'PREMIUM',
    colorScheme: { bg: 'from-blue-900/20 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'vitamina-c-1000',
    name: 'Vitamina C 1000mg 90 Cápsulas',
    category: 'Vitaminas & Minerales',
    tagline: 'Potente antioxidante y refuerzo del colágeno',
    description: 'Apoyo inmunológico diario que favorece la síntesis de colágeno y la absorción de hierro.',
    benefits: ['Defensas reforzadas', 'Protección antioxidante', 'Rinde 3 meses'],
    normalPrice: 12990,
    salePrice: 9740,
    rating: 4.8,
    reviewsCount: 35,
    format: '90 Cápsulas',
    badge: 'FORMATO AHORRO',
    colorScheme: { bg: 'from-amber-800/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'african-root',
    name: 'African Root Suplemento',
    category: 'Salud Digestiva',
    tagline: 'Extracto natural de Laboratorio FNL',
    description: 'Fórmula botánica tradicional orientada al equilibrio digestivo y depuración orgánica.',
    benefits: ['Extracto botánico puro', 'Soporte digestivo', 'Calidad FNL'],
    normalPrice: 12990,
    salePrice: 9740,
    rating: 4.7,
    reviewsCount: 19,
    format: 'Frasco FNL',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-green-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'lactasa-60',
    name: 'Lactasa Enzima Digestiva',
    category: 'Salud Digestiva',
    tagline: 'Digestión sin molestias de lácteos y derivados',
    description: 'Enzima lactasa para prevenir hinchazón y molestias ante el consumo de alimentos con lactosa.',
    benefits: ['Prevención de intolerancia', 'Digestión liviana', 'Efecto inmediato'],
    normalPrice: 10990,
    salePrice: 8240,
    rating: 4.9,
    reviewsCount: 22,
    format: '60 Cápsulas',
    badge: 'ENZIMAS',
    colorScheme: { bg: 'from-stone-800/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'triple-magnesio',
    name: 'Triple Magnesio Complejo Avanzado',
    category: 'Vitaminas & Minerales',
    tagline: 'Sinergia de 3 formas de magnesio biodisponible',
    description: 'Complejo de alta fidelidad que reúne Citrato, Bisglicinato y Malato para cobertura muscular, cerebral y energética.',
    benefits: ['Triple acción quelada', 'Máximo rendimiento celular', 'Soporte integral'],
    normalPrice: 27990,
    salePrice: 20990,
    rating: 5.0,
    reviewsCount: 48,
    format: 'Frasco Complejo',
    badge: 'FÓRMULA TOP',
    colorScheme: { bg: 'from-violet-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
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

export function useProducts(sheetId?: string) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(Boolean(sheetId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sheetId) return;

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al conectar con Google Sheets');

        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/).filter((l) => l.trim() !== '');

        if (lines.length < 2) {
          setLoading(false);
          return;
        }

        const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
        const fetchedProducts: Product[] = [];

        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          if (row.length < 3) continue;

          const getValue = (key: string) => {
            const idx = headers.indexOf(key.toLowerCase());
            return idx !== -1 && row[idx] ? row[idx] : '';
          };

          const name = getValue('name');
          if (!name) continue;

          const catRaw = getValue('category');
          let category: Product['category'] = 'Hongos Adaptógenos';
          if (catRaw.includes('Vit') || catRaw.includes('Min')) category = 'Vitaminas & Minerales';
          else if (catRaw.includes('Dig') || catRaw.includes('Salud')) category = 'Salud Digestiva';

          const benefitsRaw = getValue('benefits');
          const benefits = benefitsRaw ? benefitsRaw.split(';').map((b) => b.trim()) : ['100% Natural'];

          fetchedProducts.push({
            id: getValue('id') || `sheet-prod-${i}`,
            name,
            category,
            tagline: getValue('tagline') || 'Suplemento Terapéutico',
            description: getValue('description') || name,
            benefits,
            normalPrice: parseInt(getValue('normalprice').replace(/\D/g, ''), 10) || 0,
            salePrice: parseInt(getValue('saleprice').replace(/\D/g, ''), 10) || 0,
            rating: 5.0,
            reviewsCount: 25 + i * 2,
            format: getValue('format') || 'Frasco',
            badge: getValue('badge') || undefined,
            colorScheme: {
              bg: category === 'Hongos Adaptógenos' ? 'from-amber-900/15 to-stone-100' : 'from-emerald-900/15 to-stone-100',
              badgeBg: 'bg-[#D4AF37] text-slate-950'
            }
          });
        }

        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        }
      } catch (err: any) {
        console.error('Error sincronizando con Google Sheets:', err);
        setError(err.message || 'Error al cargar productos');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [sheetId]);

  return { products, loading, error };
}
