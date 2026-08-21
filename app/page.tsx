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
  Search,
  ArrowRight,
  Menu,
  Star,
  Check,
  CreditCard,
  Building2,
  RefreshCw,
  Info
} from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useSpecialties } from '@/hooks/useSpecialties';

const PUBLISHED_PRODUCTS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtWN_WHgGLgiuDzvGgFr1QiC4Og4MrJDOhaS6VpOKuOkF6B7SxJ9U_7FplBtdvA-iiqJeW8hjprvbj/pub?output=csv&gid=0';
const PUBLISHED_SPECIALTIES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtWN_WHgGLgiuDzvGgFr1QiC4Og4MrJDOhaS6VpOKuOkF6B7SxJ9U_7FplBtdvA-iiqJeW8hjprvbj/pub?output=csv&gid=1840435494';
const DEFAULT_BOOKING_URL = 'https://consultorio.me/pre/selectexternal/417602?external=true';

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
    title: 'Salud Integrativa y Bienestar en La Serena',
    subtitle: 'Atención médica especializada, 11 especialidades clínicas y terapias complementarias para cuidar de ti.',
    ctaText: 'Agendar Hora Médica',
    ctaVariant: 'gold',
    ctaAction: 'booking',
    secondaryText: 'Ver 11 Especialidades',
    secondaryAction: 'specialties',
    bgImage: '/recepcion.jpg',
    badgeContent: 'Los Hibiscus 740, La Serena · Reserva Online 24/7'
  },
  {
    id: 'boxes-clinicos',
    tag: 'BOXES MÉDICOS EQUIPADOS · LA SERENA',
    title: 'Espacios Diseñados para tu Comodidad y Sanación',
    subtitle: 'Instalaciones modernas y climatizadas diseñadas para brindarte una atención médica humana y confortable.',
    ctaText: 'Agendar Consulta',
    ctaVariant: 'gold',
    ctaAction: 'booking',
    secondaryText: 'Conocer Especialidades',
    secondaryAction: 'specialties',
    bgImage: '/box-1.jpg',
    badgeContent: 'Atención Profesional · Los Hibiscus 740'
  },
  {
    id: 'pediatria-familiar',
    tag: 'PEDIATRÍA & INTEGRACIÓN SENSORIAL',
    title: 'Cuidado Cálido y Especializado para tus Hijos',
    subtitle: 'Boxes equipados para el desarrollo infantil, control de niño sano y terapias de integración sensorial.',
    ctaText: 'Agendar Hora Pediátrica',
    ctaVariant: 'gold',
    ctaAction: 'booking',
    secondaryText: 'Ver Especialidades',
    secondaryAction: 'specialties',
    bgImage: '/box-2.jpg',
    badgeContent: 'Atención Pediátrica · Desarrollo e Integración'
  },
  {
    id: 'tienda-suplementos',
    tag: 'TIENDA DE SUPLEMENTOS & ADAPTÓGENOS',
    title: 'Suplementación Natural y Hongos Adaptógenos',
    subtitle: 'Potencia tu energía, sueño y sistema digestivo con Melena de León, Berberina, Reishi y Magnesio.',
    ctaText: 'Explorar Tienda de Suplementos',
    ctaVariant: 'green',
    ctaAction: 'store',
    secondaryText: 'Consultar por WhatsApp',
    secondaryAction: 'whatsapp',
    bgImage: '/gotarios-portada.jpg',
    badgeContent: 'Descuento del 25% · Envíos y retiro en clínica'
  }
];

