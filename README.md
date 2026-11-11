# TC/STUDIO

Portfolio de Tobías Coria: software a medida, aplicaciones web y móviles, Odoo y análisis funcional. Verde bosque, acentos plateados y champagne, español e inglés.

## Desarrollo

Requiere Node.js 22.12+ (o 24) y npm.

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:8770/. Para comprobar la entrega:

```sh
npm run lint
npm test
npm run build
npm run preview
```

## Arquitectura

Sitio estático multipágina con Vite y TypeScript. Componentes HTML compartidos en `src/fragments.ts`. GSAP/ScrollTrigger y Lenis se cargan por separado para las secuencias de escritorio; móvil conserva scroll nativo. Web Animations API maneja galerías y paneles. Sin backend ni servicios de pago necesarios.

- `src/chapters.ts` y `src/navigation.ts`: índice de 16 destinos y seguimiento de sección.
- `src/motion-green.ts`, `src/interactions.ts`, `src/panels.ts`: cámara, intro, desplegables y ventanas.
- `src/gallery.ts`: imágenes, miniaturas, teclado y transiciones.
- `src/experience.ts`: recorrido de TCGym y selector de necesidades.
- `src/inquiry.mjs`: validación y borrador de consulta bilingüe.
- `src/contact-refined.css`: campos de contacto y estados de foco.
- `src/service-picker.ts` y `src/service-picker.css`: selector de servicios con lista personalizada, teclado y traducciones. Conserva el select original como respaldo y fuente de datos del formulario.
- `public/media`, `public/fonts`: capturas y fuentes locales.

Movimiento reducido del sistema y botón de pausa disponibles. Al recargar se vuelve al inicio; los enlaces internos permiten navegar durante la visita.

## Contacto y contenido

El formulario genera un borrador local para abrir en la aplicación de correo. **No envía ni almacena consultas.** El visitante revisa el mensaje antes de enviarlo. También hay enlaces directos a email y WhatsApp.

Los proyectos y tecnologías corresponden a información confirmada por su autor y fuentes inspeccionadas. Izipark se presenta en desarrollo. Las capturas de Pediatría muestran acceso, panel, formulario vacío y agenda con datos de demostración. Las de TCGym muestran interfaces públicas y paneles autorizados sin fichas personales visibles. Las propuestas de IA, automatización e integraciones se identifican como evaluación/piloto.

## Vercel

Importar este repositorio como proyecto Vite. `vercel.json` define compilación, carpeta de salida `dist`, URLs y cabeceras de seguridad. La compilación de Vercel activa indexación con `TC_PUBLIC_INDEXING=1`; las compilaciones locales quedan en `noindex` por defecto.

Dominio configurado en canonical, Open Graph y sitemap: https://tc-studio-six.vercel.app/. Si cambia el dominio, actualizar las dos páginas y `vite.config.ts`. El despliegue automático depende de la conexión del repositorio con Vercel.

## Validación

TypeScript, compilación Vite y siete pruebas de generación/validación de consultas. Revisión visual de escritorio y móvil de 390 px, navegación, galerías, diálogos, foco, idiomas y pausa. No se afirman puntuaciones de rendimiento ni conformidad completa de accesibilidad sin una auditoría adicional en dispositivos reales.

Licencias y recursos: `THIRD_PARTY.md`.
