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

export function useProducts(csvUrlOrSheetId?: string) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(Boolean(csvUrlOrSheetId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!csvUrlOrSheetId) return;

    const url = csvUrlOrSheetId.startsWith('http')
      ? csvUrlOrSheetId
      : `https://docs.google.com/spreadsheets/d/${csvUrlOrSheetId}/gviz/tq?tqx=out:csv`;

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
  }, [csvUrlOrSheetId]);

  return { products, loading, error };
}
