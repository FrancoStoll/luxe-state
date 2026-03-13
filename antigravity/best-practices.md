# Buenas Prácticas para Aplicaciones Next.js de Bienes Raíces

Resumen estructurado y condensado de mejores prácticas, Performance, UX y Arquitectura.

## 🏗 Arquitectura y Datos (Next.js & Backend)
*   **ISR/SSG para Propiedades:** Usa Incremental Static Regeneration para `/propiedades/[id]`. Carga al instante; vital para SEO.
*   **SSR para Búsquedas:** Server-Side Rendering el catálogo principal y los filtros dinámicos.
*   **Estado en la URL:** Sincroniza filtros (precio, zona) con query params (`?precio=100k`) para URLs compartibles.
*   **Caché de Consultas:** Minimiza hits a la base de datos (Supabase/PostgreSQL) para catálogos que cambian poco.
*   **Índices Geoespaciales:** Usa PostGIS u homólogo para consultas por polígono ("casas en esta zona").

## 🖼 Medios y Rendimiento (Performance)
*   **Obligatorio `next/image`:** Compresión automática a WebP/AVIF y escalado automático.
*   **Lazy Loading nativo:** Imágenes fuera del viewport no se cargan de inicio.
*   **Placeholders Blur:** Usa `blurDataURL` para evitar el Cumulative Layout Shift (CLS).
*   **Carruseles perezosos:** En galerías de 30 fotos, carga solo las primeras 3 inicialmente.

## 🗺 Mapas y Geolocalización
*   **Lazy Load de Mapas:** Carga los iframes (Mapbox/Google) dinámicamente (`next/dynamic` con `ssr: false`).
*   **Agrupamiento (Clustering):** Usa Supercluster. Nunca renderices miles de pines individuales a la vez.
*   **Marcadores Interactivos:** Al hacer hover sobre una propiedad en la lista, resalta su pin en el mapa y viceversa.

## 💎 UX e Interfaces Interactivas
*   **Corazones (Favoritos) Optimistas:** Usa "Optimistic UI" para guardar propiedades. La interfaz reacciona instantáneamente sin esperar al servidor.
*   **Carrusel en Grid:** Permite pasar fotos directamente en la tarjeta de lista, tipo Airbnb.
*   **Comparador:** Permite seleccionar "casilla comparativa" para alinear métricas de 3 propiedades.
*   **Calculadora In-Situ:** Agrega una tabla de hipoteca en la misma hoja de la casa (interactiva).
*   **Tour 360 Condicional:** Nunca cargues Matterport/Iframes 360 hasta que el usuario haga clic en un botón de "Abrir Recorrido".

## 🔎 SEO y Descubrimiento (Motores de Búsqueda)
*   **Schema.org (JSON-LD):** Usa `@type: "RealEstateListing"` en la página de propiedad para que aparezca la foto, precio y specs directo en Google (Rich Snippets).
*   **Metadatos Dinámicos:** Genera los meta tags (`<title>` y `<meta name="description">`) dinámicamente usando Next.js Metadata API con los datos de la casa.
*   **Open Graph Dinámicos (OG):** Usa `@vercel/og` (o Next.js image response) para generar imágenes compartibles dinámicas al instante con el precio y foto de la casa.
*   **Rutas Canónicas y Sitemaps:** Genera dinámicamente un archivo sitemap.xml y usa la URL canónica correcta para evitar la penalización por contenido duplicado cuando haya múltples filtros.

## 🚀 Marketing y Retención
*   **Registro Progresivo:** Permite buscar y "dar like" guardando en LocalStorage, pide cuenta solo en el 3er intento.
*   **Alertas Guardadas:** "Guarda esta búsqueda" para enviar notificaciones webhooks/cron cuando caiga el precio.
