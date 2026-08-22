'use client';

import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  category: 'Hongos Adaptógenos' | 'Vitaminas & Minerales' | 'Salud Digestiva' | string;
  tagline: string;
  description: string;
  benefits: string[];
  normalPrice: number;
  salePrice: number;
  rating: number;
  reviewsCount: number;
  format: string;
  badge?: string;
  imageUrl?: string;
  images: string[];
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
    imageUrl: 'https://i.ibb.co/0pQKyhVH/Cola-de-Pavo.png',
    images: ['https://i.ibb.co/0pQKyhVH/Cola-de-Pavo.png'],
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
    imageUrl: 'https://i.ibb.co/WNc4hJPm/Berberina.png',
    images: ['https://i.ibb.co/WNc4hJPm/Berberina.png'],
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

          const getValue = (...keys: string[]) => {
            for (const key of keys) {
              const idx = headers.indexOf(key.toLowerCase());
              if (idx !== -1 && row[idx]) return row[idx];
            }
            return '';
          };

          const name = getValue('nombre', 'name');
          if (!name) continue;

          const catRaw = getValue('categoría', 'categoria', 'category');
          let category = catRaw || 'Hongos Adaptógenos';
          if (catRaw.includes('Vit') || catRaw.includes('Min')) category = 'Vitaminas & Minerales';
          else if (catRaw.includes('Dig') || catRaw.includes('Salud')) category = 'Salud Digestiva';

          const benefitsRaw = getValue('beneficios', 'benefits');
          const benefits = benefitsRaw ? benefitsRaw.split(';').map((b) => b.trim()) : ['100% Natural'];

          const normalPriceStr = getValue('precio normal', 'precionormal', 'normalprice').replace(/\D/g, '');
          const salePriceStr = getValue('precio oferta', 'preciooferta', 'saleprice').replace(/\D/g, '');
          const normalPrice = parseInt(normalPriceStr, 10) || 0;
          const salePrice = parseInt(salePriceStr, 10) || normalPrice;

          const img1 = getValue('imagen 1', 'imagen1', 'imageurl', 'image') || '';
          const img2 = getValue('imagen 2', 'imagen2', 'imageurl2') || '';
          const img3 = getValue('imagen 3', 'imagen3', 'imageurl3') || '';
          const img4 = getValue('imagen 4', 'imagen4', 'imageurl4') || '';
          const img5 = getValue('imagen 5', 'imagen5', 'imageurl5') || '';

          const allImages = [img1, img2, img3, img4, img5].filter((u) => u && u.length > 5);

          fetchedProducts.push({
            id: getValue('id') || `sheet-prod-${i}`,
            name,
            category,
            tagline: getValue('lema', 'tagline') || 'Suplemento Terapéutico',
            description: getValue('descripción', 'descripcion', 'description') || name,
            benefits,
            normalPrice,
            salePrice,
            rating: 5.0,
            reviewsCount: 25 + i * 2,
            format: getValue('formato', 'format') || 'Unidad',
            badge: getValue('etiqueta', 'insignia', 'badge') || undefined,
            imageUrl: allImages[0] || undefined,
            images: allImages,
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
