'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ShoppingBag,
  Heart,
  Stethoscope,
  Baby,
  Sparkles,
  Activity,
  Bone,
  Flame,
  Brain,
  MessageSquare,
  Compass,
  Leaf,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Award,
  Search,
  ArrowRight,
  Info,
  Menu,
  Star,
  Users,
  Check,
  CreditCard,
  Building2,
  Sparkle
} from 'lucide-react';

/* ==========================================================================
   PRODUCT CATALOG (Structured for Google Sheets API / Firestore sync)
   ========================================================================== */
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

const PRODUCTS_DATABASE: Product[] = [
  {
    id: 'cola-de-pavo',
    name: 'Cola de Pavo (Trametes versicolor)',
    category: 'Hongos Adaptógenos',
    tagline: 'Inmunomodulador y soporte celular avanzado',
    description: 'Extracto estandarizado rico en polisacáridos PSP y PSK. Refuerza las defensas naturales y la microbiota intestinal.',
    benefits: ['Modula el sistema inmune', 'Rico en beta-glucanos bioactivos', 'Equilibrio de la microbiota'],
    normalPrice: 19000,
    salePrice: 14250,
    rating: 4.9,
    reviewsCount: 42,
    format: '60 Cápsulas (Extracto 10:1)',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-amber-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'berberina-500',
    name: 'Berberina HCl 500mg Premium',
    category: 'Salud Digestiva',
    tagline: 'Regulación metabólica y control de glucosa',
    description: 'Activador natural de la vía AMPK. Favorece la sensibilidad a la insulina, salud cardiovascular y equilibrio de la flora.',
    benefits: ['Optimiza metabolismo de glucosa', 'Apoyo en resistencia a insulina', 'Modula lípidos en sangre'],
    normalPrice: 22990,
    salePrice: 17240,
    rating: 5.0,
    reviewsCount: 68,
    format: '60 Cápsulas vegetales',
    badge: 'MÁS VENDIDO',
    colorScheme: { bg: 'from-emerald-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'melena-de-leon',
    name: 'Melena de León (Hericium erinaceus)',
    category: 'Hongos Adaptógenos',
    tagline: 'Neurogénesis, memoria y enfoque mental',
    description: 'Extracto de doble extracción con erinacinas y hericenonas. Estimula el Factor de Crecimiento Nervioso (NGF).',
    benefits: ['Estimula la memoria y foco', 'Neuroprotección cerebral', 'Eje intestino-cerebro'],
    normalPrice: 21990,
    salePrice: 16490,
    rating: 4.9,
    reviewsCount: 54,
    format: '60 Cápsulas de alta pureza',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-sky-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'reishi-lucidum',
    name: 'Reishi Rojo (Ganoderma lucidum)',
    category: 'Hongos Adaptógenos',
    tagline: 'El hongo de la longevidad y calma profunda',
    description: 'Adaptógeno por excelencia para regular el estrés crónico, mejorar el sueño profundo y modular la respuesta inflamatoria.',
    benefits: ['Sueño reparador y descanso', 'Adaptógeno antiestrés', 'Potente antioxidante'],
    normalPrice: 18900,
    salePrice: 14170,
    rating: 4.8,
    reviewsCount: 37,
    format: '60 Cápsulas vegetales',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-rose-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'cordyceps-sinensis',
    name: 'Cordyceps Militaris & Sinensis',
    category: 'Hongos Adaptógenos',
    tagline: 'Energía celular, resistencia y capacidad pulmonar',
    description: 'Mejora la producción de ATP intracelular y la oxigenación celular. Ideal para deportistas y fatiga crónica.',
    benefits: ['Aumenta niveles de energía (ATP)', 'Optimiza oxigenación celular', 'Vigor y vitalidad natural'],
    normalPrice: 20500,
    salePrice: 15370,
    rating: 4.9,
    reviewsCount: 29,
    format: '60 Cápsulas vegetales',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-orange-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'omega-3-ultra',
    name: 'Omega 3 Ultra Puro EPA 400 / DHA 300',
    category: 'Vitaminas & Minerales',
    tagline: 'Aceite de pescado destilado molecularmente',
    description: 'Certificación IFOS libre de metales pesados. Máxima concentración de ácidos grasos esenciales.',
    benefits: ['Salud cardiovascular y cerebral', 'Efecto antiinflamatorio sistémico', 'Sin regusto a pescado'],
    normalPrice: 19990,
    salePrice: 14990,
    rating: 5.0,
    reviewsCount: 81,
    format: '90 Softgels IFOS',
    badge: 'CALIDAD IFOS',
    colorScheme: { bg: 'from-blue-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'biotics-probioticos',
    name: 'Biotics Multi-Strain Probióticos Vivos',
    category: 'Salud Digestiva',
    tagline: '50 Billones UFC + Prebióticos FOS',
    description: '14 cepas probióticas microencapsuladas gastro-resistentes para restaurar la flora intestinal.',
    benefits: ['50 Billones de UFC activas', 'Reduce hinchazón y gases', 'Cápsula de liberación entérica'],
    normalPrice: 24500,
    salePrice: 18370,
    rating: 4.9,
    reviewsCount: 63,
    format: '30 Cápsulas entéricas',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-teal-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'magnesio-bisglicinato',
    name: 'Bisglicinato de Magnesio Quelado Puro',
    category: 'Vitaminas & Minerales',
    tagline: 'Máxima absorción sin molestias estomacales',
    description: 'Forma quelada de alta biodisponibilidad. Favorece la relajación muscular, sistema nervioso y buen descanso.',
    benefits: ['Relajación muscular y anti-calambres', 'Apoyo del sistema nervioso', 'No produce efecto laxante'],
    normalPrice: 17500,
    salePrice: 13120,
    rating: 5.0,
    reviewsCount: 94,
    format: '90 Cápsulas vegetales',
    badge: 'TOP CALIDAD',
    colorScheme: { bg: 'from-indigo-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  },
  {
    id: 'deshincha-formula',
    name: 'Deshincha: Fórmula Digestiva & Detox',
    category: 'Salud Digestiva',
    tagline: 'Enzimas digestivas, jengibre, hinojo y cúrcuma',
    description: 'Sinergia botánica y complejo multienzimático para aliviar pesadez y flatulencias de forma inmediata.',
    benefits: ['Alivio rápido de la hinchazón', 'Facilita digestión de comidas pesadas', '100% natural'],
    normalPrice: 16900,
    salePrice: 12670,
    rating: 4.8,
    reviewsCount: 47,
    format: '60 Cápsulas botánicas',
    badge: '25% DSCTO',
    colorScheme: { bg: 'from-lime-900/15 to-stone-100', badgeBg: 'bg-[#D4AF37] text-slate-950' }
  }
];

/* ==========================================================================
   11 MEDICAL SPECIALTIES DATA
   ========================================================================== */
export interface Specialty {
  id: string;
  name: string;
  areaColor: string;
  badgeLabel: string;
  iconName: string;
  shortDesc: string;
  focus: string[];
  professionals: string;
}

const SPECIALTIES_DATA: Specialty[] = [
  {
    id: 'medicina-general',
    name: 'Medicina General',
    areaColor: '#3B5B28',
    badgeLabel: 'Salud Primaria & Preventiva',
    iconName: 'Stethoscope',
    shortDesc: 'Evaluación clínica completa con mirada integrativa, diagnóstico oportuno, control crónico y prevención.',
    focus: ['Chequeo médico integral', 'Manejo de enfermedades crónicas', 'Interpretación de exámenes'],
    professionals: 'Dr. Rodrigo Morales & Dra. Camila Varas'
  },
  {
    id: 'pediatria',
    name: 'Pediatría',
    areaColor: '#C53030',
    badgeLabel: 'Educación & Infancia',
    iconName: 'Baby',
    shortDesc: 'Acompañamiento cálido en el desarrollo infantil, lactancia, inmunidad y nutrición infantil consciente.',
    focus: ['Control de niño sano', 'Desarrollo psicomotor y cognitivo', 'Inmunonutrición pediátrica'],
    professionals: 'Dra. Sofía Retamal (Pediatra Integrativa)'
  },
  {
    id: 'otomodelacion',
    name: 'Otomodelación',
    areaColor: '#805AD5',
    badgeLabel: 'Procedimiento Estético Avanzado',
    iconName: 'Sparkles',
    shortDesc: 'Técnica no quirúrgica para remodelar las orejas con resultados inmediatos y sin reposo prolongado.',
    focus: ['Armonización sin pabellón quirúrgico', 'Procedimiento ambulatorio seguro', 'Recuperación express'],
    professionals: 'Dr. Alejandro Peña (Especialista en Armonización)'
  },
  {
    id: 'quiropraxia',
    name: 'Quiropraxia',
    areaColor: '#DD6B20',
    badgeLabel: 'Columna & Sistema Nervioso',
    iconName: 'Activity',
    shortDesc: 'Ajustes biomecánicos de precisión para liberar interferencias vertebrales y aliviar dolores lumbares.',
    focus: ['Ajuste vertebral de columna', 'Alivio de ciática y lumbalgia', 'Postura y ergonomía corporal'],
    professionals: 'Klgo. Quiropráctico Felipe Araya'
  },
  {
    id: 'traumatologia',
    name: 'Traumatología',
    areaColor: '#2B6CB0',
    badgeLabel: 'Aparato Locomotor & Articulaciones',
    iconName: 'Bone',
    shortDesc: 'Diagnóstico y tratamiento de lesiones articulares, musculares, deportivas y rehabilitación osteoarticular.',
    focus: ['Dolor articular y tendinopatías', 'Lesiones de rodilla y hombro', 'Infiltraciones regenerativas'],
    professionals: 'Dr. Marcelo Silva (Traumatólogo)'
  },
  {
    id: 'estetica-no-invasiva',
    name: 'Estética No Invasiva',
    areaColor: '#D53F8C',
    badgeLabel: 'Rejuvenecimiento & Belleza Celular',
    iconName: 'Flame',
    shortDesc: 'Tratamientos dermocosméticos y bioestimuladores de colágeno para realzar la belleza natural.',
    focus: ['Bioestimuladores de colágeno', 'Higiene facial médica profunda', 'Tratamientos tensores'],
    professionals: 'Dra. Valentina Castro (Medicina Estética)'
  },
  {
    id: 'kinesiologia',
    name: 'Kinesiología',
    areaColor: '#319795',
    badgeLabel: 'Rehabilitación Funcional & Movimiento',
    iconName: 'Activity',
    shortDesc: 'Terapia física personalizada para reintegro deportivo, dolor crónico y acondicionamiento muscular.',
    focus: ['Kinesiología traumatológica', 'Reeducación postural global (RPG)', 'Terapia manual ortopédica'],
    professionals: 'Klga. María José Pizarro'
  },
  {
    id: 'psicologia',
    name: 'Psicología',
    areaColor: '#3182CE',
    badgeLabel: 'Salud Mental & Vínculo Emocional',
    iconName: 'Brain',
    shortDesc: 'Psicoterapia humanista e integrativa para adultos y adolescentes. Enfoque en trauma y ansiedad.',
    focus: ['Manejo de ansiedad y estrés', 'Terapia cognitivo-conductual & EMDR', 'Regulación emocional'],
    professionals: 'Ps. Daniela Navarrete & Ps. Gonzalo Pavez'
  },
  {
    id: 'fonoaudiologia',
    name: 'Fonoaudiología',
    areaColor: '#D69E2E',
    badgeLabel: 'Habla, Deglución & Comunicación',
    iconName: 'MessageSquare',
    shortDesc: 'Evaluación e intervención en habla, lenguaje infantil, deglución y salud vocal profesional.',
    focus: ['Trastornos del lenguaje y habla', 'Terapia miofuncional orofacial', 'Técnica vocal profesional'],
    professionals: 'Flga. Constanza Fuentes'
  },
  {
    id: 'terapia-ocupacional',
    name: 'Terapia Ocupacional',
    areaColor: '#2B6CB0',
    badgeLabel: 'Integración Sensorial & Autonomía',
    iconName: 'Compass',
    shortDesc: 'Intervención en integración sensorial (TEA/TDAH), adaptación funcional y fomento de autonomía.',
    focus: ['Integración sensorial pediátrica', 'Apoyo a familias TEA', 'Habilidades para la vida diaria'],
    professionals: 'T.O. Paulina Guzmán (Certificada en I.S.)'
  },
  {
    id: 'medicina-complementaria',
    name: 'Medicina Complementaria',
    areaColor: '#5B8246',
    badgeLabel: 'Acupuntura, Fitoterapia & Bioenergía',
    iconName: 'Leaf',
    shortDesc: 'Terapias ancestrales y basadas en evidencia para equilibrar energía vital y apoyar la sanación biológica.',
    focus: ['Acupuntura clínica milenaria', 'Fitoterapia médica y flores de Bach', 'Biomagnetismo holístico'],
    professionals: 'Terapeuta Marcela Rojas & Dr. Rodrigo Morales'
  }
];

/* ==========================================================================
   HERO SLIDER CONFIGURATION
   ========================================================================== */
interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaVariant: 'gold' | 'green';
  ctaAction: 'booking' | 'store';
  secondaryText: string;
  secondaryAction: 'specialties' | 'whatsapp';
  bgImage: string;
  badgeContent: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'centro-medico',
    tag: 'CENTRO MÉDICO INTEGRATIVO · LA SERENA',
    title: 'Salud Integrativa y Bienestar Integral en La Serena',
    subtitle: 'Tratamos la raíz del síntoma. 11 especialidades médicas y terapias regenerativas para cuidar de ti y tu familia.',
    ctaText: 'Agendar Hora Médica',
    ctaVariant: 'gold',
    ctaAction: 'booking',
    secondaryText: 'Ver 11 Especialidades',
    secondaryAction: 'specialties',
    bgImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80',
    badgeContent: '+15 Profesionales Acreditados · Fonasa & Isapres'
  },
  {
    id: 'tienda-suplementos',
    tag: 'BOTICA NATURAL & NUTRICIÓN CELULAR',
    title: 'Suplementación Natural y Hongos Adaptógenos',
    subtitle: 'Potencia tu energía, sueño y sistema inmune con Melena de León, Berberina, Reishi y más.',
    ctaText: 'Explorar Tienda de Suplementos',
    ctaVariant: 'green',
    ctaAction: 'store',
    secondaryText: 'Consultar por WhatsApp',
    secondaryAction: 'whatsapp',
    bgImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80',
    badgeContent: 'Extractos 100% Puros IFOS · Despacho Mismo Día'
  }
];

export default function AltavitaPage() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<'inicio' | 'especialidades' | 'tienda' | 'nosotros' | 'contacto'>('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hero Carousel State (Auto 5 seconds)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isSliderPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isSliderPaused]);

  // Cart State
  interface CartItem {
    product: Product;
    quantity: number;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingOption, setShippingOption] = useState<'pickup' | 'local' | 'national'>('pickup');
  const [cartNotification, setCartNotification] = useState<string | null>(null);

  // Product Store Filtering & Quick View
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Consultorio.me Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSpecialtyForBooking, setSelectedSpecialtyForBooking] = useState<string>('Medicina General');
  const [bookingStep, setBookingStep] = useState<'select' | 'form' | 'confirmed'>('select');
  const [bookingType, setBookingType] = useState<'presencial' | 'online'>('presencial');
  const [bookingDate, setBookingDate] = useState('2026-08-20');
  const [bookingTime, setBookingTime] = useState('10:30');
  const [patientData, setPatientData] = useState({ name: '', rut: '', phone: '', email: '', notes: '' });

  // Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');
  const [customerData, setCustomerData] = useState({ name: '', rut: '', phone: '', email: '', address: '', city: 'La Serena' });

  // Currency Formatter
  const formatCLP = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Cart Totals
  const cartItemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((total, item) => total + item.product.salePrice * item.quantity, 0), [cart]);
  const shippingCost = useMemo(() => {
    if (cart.length === 0) return 0;
    if (shippingOption === 'pickup') return 0;
    if (shippingOption === 'local') return 2500;
    return 4990;
  }, [cart, shippingOption]);
  const cartTotal = cartSubtotal + shippingCost;

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setCartNotification(`¡Añadiste "${product.name}" al carrito!`);
    setTimeout(() => setCartNotification(null), 3000);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATABASE.filter((product) => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const openBookingForSpecialty = (specialtyName: string) => {
    setSelectedSpecialtyForBooking(specialtyName);
    setBookingStep('select');
    setIsBookingModalOpen(true);
  };

  const generateWhatsAppOrderLink = () => {
    const phone = '56976766513';
    let text = `🌿 *¡Hola Altavita Salud Integrativa!* Quiero realizar un pedido:\n\n`;
    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}* x ${item.quantity} = ${formatCLP(item.product.salePrice * item.quantity)}\n`;
    });
    text += `\n📦 *Envío:* ${shippingOption === 'pickup' ? 'Retiro en Los Hibiscus 740 (Gratis)' : shippingOption === 'local' ? 'Despacho La Serena / Coquimbo ($2.500)' : 'Envío a Regiones ($4.990)'}`;
    text += `\n💰 *Total a pagar:* ${formatCLP(cartTotal)}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const renderSpecialtyIcon = (iconName: string, color: string) => {
    const props = { className: 'w-6 h-6', style: { color } };
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope {...props} />;
      case 'Baby': return <Baby {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Bone': return <Bone {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'MessageSquare': return <MessageSquare {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Leaf':
      default: return <Leaf {...props} />;
    }
  };

  return (
    <div id="altavita-app-root" className="min-h-screen bg-[#F8F8F4] text-[#22311D] flex flex-col antialiased">
      {/* Announcement Bar */}
      <div id="top-announcement-bar" className="bg-[#3B5B28] text-[#F8F8F4] text-xs py-2 px-4 border-b border-[#22311D]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Los Hibiscus 740, La Serena
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Lun a Vie 08:30 - 20:00 | Sáb 09:00 - 14:00
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <a
              id="top-whatsapp-link"
              href="https://wa.me/56976766513"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> +56 9 7676 6513
            </a>
            <span className="text-[#D4AF37]">|</span>
            <span className="bg-[#D4AF37] text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wide">
              CONSULTORIO.ME SYNC
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================================================
          NAVBAR
          ========================================================================== */}
      <header id="main-header" className="sticky top-0 z-40 bg-[#F8F8F4]/95 backdrop-blur-md border-b border-[#3B5B28]/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            id="brand-logo-container"
            onClick={() => {
              setActiveTab('inicio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B5B28] to-[#5B8246] p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#F8F8F4] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                  <path d="M50 20 C42 40, 20 50, 15 70 C28 78, 42 75, 50 82 C58 75, 72 78, 85 70 C80 50, 58 40, 50 20 Z" fill="#5B8246" opacity="0.9" />
                  <path d="M50 30 C45 46, 32 58, 30 72 C40 76, 50 78, 50 78 C50 78, 60 76, 70 72 C68 58, 55 46, 50 30 Z" fill="#3B5B28" />
                  <path d="M50 40 C47 52, 42 62, 50 72 C58 62, 53 52, 50 40 Z" fill="#D4AF37" />
                  <circle cx="50" cy="42" r="3" fill="#D4AF37" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#3B5B28] tracking-tight">Altavita</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#3B5B28] border border-[#D4AF37]/40 tracking-wider">La Serena</span>
              </div>
              <span className="text-[11px] font-medium tracking-widest text-[#5B8246] uppercase -mt-1 font-sans">Salud Integrativa</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav id="desktop-nav-menu" className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: 'inicio', label: 'Inicio' },
              { id: 'especialidades', label: 'Especialidades' },
              { id: 'tienda', label: 'Tienda de Suplementos' },
              { id: 'nosotros', label: 'Nosotros' },
              { id: 'contacto', label: 'Contacto' }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`nav-link-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  const el = document.getElementById(tab.id === 'inicio' ? 'hero-slider-section' : `${tab.id}-section`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'text-[#3B5B28] bg-[#5B8246]/15 font-bold shadow-xs'
                    : 'text-[#22311D]/80 hover:text-[#3B5B28] hover:bg-[#5B8246]/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              id="header-cta-agendar"
              onClick={() => {
                setSelectedSpecialtyForBooking('Medicina General');
                setBookingStep('select');
                setIsBookingModalOpen(true);
              }}
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c5a028] active:scale-95 text-slate-950 font-bold px-3.5 sm:px-5 py-2.5 rounded-xl shadow-md transition-all duration-150 text-xs sm:text-sm border border-[#b89528]"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span className="hidden xs:inline">Agendar Hora</span>
              <span className="xs:hidden">Agendar</span>
            </button>

            <button
              id="header-cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir Carrito"
              className="relative p-2.5 rounded-xl bg-white hover:bg-[#5B8246]/10 border border-[#3B5B28]/20 text-[#3B5B28] transition-all shadow-xs group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-2 -right-2 bg-[#D4AF37] text-slate-950 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#F8F8F4]"
                >
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#3B5B28] hover:bg-[#5B8246]/10 border border-[#3B5B28]/20"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#F8F8F4] border-b border-[#3B5B28]/20 px-4 pt-2 pb-5 space-y-1 shadow-lg"
            >
              {[
                { id: 'inicio', label: 'Inicio' },
                { id: 'especialidades', label: 'Especialidades Médicas (11)' },
                { id: 'tienda', label: 'Tienda de Suplementos' },
                { id: 'nosotros', label: 'Sobre Nosotros' },
                { id: 'contacto', label: 'Ubicación & Contacto' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                    const el = document.getElementById(item.id === 'inicio' ? 'hero-slider-section' : `${item.id}-section`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                    activeTab === item.id ? 'bg-[#3B5B28] text-white' : 'text-[#22311D] hover:bg-[#5B8246]/10'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {cartNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-4 z-50 bg-[#3B5B28] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#D4AF37]/50 max-w-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <p className="text-xs sm:text-sm font-medium">{cartNotification}</p>
            <button
              onClick={() => setIsCartOpen(true)}
              className="ml-auto underline text-xs font-bold text-[#D4AF37] hover:text-white"
            >
              Ver Carrito
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {/* ==========================================================================
            1. BANNER HERO DINÁMICO (SLIDER / CARROUSEL AUTOMÁTICO - 5 SEGUNDOS)
            ========================================================================== */}
        <section
          id="hero-slider-section"
          onMouseEnter={() => setIsSliderPaused(true)}
          onMouseLeave={() => setIsSliderPaused(false)}
          className="relative min-h-[560px] md:min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-[#22311D]"
        >
          {/* Carousel Slide Renderer */}
          <AnimatePresence mode="wait">
            {HERO_SLIDES.map((slide, index) => {
              if (index !== currentSlide) return null;
              return (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center"
                >
                  {/* High Quality Unsplash Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
                    style={{ backgroundImage: `url(${slide.bgImage})` }}
                  />

                  {/* Gradient Dark Overlay for Superior Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#22311D]/95 via-[#22311D]/80 to-[#22311D]/40 md:to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#22311D]/90 via-transparent to-[#22311D]/40" />

                  {/* Slide Content Container */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 md:py-24">
                    <div className="max-w-2xl sm:max-w-3xl space-y-5 sm:space-y-6 text-white">
                      {/* Eyebrow Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F8F8F4]">
                          {slide.tag}
                        </span>
                      </motion.div>

                      {/* Main Title */}
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F8F8F4] leading-[1.12]"
                      >
                        {slide.title}
                      </motion.h1>

                      {/* Subtitle */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl text-[#F8F8F4]/90 font-normal leading-relaxed max-w-2xl"
                      >
                        {slide.subtitle}
                      </motion.p>

                      {/* CTAs */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
                      >
                        {/* Primary Button */}
                        {slide.ctaVariant === 'gold' ? (
                          <button
                            id="hero-slide-gold-cta"
                            onClick={() => {
                              setSelectedSpecialtyForBooking('Medicina General');
                              setBookingStep('select');
                              setIsBookingModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-2.5 bg-[#D4AF37] hover:bg-[#c5a028] text-slate-950 font-bold px-7 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 text-sm sm:text-base border border-[#b89528] active:scale-98"
                          >
                            <Calendar className="w-5 h-5 text-slate-950" />
                            <span>{slide.ctaText}</span>
                          </button>
                        ) : (
                          <button
                            id="hero-slide-green-cta"
                            onClick={() => {
                              setActiveTab('tienda');
                              document.getElementById('tienda-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex items-center justify-center gap-2.5 bg-[#5B8246] hover:bg-[#4d703a] text-white font-bold px-7 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 text-sm sm:text-base border border-emerald-400/30 active:scale-98"
                          >
                            <ShoppingBag className="w-5 h-5 text-white" />
                            <span>{slide.ctaText}</span>
                          </button>
                        )}

                        {/* Secondary Button */}
                        {slide.secondaryAction === 'specialties' ? (
                          <button
                            id="hero-slide-sec-specialties"
                            onClick={() => {
                              setActiveTab('especialidades');
                              document.getElementById('especialidades-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md font-semibold px-6 py-4 rounded-xl border border-white/25 transition-all text-sm sm:text-base"
                          >
                            <span>{slide.secondaryText}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <a
                            id="hero-slide-sec-whatsapp"
                            href="https://wa.me/56976766513?text=Hola%20Altavita,%20quisiera%20consultar%20por%20suplementos%20y%20adaptógenos."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-white backdrop-blur-md font-semibold px-6 py-4 rounded-xl border border-[#25D366]/40 transition-all text-sm sm:text-base"
                          >
                            <Phone className="w-4 h-4 text-[#25D366]" />
                            <span>{slide.secondaryText}</span>
                          </a>
                        )}
                      </motion.div>

                      {/* Badge / Feature on Slide */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="pt-4 flex items-center gap-2 text-xs sm:text-sm text-[#D4AF37] font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        <span>{slide.badgeContent}</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            id="hero-slider-prev-btn"
            onClick={prevSlide}
            aria-label="Diapositiva Anterior"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#D4AF37] text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 shadow-lg group"
          >
            <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            id="hero-slider-next-btn"
            onClick={nextSlide}
            aria-label="Diapositiva Siguiente"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#D4AF37] text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 shadow-lg group"
          >
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Bottom Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                id={`hero-dot-indicator-${i}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Ir a Diapositiva ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-8 bg-[#D4AF37] shadow-md' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </section>

        {/* ==========================================================================
            2. SECCIÓN DUAL CARDS "ACCESOS DIRECTOS" (Estilo ViuClinic / KA Salud Integral)
            ========================================================================== */}
        <section id="dual-cards-section" className="py-12 md:py-16 bg-[#F8F8F4] -mt-6 sm:-mt-10 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Tarjeta 1: Centro Médico Integrativo */}
              <div
                id="dual-card-medico"
                onClick={() => {
                  setActiveTab('especialidades');
                  document.getElementById('especialidades-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#3B5B28]/20 flex flex-col justify-end p-6 sm:p-8"
              >
                {/* Background Image Unsplash */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1594824813571-28a778e709a3?auto=format&fit=crop&w=1200&q=80')`
                  }}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#22311D] via-[#22311D]/80 to-[#22311D]/30 transition-opacity group-hover:opacity-95" />

                {/* Content Overlay */}
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B5B28]/80 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Centro Médico Integrativo</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    Reserva tu atención presencial u online
                  </h3>

                  <p className="text-xs sm:text-sm text-[#F8F8F4]/80 line-clamp-2">
                    11 especialidades médicas, diagnóstico de raíz y planes interdisciplinarios en Los Hibiscus 740, La Serena.
                  </p>

                  <div className="pt-2">
                    <span
                      id="btn-card-especialidades"
                      className="inline-flex items-center gap-2 bg-[#D4AF37] text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md group-hover:bg-white transition-colors"
                    >
                      <span>Ver Especialidades y Agenda</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Tienda en Línea de Salud */}
              <div
                id="dual-card-tienda"
                onClick={() => {
                  setActiveTab('tienda');
                  document.getElementById('tienda-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#3B5B28]/20 flex flex-col justify-end p-6 sm:p-8"
              >
                {/* Background Image Unsplash */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80')`
                  }}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#22311D] via-[#22311D]/80 to-[#22311D]/30 transition-opacity group-hover:opacity-95" />

                {/* Content Overlay */}
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B8246]/80 text-[#F8F8F4] border border-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Tienda en Línea de Salud</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    Envíos a todo Chile y retiro en clínica
                  </h3>

                  <p className="text-xs sm:text-sm text-[#F8F8F4]/80 line-clamp-2">
                    Hongos adaptógenos puros, magnesio bisglicinato, probióticos y fórmulas magistrales con 25% DSCTO.
                  </p>

                  <div className="pt-2">
                    <span
                      id="btn-card-tienda"
                      className="inline-flex items-center gap-2 bg-[#5B8246] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition-colors"
                    >
                      <span>Comprar Suplementos</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            3. SECCIÓN DE ESPECIALIDADES MÉDICAS (11 ESPECIALIDADES)
            ========================================================================== */}
        <section id="especialidades-section" className="py-16 md:py-20 bg-[#F8F8F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B8246]/15 border border-[#3B5B28]/20 mb-3">
                <Leaf className="w-4 h-4 text-[#3B5B28]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B5B28]">
                  Equipo Multidisciplinario
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#22311D] font-bold tracking-tight mb-3">
                11 Especialidades Médicas e Integrativas
              </h2>
              <p className="text-sm sm:text-base text-[#22311D]/80">
                Atención clínica de excelencia y medicina regenerativa para recuperar el equilibrio celular y funcional.
              </p>
            </div>

            {/* Specialties Grid */}
            <div id="specialties-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {SPECIALTIES_DATA.map((specialty, idx) => (
                <div
                  key={specialty.id}
                  id={`specialty-card-${specialty.id}`}
                  className="group bg-white rounded-2xl p-6 border border-[#3B5B28]/15 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: specialty.areaColor }} />

                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${specialty.areaColor}15`, border: `1px solid ${specialty.areaColor}30` }}
                      >
                        {renderSpecialtyIcon(specialty.iconName, specialty.areaColor)}
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md text-right max-w-[130px]"
                        style={{ backgroundColor: `${specialty.areaColor}10`, color: specialty.areaColor }}
                      >
                        {specialty.badgeLabel}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold mb-2 tracking-tight" style={{ color: specialty.areaColor }}>
                      {idx + 1}. {specialty.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#22311D]/80 leading-relaxed mb-4">
                      {specialty.shortDesc}
                    </p>

                    <div className="space-y-1.5 mb-5 pt-3 border-t border-[#3B5B28]/10">
                      {specialty.focus.map((item, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-xs text-[#22311D]/75">
                          <Check className="w-3.5 h-3.5 shrink-0" style={{ color: specialty.areaColor }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#3B5B28]/10 space-y-3">
                    <div className="text-[11px] text-[#22311D]/70 font-medium">
                      <span className="font-semibold text-[#22311D]">Equipo: </span>
                      {specialty.professionals}
                    </div>

                    <button
                      id={`btn-agendar-specialty-${specialty.id}`}
                      onClick={() => openBookingForSpecialty(specialty.name)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs text-white"
                      style={{ backgroundColor: specialty.areaColor }}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Agendar {specialty.name}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            4. SECCIÓN CONSULTORIO.ME INTEGRACIÓN (NATIVE EMBED READY)
            ========================================================================== */}
        <section id="agendamiento-section" className="py-16 bg-white border-y border-[#3B5B28]/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-3">
                <Calendar className="w-4 h-4 text-[#3B5B28]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B5B28]">
                  Agendamiento Directo
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#22311D] font-bold tracking-tight mb-3">
                Plataforma de Reserva en Tiempo Real
              </h2>
              <p className="text-sm sm:text-base text-[#22311D]/80">
                Sincronización nativa con Consultorio.me. Reserva presencial en Los Hibiscus 740 o por Telemedicina con confirmación inmediata.
              </p>
            </div>

            <div
              id="consultorio-me-embed-container"
              className="bg-[#F8F8F4] rounded-3xl border-2 border-[#3B5B28]/20 shadow-xl overflow-hidden max-w-4xl mx-auto"
            >
              <div className="bg-[#3B5B28] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center text-slate-950 font-bold text-xs">
                    AV
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base leading-tight">
                      Altavita Salud Integrativa · Consultorio.me
                    </h3>
                    <p className="text-[11px] text-[#F8F8F4]/80">
                      Disponibilidad en directo · Los Hibiscus 740, La Serena
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs bg-[#22311D]/40 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-medium text-emerald-200">En línea</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-[#3B5B28]/15 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-[#3B5B28] tracking-wider">
                      Paso 1: Especialidad
                    </span>
                    <select
                      id="embed-specialty-selector"
                      value={selectedSpecialtyForBooking}
                      onChange={(e) => setSelectedSpecialtyForBooking(e.target.value)}
                      className="w-full bg-[#F8F8F4] border border-[#3B5B28]/20 rounded-lg p-2.5 text-xs font-bold text-[#22311D] focus:ring-2 focus:ring-[#3B5B28]"
                    >
                      {SPECIALTIES_DATA.map((sp) => (
                        <option key={sp.id} value={sp.name}>
                          {sp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#3B5B28]/15 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-[#3B5B28] tracking-wider">
                      Paso 2: Profesional
                    </span>
                    <div className="bg-[#F8F8F4] border border-[#3B5B28]/20 rounded-lg p-2.5 text-xs font-semibold text-[#22311D] flex items-center justify-between">
                      <span>Equipo Clínico Altavita</span>
                      <ShieldCheck className="w-4 h-4 text-[#3B5B28]" />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#3B5B28]/15 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-[#3B5B28] tracking-wider">
                      Paso 3: Modalidad
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingType('presencial')}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          bookingType === 'presencial' ? 'bg-[#3B5B28] text-white border-[#3B5B28]' : 'bg-[#F8F8F4] text-[#22311D]'
                        }`}
                      >
                        Presencial
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingType('online')}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          bookingType === 'online' ? 'bg-[#3B5B28] text-white border-[#3B5B28]' : 'bg-[#F8F8F4] text-[#22311D]'
                        }`}
                      >
                        Telemedicina
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#3B5B28]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase text-[#22311D] tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#D4AF37]" /> Horarios Disponibles esta semana:
                    </h4>
                    <span className="text-xs text-[#3B5B28] font-semibold">Chile (GMT-3)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                    {['09:00', '10:00', '11:30', '15:00', '16:30', '18:00'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setBookingTime(time);
                          setIsBookingModalOpen(true);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                          bookingTime === time
                            ? 'bg-[#D4AF37] text-slate-950 border-[#b89528] shadow-md scale-105'
                            : 'bg-[#F8F8F4] hover:bg-[#5B8246]/10 text-[#22311D] border-[#3B5B28]/20'
                        }`}
                      >
                        {time} hrs
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-xs text-[#22311D]/75 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#3B5B28] shrink-0" />
                    <span>Se enviará recordatorio automático por WhatsApp y Email.</span>
                  </div>
                  <button
                    id="btn-abrir-reserva-completa"
                    onClick={() => {
                      setBookingStep('select');
                      setIsBookingModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#c5a028] text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all border border-[#b89528] flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-slate-950" />
                    <span>Continuar con mi Reserva</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            5. TIENDA DIGITAL DE SUPLEMENTOS Y SALUD (E-COMMERCE)
            ========================================================================== */}
        <section id="tienda-section" className="py-16 md:py-24 bg-[#F8F8F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-3">
                <ShoppingBag className="w-4 h-4 text-[#3B5B28]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B5B28]">
                  Botica & Suplementación Natural
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#22311D] font-bold tracking-tight mb-3">
                Tienda de Suplementos y Adaptógenos
              </h2>
              <p className="text-base text-[#22311D]/80">
                Hongos adaptógenos de doble extracción, minerales quelados y fórmulas digestivas de pureza garantizada.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#3B5B28]/15 shadow-sm mb-10 space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-[#3B5B28] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="product-search-input"
                    type="text"
                    placeholder="Buscar Cola de Pavo, Berberina, Magnesio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F8F8F4] border border-[#3B5B28]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#22311D] placeholder:text-[#22311D]/50 focus:outline-none focus:ring-2 focus:ring-[#3B5B28]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#22311D]/50 hover:text-[#22311D]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
                  {['Todos', 'Hongos Adaptógenos', 'Vitaminas & Minerales', 'Salud Digestiva'].map((cat) => (
                    <button
                      key={cat}
                      id={`filter-category-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#3B5B28] text-white shadow-xs'
                          : 'bg-[#F8F8F4] hover:bg-[#5B8246]/10 text-[#22311D]/80 border border-[#3B5B28]/15'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#3B5B28]/15 space-y-4 max-w-md mx-auto">
                <Search className="w-10 h-10 text-[#3B5B28]/40 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#22311D]">No encontramos suplementos con ese término</h3>
                <p className="text-xs text-[#22311D]/70">
                  Prueba buscando por &quot;Berberina&quot;, &quot;Melena de León&quot; o &quot;Magnesio&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                  }}
                  className="bg-[#3B5B28] text-white font-bold text-xs px-4 py-2.5 rounded-xl"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div id="store-products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    id={`product-card-${product.id}`}
                    className="bg-white rounded-2xl border border-[#3B5B28]/15 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                  >
                    <div>
                      <div className={`relative h-48 bg-gradient-to-br ${product.colorScheme.bg} p-6 flex flex-col items-center justify-center border-b border-[#3B5B28]/10 overflow-hidden`}>
                        {product.badge && (
                          <div className="absolute top-3 left-3 bg-[#D4AF37] text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded-md shadow-md border border-[#b89528] tracking-wide">
                            {product.badge}
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-xs text-[#3B5B28] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#3B5B28]/20">
                          {product.format}
                        </div>

                        <div className="relative group-hover:scale-105 transition-transform duration-300">
                          <div className="w-20 h-28 rounded-2xl bg-gradient-to-b from-[#22311D] to-[#3B5B28] shadow-lg flex flex-col items-center justify-between p-2 border-2 border-[#D4AF37]/50 relative overflow-hidden">
                            <div className="w-10 h-3 rounded-t-md bg-[#D4AF37] border-b border-amber-800/40 -mt-2 shadow-xs" />
                            <div className="w-full bg-[#F8F8F4] rounded-md p-1 text-center shadow-xs">
                              <div className="w-3.5 h-3.5 mx-auto rounded-full bg-[#3B5B28] mb-0.5 flex items-center justify-center">
                                <Leaf className="w-2 h-2 text-[#D4AF37]" />
                              </div>
                              <p className="text-[7px] font-black uppercase text-[#22311D] truncate">
                                {product.name.split(' ')[0]}
                              </p>
                              <p className="text-[5px] font-semibold text-[#5B8246] uppercase">Altavita</p>
                            </div>
                            <div className="text-[6px] text-[#D4AF37] font-bold">100% PURO</div>
                          </div>
                        </div>

                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="absolute bottom-3 bg-white/90 hover:bg-white text-[#22311D] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        >
                          <Info className="w-3 h-3 text-[#3B5B28]" /> Ver detalles
                        </button>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-[#22311D]/60">
                          <span className="font-semibold text-[#5B8246]">{product.category}</span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-[10px] text-[#22311D]/40">({product.reviewsCount})</span>
                          </div>
                        </div>

                        <h3 className="font-serif font-bold text-lg text-[#22311D] leading-tight group-hover:text-[#3B5B28] transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[#22311D]/75 font-medium line-clamp-2">
                          {product.tagline}
                        </p>

                        <div className="space-y-1 pt-1">
                          {product.benefits.slice(0, 2).map((benefit, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-1.5 text-[11px] text-[#22311D]/80">
                              <Check className="w-3 h-3 text-[#3B5B28] shrink-0" />
                              <span className="truncate">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-[#3B5B28]/10 flex items-center justify-between mb-3">
                        <div>
                          <span className="text-xs text-[#22311D]/50 line-through block -mb-0.5">
                            {formatCLP(product.normalPrice)}
                          </span>
                          <span className="text-xl font-extrabold text-[#3B5B28]">
                            {formatCLP(product.salePrice)}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Ahorras {formatCLP(product.normalPrice - product.salePrice)}
                        </span>
                      </div>

                      <button
                        id={`btn-add-cart-${product.id}`}
                        onClick={() => addToCart(product)}
                        className="w-full bg-[#D4AF37] hover:bg-[#c5a028] text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 border border-[#b89528]"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-950" />
                        <span>Añadir al Carrito</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ==========================================================================
            NOSOTROS
            ========================================================================== */}
        <section id="nosotros-section" className="py-16 md:py-20 bg-white border-t border-[#3B5B28]/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B8246]/15 border border-[#3B5B28]/20">
                  <Heart className="w-4 h-4 text-[#3B5B28]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3B5B28]">Nuestra Filosofía</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#22311D] font-bold tracking-tight">
                  Medicina que Escucha, Integra y Sana Desde la Raíz
                </h2>
                <p className="text-sm sm:text-base text-[#22311D]/80 leading-relaxed">
                  En <strong>Altavita Salud Integrativa</strong> unimos la rigurosidad diagnóstica con terapias biológicas y suplementación de alta gama. Ubicados en Los Hibiscus 740, La Serena, acompañamos tu proceso de sanación integral.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#F8F8F4] p-3.5 rounded-xl border border-[#3B5B28]/15">
                    <h4 className="font-bold text-xs sm:text-sm text-[#3B5B28]">Atención Personalizada</h4>
                    <p className="text-[11px] sm:text-xs text-[#22311D]/75">Planes diseñados a la medida de tu bioquímica.</p>
                  </div>
                  <div className="bg-[#F8F8F4] p-3.5 rounded-xl border border-[#3B5B28]/15">
                    <h4 className="font-bold text-xs sm:text-sm text-[#3B5B28]">Infraestructura Cálida</h4>
                    <p className="text-[11px] sm:text-xs text-[#22311D]/75">Boxes modernos y cómodos en La Serena.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-3.5">
                {[
                  { title: '1. Diagnóstico Clínico Integrativo', desc: 'Indagamos en el historial completo, nutrición y biomarcadores.', color: '#3B5B28' },
                  { title: '2. Tratamiento Multidisciplinario', desc: 'Médicos, kinesiólogos y terapeutas coordinados.', color: '#5B8246' },
                  { title: '3. Suplementación Terapéutica', desc: 'Activos naturales de biodisponibilidad superior certificada.', color: '#D4AF37' }
                ].map((item, pIdx) => (
                  <div key={pIdx} className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F4] border border-[#3B5B28]/15 shadow-xs flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 text-xs"
                      style={{ backgroundColor: item.color === '#D4AF37' ? '#b89528' : item.color }}
                    >
                      ✓
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#22311D] mb-0.5">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-[#22311D]/80 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==========================================================================
          CARRITO DE COMPRAS SLIDE-OVER
          ========================================================================== */}
      <AnimatePresence>
        {isCartOpen && (
          <div id="cart-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-[#F8F8F4] shadow-2xl border-l border-[#3B5B28]/20 flex flex-col justify-between"
              >
                <div className="p-5 bg-white border-b border-[#3B5B28]/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#3B5B28]" />
                    <h3 className="font-serif font-bold text-lg text-[#22311D]">Tu Carrito ({cartItemCount})</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <ShoppingBag className="w-12 h-12 text-[#3B5B28]/40 mx-auto" />
                      <h4 className="font-serif font-bold text-base text-[#22311D]">Tu carrito está vacío</h4>
                      <p className="text-xs text-[#22311D]/70 max-w-xs mx-auto">
                        Descubre nuestros hongos adaptógenos y suplementos certificados para comenzar tu compra.
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        id={`cart-item-${item.product.id}`}
                        className="bg-white p-3.5 rounded-xl border border-[#3B5B28]/15 shadow-xs flex items-center justify-between gap-3"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#5B8246]/10 flex items-center justify-center shrink-0">
                          <Leaf className="w-5 h-5 text-[#3B5B28]" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#22311D] truncate">{item.product.name}</h4>
                          <p className="text-[10px] text-[#5B8246] font-medium">{formatCLP(item.product.salePrice)} c/u</p>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-5 h-5 rounded bg-[#F8F8F4] border flex items-center justify-center text-xs font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-[#22311D] px-1">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="w-5 h-5 rounded bg-[#F8F8F4] border flex items-center justify-center text-xs font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end justify-between self-stretch">
                          <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-extrabold text-[#3B5B28]">
                            {formatCLP(item.product.salePrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-5 bg-white border-t border-[#3B5B28]/15 space-y-4">
                    <div className="space-y-1.5 text-xs">
                      <label className="text-[10px] font-bold uppercase text-[#22311D]/70 block">Método de Entrega:</label>
                      <label className="flex items-center justify-between p-2 rounded-lg bg-[#F8F8F4] border cursor-pointer">
                        <span className="flex items-center gap-2">
                          <input type="radio" name="shipping" checked={shippingOption === 'pickup'} onChange={() => setShippingOption('pickup')} />
                          <span>Retiro en Los Hibiscus 740 (Gratis)</span>
                        </span>
                        <span className="font-bold text-emerald-700">GRATIS</span>
                      </label>
                      <label className="flex items-center justify-between p-2 rounded-lg bg-[#F8F8F4] border cursor-pointer">
                        <span className="flex items-center gap-2">
                          <input type="radio" name="shipping" checked={shippingOption === 'local'} onChange={() => setShippingOption('local')} />
                          <span>Despacho La Serena / Coquimbo</span>
                        </span>
                        <span className="font-bold text-[#22311D]">{formatCLP(2500)}</span>
                      </label>
                    </div>

                    <div className="space-y-1 pt-1 border-t text-xs">
                      <div className="flex justify-between text-[#22311D]/70">
                        <span>Subtotal:</span>
                        <span>{formatCLP(cartSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[#22311D]/70">
                        <span>Envío:</span>
                        <span>{shippingCost === 0 ? 'Gratis' : formatCLP(shippingCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-[#22311D] pt-1">
                        <span>Total:</span>
                        <span className="text-[#3B5B28]">{formatCLP(cartTotal)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        id="btn-mercadopago-checkout"
                        onClick={() => {
                          setIsCartOpen(false);
                          setCheckoutStep('form');
                          setIsCheckoutModalOpen(true);
                        }}
                        className="w-full bg-[#009EE3] hover:bg-[#0087c2] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pagar con MercadoPago</span>
                      </button>

                      <a
                        id="btn-whatsapp-checkout"
                        href={generateWhatsAppOrderLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Pedir por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================================================
          MODAL: AGENDAMIENTO CONSULTORIO.ME
          ========================================================================== */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div id="booking-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#3B5B28]/20 z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37] flex items-center justify-center text-slate-950 font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#22311D]">Reserva de Hora Médica</h3>
                    <p className="text-[11px] text-[#5B8246]">Altavita · Los Hibiscus 740</p>
                  </div>
                </div>
                <button onClick={() => setIsBookingModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {bookingStep === 'select' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#22311D]/80 mb-1">Especialidad:</label>
                    <select
                      value={selectedSpecialtyForBooking}
                      onChange={(e) => setSelectedSpecialtyForBooking(e.target.value)}
                      className="w-full bg-[#F8F8F4] border rounded-xl p-2.5 font-bold text-[#22311D]"
                    >
                      {SPECIALTIES_DATA.map((sp) => (
                        <option key={sp.id} value={sp.name}>{sp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#22311D]/80 mb-1">Modalidad:</label>
                      <select
                        value={bookingType}
                        onChange={(e) => setBookingType(e.target.value as any)}
                        className="w-full bg-[#F8F8F4] border rounded-xl p-2 font-bold text-[#22311D]"
                      >
                        <option value="presencial">Presencial</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-[#22311D]/80 mb-1">Fecha:</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-[#F8F8F4] border rounded-xl p-2 font-bold text-[#22311D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#22311D]/80 mb-2">Horarios Disponibles:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['09:00', '10:00', '11:30', '15:00', '16:30', '18:00', '19:00', '19:30'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBookingTime(time)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            bookingTime === time
                              ? 'bg-[#D4AF37] text-slate-950 border-[#b89528]'
                              : 'bg-[#F8F8F4] text-[#22311D]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingStep('form')}
                    className="w-full bg-[#3B5B28] text-white font-bold py-3 rounded-xl text-xs sm:text-sm mt-2"
                  >
                    Continuar con mis Datos
                  </button>
                </div>
              )}

              {bookingStep === 'form' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBookingStep('confirmed');
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="p-2.5 bg-[#5B8246]/10 rounded-xl text-[#3B5B28] font-semibold flex justify-between">
                    <span>{selectedSpecialtyForBooking} · {bookingDate} {bookingTime} hrs</span>
                    <button type="button" onClick={() => setBookingStep('select')} className="underline text-[#D4AF37]">Cambiar</button>
                  </div>

                  <div>
                    <label className="block font-bold text-[#22311D]/80 mb-1">Nombre Completo:</label>
                    <input
                      required
                      type="text"
                      placeholder="Carolina Rojas"
                      value={patientData.name}
                      onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                      className="w-full bg-[#F8F8F4] border rounded-xl p-2 text-[#22311D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#22311D]/80 mb-1">RUT:</label>
                      <input
                        required
                        type="text"
                        placeholder="12.345.678-9"
                        value={patientData.rut}
                        onChange={(e) => setPatientData({ ...patientData, rut: e.target.value })}
                        className="w-full bg-[#F8F8F4] border rounded-xl p-2 text-[#22311D]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#22311D]/80 mb-1">WhatsApp:</label>
                      <input
                        required
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={patientData.phone}
                        onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                        className="w-full bg-[#F8F8F4] border rounded-xl p-2 text-[#22311D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#22311D]/80 mb-1">Correo:</label>
                    <input
                      required
                      type="email"
                      placeholder="correo@ejemplo.cl"
                      value={patientData.email}
                      onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                      className="w-full bg-[#F8F8F4] border rounded-xl p-2 text-[#22311D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#D4AF37] hover:bg-[#c5a028] text-slate-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm mt-3"
                  >
                    Confirmar Agendamiento
                  </button>
                </form>
              )}

              {bookingStep === 'confirmed' && (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-[#22311D]">¡Hora Agendada con Éxito!</h3>
                  <p className="text-xs text-[#22311D]/75">
                    Te enviamos la confirmación al correo {patientData.email || 'registrado'}. Te esperamos en Los Hibiscus 740, La Serena.
                  </p>
                  <button
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setBookingStep('select');
                    }}
                    className="bg-[#3B5B28] text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================================================
          MODAL: CHECKOUT MERCADOPAGO SIMULADO
          ========================================================================== */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div id="checkout-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCheckoutModalOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#009EE3] text-white font-bold flex items-center justify-center text-xs">MP</div>
                  <h3 className="font-serif font-bold text-base text-[#22311D]">MercadoPago Seguro</h3>
                </div>
                <button onClick={() => setIsCheckoutModalOpen(false)}><X className="w-4 h-4 text-stone-400" /></button>
              </div>

              {checkoutStep === 'form' ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCheckoutStep('success');
                    setCart([]);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div className="bg-[#F8F8F4] p-3 rounded-xl flex justify-between font-bold">
                    <span>Total a Pagar:</span>
                    <span className="text-sm text-[#3B5B28]">{formatCLP(cartTotal)}</span>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Nombre Completo:</label>
                    <input required type="text" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} className="w-full bg-[#F8F8F4] border rounded-xl p-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">RUT:</label>
                      <input required type="text" value={customerData.rut} onChange={(e) => setCustomerData({ ...customerData, rut: e.target.value })} className="w-full bg-[#F8F8F4] border rounded-xl p-2" />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Teléfono:</label>
                      <input required type="tel" value={customerData.phone} onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })} className="w-full bg-[#F8F8F4] border rounded-xl p-2" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Dirección de Despacho:</label>
                    <input required type="text" value={customerData.address} onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })} className="w-full bg-[#F8F8F4] border rounded-xl p-2" />
                  </div>

                  <button type="submit" className="w-full bg-[#009EE3] text-white font-extrabold py-3 rounded-xl shadow-md text-xs sm:text-sm mt-2">
                    Pagar {formatCLP(cartTotal)} con Webpay
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-[#22311D]">¡Pago Aprobado!</h3>
                  <p className="text-xs text-[#22311D]/75">Recibirás el código de seguimiento por correo y WhatsApp.</p>
                  <button onClick={() => setIsCheckoutModalOpen(false)} className="bg-[#3B5B28] text-white font-bold px-5 py-2 rounded-xl text-xs">
                    Cerrar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================================================
          MODAL: QUICK VIEW PRODUCTO
          ========================================================================== */}
      <AnimatePresence>
        {quickViewProduct && (
          <div id="quickview-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickViewProduct(null)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#5B8246] uppercase">{quickViewProduct.category}</span>
                  <h3 className="font-serif font-bold text-lg text-[#22311D]">{quickViewProduct.name}</h3>
                </div>
                <button onClick={() => setQuickViewProduct(null)}><X className="w-4 h-4 text-stone-400" /></button>
              </div>

              <p className="text-xs text-[#22311D]/80">{quickViewProduct.description}</p>

              <div className="bg-[#F8F8F4] p-3.5 rounded-xl space-y-1.5 border border-[#3B5B28]/15">
                <h4 className="text-[11px] font-bold uppercase text-[#3B5B28]">Beneficios Clave:</h4>
                {quickViewProduct.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#22311D]/80">
                    <Check className="w-3.5 h-3.5 text-[#3B5B28] shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-[#22311D]/50 line-through block">{formatCLP(quickViewProduct.normalPrice)}</span>
                  <span className="text-xl font-black text-[#3B5B28]">{formatCLP(quickViewProduct.salePrice)}</span>
                </div>
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="bg-[#D4AF37] hover:bg-[#c5a028] text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
                  <span>Añadir</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================================================
          FOOTER CORPORATIVO Y CONTACTO
          ========================================================================== */}
      <footer id="contacto-section" className="bg-[#22311D] text-[#F8F8F4] pt-16 pb-12 border-t border-[#3B5B28]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B8246] to-[#D4AF37] p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-[#22311D] rounded-[10px] flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                </div>
                <span className="font-serif font-bold text-2xl text-white tracking-tight">Altavita</span>
              </div>
              <p className="text-xs sm:text-sm text-[#F8F8F4]/80 leading-relaxed">
                Centro médico y botica de salud integrativa en La Serena, Chile. Unimos la rigurosidad clínica moderna con la sabiduría de la medicina natural.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  id="footer-instagram-link"
                  href="https://instagram.com/altavitasalud"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Altavita"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-slate-950 text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  id="footer-facebook-link"
                  href="https://facebook.com/altavitasalud"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Altavita"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-slate-950 text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  id="footer-whatsapp-btn"
                  href="https://wa.me/56976766513"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Altavita"
                  className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center transition-transform hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-serif font-bold text-base text-[#D4AF37]">Especialidades</h4>
              <ul className="space-y-1.5 text-xs text-[#F8F8F4]/80">
                {SPECIALTIES_DATA.slice(0, 6).map((sp) => (
                  <li key={sp.id}>
                    <button onClick={() => openBookingForSpecialty(sp.name)} className="hover:text-[#D4AF37] transition-colors text-left">
                      • {sp.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <h4 className="font-serif font-bold text-base text-[#D4AF37]">Contacto & Ubicación</h4>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#F8F8F4]/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <strong className="block text-white font-semibold">Dirección:</strong>
                    <span>Los Hibiscus 740, La Serena, Región de Coquimbo, Chile.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <strong className="block text-white font-semibold">Teléfono / WhatsApp:</strong>
                    <a href="https://wa.me/56976766513" className="hover:text-[#D4AF37] underline">
                      +56 9 7676 6513
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <strong className="block text-white font-semibold">Correo Oficial:</strong>
                    <a href="mailto:altavita.integrativa@gmail.com" className="hover:text-[#D4AF37] underline">
                      altavita.integrativa@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <strong className="block text-white font-semibold">Horario:</strong>
                    <span>Lun a Vie: 08:30 a 20:00 hrs | Sáb: 09:00 a 14:00 hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F8F4]/60">
            <p>© {new Date().getFullYear()} Altavita Salud Integrativa. Todos los derechos reservados.</p>
            <p className="text-center sm:text-right font-medium">
              Desarrollado por <span className="text-[#D4AF37] font-bold">PáginasPro.cl</span> | <span className="text-white">Vango SpA</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