export default function AltavitaPage() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'especialidades' | 'tienda' | 'nosotros' | 'contacto'>('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { products: PRODUCTS_DATABASE, loading: productsLoading } = useProducts(PUBLISHED_PRODUCTS_CSV_URL);
  const { specialties: SPECIALTIES_DATA, loading: specialtiesLoading } = useSpecialties(PUBLISHED_SPECIALTIES_CSV_URL);

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

  interface CartItem {
    product: Product;
    quantity: number;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingOption, setShippingOption] = useState<'pickup' | 'local' | 'national'>('pickup');
  const [cartNotification, setCartNotification] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeModalImgIndex, setActiveModalImgIndex] = useState<number>(0);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSpecialtyForBooking, setSelectedSpecialtyForBooking] = useState<string>('Medicina General');
  const [selectedSpecialtyBookingUrl, setSelectedSpecialtyBookingUrl] = useState<string>(DEFAULT_BOOKING_URL);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');
  const [customerData, setCustomerData] = useState({ name: '', rut: '', phone: '', email: '', address: '', city: 'La Serena' });

  const formatCLP = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const cartItemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((total, item) => total + item.product.salePrice * item.quantity, 0), [cart]);
  const shippingCost = useMemo(() => {
    if (cart.length === 0) return 0;
    if (shippingOption === 'pickup') return 0;
    if (shippingOption === 'local') return 2500;
    return 4990;
  }, [cart, shippingOption]);
  const cartTotal = cartSubtotal + shippingCost;

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
    setCartNotification(`Añadido: "${product.name}"`);
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

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATABASE.filter((product) => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [PRODUCTS_DATABASE, selectedCategory, searchQuery]);

  const openBookingForSpecialty = (specialtyName: string, bookingUrl?: string) => {
    setSelectedSpecialtyForBooking(specialtyName);
    setSelectedSpecialtyBookingUrl(bookingUrl || DEFAULT_BOOKING_URL);
    setIsBookingModalOpen(true);
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setActiveModalImgIndex(0);
  };

  const generateWhatsAppOrderLink = () => {
    const phone = '56976766513';
    let text = `🌿 *¡Hola Altavita Salud Integrativa!* Quisiera realizar un pedido:\n\n`;
    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}* x ${item.quantity} = ${formatCLP(item.product.salePrice * item.quantity)}\n`;
    });
    text += `\n📦 *Entrega:* ${shippingOption === 'pickup' ? 'Retiro en Los Hibiscus 740' : shippingOption === 'local' ? 'Despacho La Serena / Coquimbo' : 'Envío a Regiones'}`;
    text += `\n💰 *Total:* ${formatCLP(cartTotal)}`;
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
    <div id="altavita-app-root" className="min-h-screen bg-[#F8F8F4] text-[#22311D] flex flex-col antialiased font-sans">
      
      {/* TOP ANNOUNCEMENT BAR */}
      <div id="top-announcement-bar" className="bg-[#3B5B28] text-[#F8F8F4] text-xs py-2 px-4 border-b border-[#22311D]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Los Hibiscus 740, La Serena
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> Lun a Vie 08:30 - 20:00 | Sáb 09:00 - 14:00
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              id="top-whatsapp-link"
              href="https://wa.me/56976766513"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> +56 9 7676 6513
            </a>
            
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/20">
              <a
                href="https://instagram.com/altavitasalud"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Altavita"
                className="hover:text-[#D4AF37] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com/altavitasalud"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Altavita"
                className="hover:text-[#D4AF37] transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header id="main-header" className="sticky top-0 z-40 bg-[#F8F8F4]/95 backdrop-blur-md border-b border-[#3B5B28]/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div
            id="brand-logo-container"
            onClick={() => {
              setActiveTab('inicio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 bg-white border border-[#D4AF37]/40 shadow-xs shrink-0">
              <img
                src="/logo.png"
                alt="Altavita Salud Integrativa Logo"
                className="w-full h-full object-contain p-0.5"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-2xl sm:text-3xl text-[#b89528] tracking-tight">AltaVita</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#3B5B28] border border-[#D4AF37]/40 tracking-wider">
                  La Serena
                </span>
              </div>
              <span className="text-[11px] font-bold tracking-widest text-[#5B8246] uppercase -mt-0.5 font-sans">
                SALUD INTEGRATIVA
              </span>
            </div>
          </div>

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

          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              id="header-cta-agendar"
              onClick={() => openBookingForSpecialty('Medicina General')}
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
        
        {/* HERO SLIDER */}
        <section
          id="hero-slider-section"
          onMouseEnter={() => setIsSliderPaused(true)}
          onMouseLeave={() => setIsSliderPaused(false)}
          className="relative min-h-[560px] md:min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-[#22311D]"
        >
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
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
                    style={{ backgroundImage: `url(${slide.bgImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#22311D]/95 via-[#22311D]/80 to-[#22311D]/40 md:to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#22311D]/90 via-transparent to-[#22311D]/40" />

                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 md:py-24">
                    <div className="max-w-2xl sm:max-w-3xl space-y-5 sm:space-y-6 text-white">
                      
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

                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F8F8F4] leading-[1.12]"
                      >
                        {slide.title}
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-sm sm:text-base md:text-lg lg:text-xl text-[#F8F8F4]/90 font-normal leading-relaxed max-w-2xl"
                      >
                        {slide.subtitle}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
                      >
                        {slide.ctaVariant === 'gold' ? (
                          <button
                            id="hero-slide-gold-cta"
                            onClick={() => openBookingForSpecialty('Medicina General')}
                            className="flex items-center justify-center gap-2.5 bg-[#D4AF37] hover:bg-[#c5a028] text-slate-950 font-bold px-7 py-4 rounded-xl shadow-xl transition-all duration-200 text-sm sm:text-base border border-[#b89528] active:scale-98"
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
                            className="flex items-center justify-center gap-2.5 bg-[#5B8246] hover:bg-[#4d703a] text-white font-bold px-7 py-4 rounded-xl shadow-xl transition-all duration-200 text-sm sm:text-base border border-emerald-400/30 active:scale-98"
                          >
                            <ShoppingBag className="w-5 h-5 text-white" />
                            <span>{slide.ctaText}</span>
                          </button>
                        )}

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

          <button
            id="hero-slider-prev-btn"
            onClick={prevSlide}
            aria-label="Anterior"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#D4AF37] text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 shadow-lg group"
          >
            <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            id="hero-slider-next-btn"
            onClick={nextSlide}
            aria-label="Siguiente"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#D4AF37] text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center transition-all border border-white/20 shadow-lg group"
          >
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                id={`hero-dot-indicator-${i}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Diapositiva ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-8 bg-[#D4AF37] shadow-md' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </section>

        {/* DUAL CARDS */}
        <section id="dual-cards-section" className="py-12 md:py-16 bg-[#F8F8F4] -mt-6 sm:-mt-10 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              
              <div
                id="dual-card-medico"
                onClick={() => {
                  setActiveTab('especialidades');
                  document.getElementById('especialidades-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#3B5B28]/20 flex flex-col justify-end p-6 sm:p-8"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('/sala-espera-1.jpg')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#22311D] via-[#22311D]/80 to-[#22311D]/30 transition-opacity group-hover:opacity-95" />

                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B5B28]/80 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Centro Médico Integrativo</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    Reserva tu atención médica presencial u online
                  </h3>

                  <p className="text-xs sm:text-sm text-[#F8F8F4]/80 line-clamp-2">
                    11 especialidades médicas en Los Hibiscus 740, La Serena. Conexión directa con sistema de agenda Consultorio.me.
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

              <div
                id="dual-card-tienda"
                onClick={() => {
                  setActiveTab('tienda');
                  document.getElementById('tienda-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative min-h-[300px] sm:min-h-[360px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#3B5B28]/20 flex flex-col justify-end p-6 sm:p-8"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('/frascos-compra.jpg')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#22311D] via-[#22311D]/80 to-[#22311D]/30 transition-opacity group-hover:opacity-95" />

                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B8246]/80 text-[#F8F8F4] border border-white/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Tienda en Línea de Salud</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                    Suplementación y Hongos Adaptógenos
                  </h3>

                  <p className="text-xs sm:text-sm text-[#F8F8F4]/80 line-clamp-2">
                    Cola de Pavo, Melena de León, Berberina, Reishi y Magnesio. Retiro en clínica o despacho directo.
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

        {/* ESPECIALIDADES */}
        <section id="especialidades-section" className="py-16 md:py-20 bg-[#F8F8F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B8246]/15 border border-[#3B5B28]/20 mb-3">
                <Leaf className="w-4 h-4 text-[#3B5B28]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B5B28]">
                  Atención Integral
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#22311D] font-bold tracking-tight mb-3">
                11 Especialidades Médicas e Integrativas
              </h2>
              <p className="text-sm sm:text-base text-[#22311D]/80">
                Selecciona la especialidad de tu interés para reservar hora de atención en tiempo real.
              </p>
            </div>

            {specialtiesLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <RefreshCw className="w-8 h-8 text-[#3B5B28] animate-spin" />
                <p className="text-xs font-semibold text-[#3B5B28]">Cargando equipo médico en vivo desde Google Sheets...</p>
              </div>
            ) : (
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

                    <div className="pt-4 border-t border-[#3B5B28]/10">
                      <button
                        id={`btn-agendar-specialty-${specialty.id}`}
                        onClick={() => openBookingForSpecialty(specialty.name, specialty.bookingUrl)}
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
            )}
          </div>
        </section>

        {/* CONSULTORIO.ME EMBEDDED CON FOTO DE CLÍNICA */}
        <section id="agendamiento-section" className="py-16 bg-white border-y border-[#3B5B28]/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-3">
                <Calendar className="w-4 h-4 text-[#3B5B28]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B5B28]">
                  Reserva Online
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#22311D] font-bold tracking-tight mb-3">
                Agenda tu Consulta Médica
              </h2>
              <p className="text-sm sm:text-base text-[#22311D]/80">
                Selecciona la especialidad de atención para ingresar directamente al sistema de reservas de Altavita Salud Integrativa.
              </p>
            </div>

            <div
              id="consultorio-me-embed-container"
              className="bg-[#F8F8F4] rounded-3xl border-2 border-[#3B5B28]/20 shadow-xl overflow-hidden max-w-4xl mx-auto"
            >
              <div
                className="bg-cover bg-center text-white px-6 py-6 flex flex-wrap items-center justify-between gap-3 relative"
                style={{ backgroundImage: `linear-gradient(to right, rgba(34, 49, 29, 0.92), rgba(59, 91, 40, 0.85)), url('/box-3.jpg')` }}
              >
                <div className="flex items-center gap-3.5 z-10">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-md">
                    AV
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg leading-tight">
                      Altavita Salud Integrativa
                    </h3>
                    <p className="text-xs text-[#F8F8F4]/80">
                      Los Hibiscus 740, La Serena · Atención Presencial & Telemedicina
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs bg-black/40 px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-xs z-10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-medium text-emerald-200">Agenda Activa</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-[#3B5B28]/15 space-y-2">
                    <label className="text-[10px] font-bold uppercase text-[#3B5B28] tracking-wider block">
                      Seleccionar Especialidad:
                    </label>
                    <select
                      id="embed-specialty-selector"
                      value={selectedSpecialtyForBooking}
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        setSelectedSpecialtyForBooking(selectedName);
                        const sp = SPECIALTIES_DATA.find((s) => s.name === selectedName);
                        setSelectedSpecialtyBookingUrl(sp?.bookingUrl || DEFAULT_BOOKING_URL);
                      }}
                      className="w-full bg-[#F8F8F4] border border-[#3B5B28]/20 rounded-lg p-2.5 text-xs font-bold text-[#22311D] focus:ring-2 focus:ring-[#3B5B28]"
                    >
                      {SPECIALTIES_DATA.map((sp) => (
                        <option key={sp.id} value={sp.name}>
                          {sp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#3B5B28]/15 space-y-2 flex flex-col justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#3B5B28] tracking-wider block">
                      Centro de Atención:
                    </span>
                    <div className="bg-[#F8F8F4] border border-[#3B5B28]/20 rounded-lg p-2.5 text-xs font-semibold text-[#22311D] flex items-center justify-between">
                      <span>Los Hibiscus 740, La Serena</span>
                      <ShieldCheck className="w-4 h-4 text-[#3B5B28]" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#3B5B28]/10">
                  <div className="text-xs text-[#22311D]/75 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#3B5B28] shrink-0" />
                    <span>Confirmación e información de cita directa por correo/WhatsApp.</span>
                  </div>
                  <button
                    id="btn-abrir-reserva-completa"
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#c5a028] text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all border border-[#b89528] flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-slate-950" />
                    <span>Abrir Agenda ({selectedSpecialtyForBooking})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TIENDA DIGITAL */}
        <section id="tienda-section" className="py-16 md:py-24 bg-[#F8F8F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-3">
                <ShoppingBag className="w-4 h-4 text-[#3B5B28]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3B5B28]">
                  Catálogo Sincronizado en Vivo
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#22311D] font-bold tracking-tight mb-3">
                Tienda de Suplementos y Adaptógenos
              </h2>
              <p className="text-base text-[#22311D]/80">
                Línea completa de hongos adaptógenos, minerales quelados y fórmulas digestivas de alta calidad.
              </p>
            </div>

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

            {productsLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <RefreshCw className="w-8 h-8 text-[#3B5B28] animate-spin" />
                <p className="text-xs font-semibold text-[#3B5B28]">Cargando catálogo en vivo desde Google Sheets...</p>
              </div>
            )}

            {!productsLoading && filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#3B5B28]/15 space-y-4 max-w-md mx-auto">
                <Search className="w-10 h-10 text-[#3B5B28]/40 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#22311D]">No encontramos suplementos</h3>
                <p className="text-xs text-[#22311D]/70">
                  Intenta buscando por término como &quot;Melena de León&quot; o &quot;Omega 3&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                  }}
                  className="bg-[#3B5B28] text-white font-bold text-xs px-4 py-2.5 rounded-xl"
                >
                  Ver todos los productos
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
                      <div
                        onClick={() => openQuickView(product)}
                        className={`relative h-64 bg-gradient-to-br ${product.colorScheme.bg} p-4 flex flex-col items-center justify-center border-b border-[#3B5B28]/10 overflow-hidden cursor-pointer`}
                      >
                        {product.badge && (
                          <div className="absolute top-3 left-3 bg-[#D4AF37] text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded-md shadow-md border border-[#b89528] tracking-wide z-10">
                            {product.badge}
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-xs text-[#3B5B28] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#3B5B28]/20 z-10">
                          {product.format}
                        </div>

                        <div className="relative w-full h-52 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-md"
                            />
                          ) : (
                            <div className="w-24 h-32 rounded-2xl bg-gradient-to-b from-[#22311D] to-[#3B5B28] shadow-lg flex flex-col items-center justify-between p-2.5 border-2 border-[#D4AF37]/50 relative overflow-hidden">
                              <div className="w-12 h-3.5 rounded-t-md bg-[#D4AF37] border-b border-amber-800/40 -mt-2.5 shadow-xs" />
                              <div className="w-full bg-[#F8F8F4] rounded-md p-1.5 text-center shadow-xs">
                                <div className="w-4 h-4 mx-auto rounded-full bg-[#3B5B28] mb-0.5 flex items-center justify-center">
                                  <Leaf className="w-2.5 h-2.5 text-[#D4AF37]" />
                                </div>
                                <p className="text-[8px] font-black uppercase text-[#22311D] truncate">
                                  {product.name.split(' ')[0]}
                                </p>
                                <p className="text-[6px] font-semibold text-[#5B8246] uppercase">Altavita</p>
                              </div>
                              <div className="text-[7px] text-[#D4AF37] font-bold">100% PURO</div>
                            </div>
                          )}
                        </div>
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

                        <h3
                          onClick={() => openQuickView(product)}
                          className="font-serif font-bold text-lg text-[#22311D] leading-tight hover:text-[#3B5B28] transition-colors cursor-pointer"
                        >
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
                          {product.normalPrice > product.salePrice && (
                            <span className="text-xs text-[#22311D]/50 line-through block -mb-0.5">
                              {formatCLP(product.normalPrice)}
                            </span>
                          )}
                          <span className="text-xl font-extrabold text-[#3B5B28]">
                            {formatCLP(product.salePrice)}
                          </span>
                        </div>
                        {product.normalPrice > product.salePrice && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Ahorras {formatCLP(product.normalPrice - product.salePrice)}
                          </span>
                        )}
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

        {/* NOSOTROS */}
        <section id="nosotros-section" className="py-16 md:py-20 bg-white border-t border-[#3B5B28]/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B8246]/15 border border-[#3B5B28]/20">
                  <Heart className="w-4 h-4 text-[#3B5B28]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3B5B28]">Nuestra Misión</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#22311D] font-bold tracking-tight">
                  Atención Integral y Suplementación de Alta Calidad
                </h2>
                <p className="text-sm sm:text-base text-[#22311D]/80 leading-relaxed">
                  En <strong>Altavita Salud Integrativa</strong> unimos la atención médica en nuestras 11 especialidades con la suplementación natural y hongos adaptógenos de alta pureza. Estamos ubicados en Los Hibiscus 740, La Serena.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#F8F8F4] p-3.5 rounded-xl border border-[#3B5B28]/15">
                    <h4 className="font-bold text-xs sm:text-sm text-[#3B5B28]">Atención Profesional</h4>
                    <p className="text-[11px] sm:text-xs text-[#22311D]/75">Atención presencial y vía telemedicina.</p>
                  </div>
                  <div className="bg-[#F8F8F4] p-3.5 rounded-xl border border-[#3B5B28]/15">
                    <h4 className="font-bold text-xs sm:text-sm text-[#3B5B28]">Centro Médico</h4>
                    <p className="text-[11px] sm:text-xs text-[#22311D]/75">Ubicado en Los Hibiscus 740, La Serena.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-3.5">
                {[
                  { title: '1. Agendamiento Transparente', desc: 'Reserva tu hora médica con confirmación inmediata.', color: '#3B5B28' },
                  { title: '2. Equipo Multidisciplinario', desc: 'Médicos y profesionales de la salud capacitados.', color: '#5B8246' },
                  { title: '3. Productos de Salud', desc: 'Línea de suplementos e hidratación biológica seleccionada.', color: '#D4AF37' }
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

      {/* CARRITO SLIDE-OVER */}
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
                        Agrega suplementos de nuestro catálogo para continuar con la compra.
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        id={`cart-item-${item.product.id}`}
                        className="bg-white p-3.5 rounded-xl border border-[#3B5B28]/15 shadow-xs flex items-center justify-between gap-3"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#5B8246]/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <Leaf className="w-5 h-5 text-[#3B5B28]" />
                          )}
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
                          <span>Retiro en Los Hibiscus 740</span>
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

      {/* MODAL CONSULTORIO.ME */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div id="booking-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBookingModalOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-[#3B5B28]/20 z-10 overflow-hidden"
            >
              <div className="bg-[#3B5B28] text-white p-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif font-bold text-base">Agendamiento · {selectedSpecialtyForBooking}</h3>
                </div>
                <button onClick={() => setIsBookingModalOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-2 sm:p-4 bg-[#F8F8F4] h-[500px]">
                <iframe
                  src={selectedSpecialtyBookingUrl || DEFAULT_BOOKING_URL}
                  title="Agendamiento Altavita Consultorio.me"
                  className="w-full h-full border-0 rounded-2xl"
                  allow="payment"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CHECKOUT */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div id="checkout-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCheckoutModalOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#009EE3] text-white font-bold flex items-center justify-center text-xs">MP</div>
                  <h3 className="font-serif font-bold text-base text-[#22311D]">MercadoPago Pago Seguro</h3>
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
                  <h3 className="font-serif text-lg font-bold text-[#22311D]">¡Pago Procesado!</h3>
                  <p className="text-xs text-[#22311D]/75">Tu comprobante ha sido registrado con éxito.</p>
                  <button onClick={() => setIsCheckoutModalOpen(false)} className="bg-[#3B5B28] text-white font-bold px-5 py-2 rounded-xl text-xs">
                    Cerrar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL QUICK VIEW (Marco de visualización estricto sin deformaciones ni recortes) */}
      <AnimatePresence>
        {quickViewProduct && (
          <div id="quickview-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickViewProduct(null)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6">
              
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#5B8246] uppercase tracking-wider">{quickViewProduct.category}</span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#22311D]">{quickViewProduct.name}</h3>
                </div>
                <button onClick={() => setQuickViewProduct(null)} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="relative w-full aspect-square bg-[#F8F8F4] rounded-2xl border border-[#3B5B28]/15 flex items-center justify-center p-4 overflow-hidden select-none">
                    {quickViewProduct.badge && (
                      <div className="absolute top-3 left-3 bg-[#D4AF37] text-slate-950 font-extrabold text-[10px] px-2.5 py-1 rounded-md shadow-xs border border-[#b89528] z-10">
                        {quickViewProduct.badge}
                      </div>
                    )}

                    {quickViewProduct.images && quickViewProduct.images.length > 0 ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          key={activeModalImgIndex}
                          src={quickViewProduct.images[activeModalImgIndex] || quickViewProduct.images[0]}
                          alt={quickViewProduct.name}
                          className="w-full h-full object-contain rounded-lg drop-shadow-md transition-all duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-28 rounded-2xl bg-gradient-to-b from-[#22311D] to-[#3B5B28] shadow-lg flex flex-col items-center justify-between p-2 border-2 border-[#D4AF37]/50 relative overflow-hidden">
                        <div className="w-10 h-3 rounded-t-md bg-[#D4AF37] border-b border-amber-800/40 -mt-2 shadow-xs" />
                        <div className="w-full bg-[#F8F8F4] rounded-md p-1 text-center shadow-xs">
                          <div className="w-3.5 h-3.5 mx-auto rounded-full bg-[#3B5B28] mb-0.5 flex items-center justify-center">
                            <Leaf className="w-2 h-2 text-[#D4AF37]" />
                          </div>
                          <p className="text-[7px] font-black uppercase text-[#22311D] truncate">{quickViewProduct.name.split(' ')[0]}</p>
                        </div>
                      </div>
                    )}

                    {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveModalImgIndex((prev) => (prev - 1 + quickViewProduct.images.length) % quickViewProduct.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#22311D] p-1.5 rounded-full shadow-md transition-all z-10"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveModalImgIndex((prev) => (prev + 1) % quickViewProduct.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#22311D] p-1.5 rounded-full shadow-md transition-all z-10"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-center">
                      {quickViewProduct.images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveModalImgIndex(idx)}
                          className={`w-12 h-12 rounded-lg border-2 overflow-hidden transition-all bg-[#F8F8F4] flex items-center justify-center shrink-0 ${
                            activeModalImgIndex === idx ? 'border-[#3B5B28] shadow-xs scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt=""
                            className="w-full h-full object-contain p-0.5"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-[#22311D]/80 leading-relaxed font-medium">{quickViewProduct.description}</p>

                  <div className="bg-[#F8F8F4] p-3.5 rounded-xl space-y-1.5 border border-[#3B5B28]/15">
                    <h4 className="text-[11px] font-bold uppercase text-[#3B5B28] tracking-wider">Beneficios Principales:</h4>
                    {quickViewProduct.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#22311D]/85">
                        <Check className="w-3.5 h-3.5 text-[#3B5B28] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#3B5B28]/10 flex items-center justify-between">
                    <div>
                      {quickViewProduct.normalPrice > quickViewProduct.salePrice && (
                        <span className="text-xs text-[#22311D]/50 line-through block">{formatCLP(quickViewProduct.normalPrice)}</span>
                      )}
                      <span className="text-2xl font-black text-[#3B5B28]">{formatCLP(quickViewProduct.salePrice)}</span>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="bg-[#D4AF37] hover:bg-[#c5a028] text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 border border-[#b89528]"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-950" />
                      <span>Añadir al Carrito</span>
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER CORPORATIVO */}
      <footer id="contacto-section" className="bg-[#22311D] text-[#F8F8F4] pt-16 pb-12 border-t border-[#3B5B28]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-white p-1 border-2 border-[#D4AF37] shrink-0 shadow-md">
                  <img
                    src="/logo.png"
                    alt="Altavita Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-3xl text-[#D4AF37] tracking-tight">AltaVita</span>
                  <span className="text-xs font-bold tracking-widest text-[#5B8246] uppercase font-sans">
                    SALUD INTEGRATIVA
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#F8F8F4]/80 leading-relaxed">
                Centro médico y botica de salud integrativa en La Serena, Chile. Atención clínica en 11 especialidades y suplementación natural.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  id="footer-instagram-link"
                  href="https://instagram.com/altavitasalud"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-slate-950 text-white flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  id="footer-facebook-link"
                  href="https://facebook.com/altavitasalud"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-slate-950 text-white flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  id="footer-whatsapp-btn"
                  href="https://wa.me/56976766513"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
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
                    <button onClick={() => openBookingForSpecialty(sp.name, sp.bookingUrl)} className="hover:text-[#D4AF37] transition-colors text-left">
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
                    <a href="mailto:contacto@altavita.cl" className="hover:text-[#D4AF37] underline">
                      contacto@altavita.cl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <strong className="block text-white font-semibold">Horario de Atención:</strong>
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
