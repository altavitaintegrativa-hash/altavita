# Altavita Salud Integrativa — Sitio Web & E-commerce

Plataforma web corporativa y botica digital para **Altavita Salud Integrativa** (La Serena, Chile). Incluye agendamiento médico en tiempo real para 11 especialidades clínicas, tienda en línea sincronizada en vivo con Google Sheets, módulo de carrito de compras y pasarela de pagos.

---

## 🚀 Características Principales

* **Catálogo Sincronizado en Vivo:** Sincronización automática de inventario, precios normales, ofertas (25% descuento) e imágenes (hasta 5 fotografías por producto) gestionados directamente desde Google Sheets.
* **Visor Emergente Adaptativo:** Galería de productos interactiva con miniaturas, visor adaptativo sin deformaciones y detalle de beneficios.
* **Agendamiento Clínico Integrado:** Conexión directa mediante iframe dinámico con el sistema **Consultorio.me** filtrado por especialidades y profesionales.
* **Carrito de Compras Multicanal:** Generación de pedidos directo a WhatsApp corporativo y simulación/checkout seguro con MercadoPago.
* **Firma Corporativa & Contacto:** Configuración de correos corporativos oficiales (`contacto@altavita.cl`), canales de contacto directo y mapa de ubicación presencial.

---

## 🛠️ Stack Tecnológico

* **Framework:** Next.js 15 (App Router)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Animaciones:** Motion / Framer Motion
* **Iconografía:** Lucide React
* **Base de Datos / CMS:** Google Sheets API (CSV Parser Native)
* **Agendamiento:** Consultorio.me Integration Widget

---

## 💻 Desarrollo Local

1. **Clonar repositorio e instalar dependencias:**
   ```bash
   git clone [https://github.com/altavitaintegrativa-hash/altavita.git](https://github.com/altavitaintegrativa-hash/altavita.git)
   cd altavita
   npm install
