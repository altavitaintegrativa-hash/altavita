import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Altavita Salud Integrativa | Centro Médico y Tienda en La Serena',
  description: 'Centro médico de salud integrativa, especialidades médicas y tienda de suplementación natural en La Serena, Chile. Los Hibiscus 740.',
  openGraph: {
    title: 'Altavita Salud Integrativa | La Serena',
    description: 'Atención médica especializada, terapias integrales y suplementación de alta calidad para toda la familia.',
    type: 'website',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-[#F8F8F4] text-[#22311D] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#22311D]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
