# Autonomía de diseño y desarrollo para TC STUDIO

Instrucciones del propietario para todas las futuras iteraciones de este proyecto.

Tienes autonomía total sobre la arquitectura y las dependencias de este proyecto. Tu objetivo es llevar la calidad visual, la fluidez de las animaciones y la experiencia de usuario al 100%, al nivel de un sitio ganador de Awwwards. Esta es una aspiración de calidad, no una afirmación de premio o certificación.

## Reglas estrictas

1. **Evalúa antes de programar:** Antes de crear o mejorar cualquier sección, analiza si el código nativo se queda corto. Si una librería externa (como `motion`, `lenis`, `gsap`, `lucide-react`, `canvas-confetti`, componentes de `shadcn/ui`, etc.) puede lograr un resultado visualmente superior, instálala tú mismo usando `npm install` en la terminal.
2. **Elige siempre la mejor opción:** Selecciona librerías modernas, ligeras, compatibles con la versión actual de React/Next.js del proyecto y sin conflictos de dependencias. Si el proyecto no utiliza React o Next.js, elige la variante compatible con el stack existente y no agregues un framework sin un beneficio concreto.
3. **Actualiza AGENTS.md:** Conserva estas mismas reglas de autonomía en la raíz del proyecto para aplicarlas automáticamente en todas las futuras iteraciones.

## Dirección y límites vigentes

- Verde oscuro como base de marca. Evitar regresar a la combinación beige/cobre, esculturas abstractas genéricas o una apariencia asociada a asistentes de IA.
- Dar protagonismo a proyectos y pantallas reales con composición editorial, profundidad y movimiento narrativo. La referencia de Rockstar orienta ritmo y escala; no copiar sus materiales ni identidad.
- Usar únicamente experiencia del CV, datos confirmados por Tobías y código o referencias realmente inspeccionados. No inventar clientes, funciones, métricas ni certificaciones.
- Mantener inglés y español, accesibilidad, movimiento reducido y alternativas ligeras para móvil.
- No publicar, hacer push, enviar mensajes, entrar a cuentas de clientes ni copiar secretos o datos personales sin autorización específica. La autonomía de arquitectura no sustituye esa autorización.
- Ejecutar build y pruebas pertinentes, revisar el resultado visual y documentar límites reales. No atribuir premios, conformidad WCAG o resultados de rendimiento no medidos.

- Preferencia actual: modo oscuro en todas las secciones, acentos desaturados sin lima chillón; retrato pequeño, secundario y en color, sin filtro blanco y negro.

- Tipografía aprobada para esta iteración: Barlow Condensed en títulos, Space Grotesk en lectura e IBM Plex Mono en etiquetas. Evitar microtexto de 6–8 px salvo dentro de mockups; priorizar lectura y contraste. Fuentes WOFF2 locales, sin servicios externos en tiempo de visita.

- Formulario: conservar etiquetas visibles, superficies oscuras, foco claro y campos de 16 px en móvil. Fondo con trama técnica y grano sutil, sin animaciones decorativas pesadas.

- Dirección cinematográfica: GSAP/ScrollTrigger y perspectiva CSS con pantallas reales. Zoom de aproximación y retirada, capas y tipografía monumental al servicio del recorrido. Versión móvil compacta sin fijaciones largas; movimiento reducido y pausa deben retirar pins y estilos. No sumar motores 3D redundantes sin una necesidad concreta.

- Nitidez: no ampliar capturas por encima de su resolución útil y densidad de pantalla. Izipark tiene fuente de 277×605: mantener escala acotada hasta disponer de una captura mejor. Preferir capturas originales sin compresión destructiva para interfaces con texto; el zoom intenso puede recaer en composiciones vectoriales.

- Navegación vigente: barra editorial plana, línea fina y enlaces tipográficos; evitar regresar a cápsulas múltiples. Mantener continuidad de movimiento desde ERP hasta contacto, con formulario estable al escribir.

- Paleta aprobada: verde oscuro como base; plateado suave #c3c8cb para estructura y metadatos; champagne #c8b18a en navegación activa, flechas, índices y contacto. Títulos blanco cálido #edece5. Evitar amarillo brillante o acabados metálicos exagerados.

- Mensaje inicial explícito: software a medida para empresas y equipos. Mantener ritmo de cámara acotado y pausas de lectura. Ejemplos finales son posibilidades de trabajo; integraciones, automatización e IA deben identificarse como evaluación/piloto. No sustituir casos reales por ejemplos. Capturas internas solo si fueron inspeccionadas y no muestran datos personales.

- Orden del cierre: proceso → ejemplos de proyectos → contacto/formulario. Intro con una pasada de luz plateada/champagne sobre TC/STUDIO; sin parpadeos, respetando pausa y movimiento reducido.

- Identidad / como firma: conservar la barra como motivo en apertura, capítulos y marco de producto. Hilo dorado discreto en escritorio. Experiencias guiadas deben usar capturas reales, distinguir propuestas de casos y nunca aparentar acciones en vivo. Reproducción solo a pedido, con pausa y alternativa manual.

- Al entrar o recargar, empezar siempre arriba: no restaurar scroll ni respetar fragmentos iniciales. Conservar idioma y parámetros de campaña. Los enlaces internos siguen funcionando durante la visita.

- Fondo vigente Forest light: material verde casi negro, luz difusa, reflejos plateados/champagne y textura fina. Evitar cuadrículas generales y anillos repetidos. La dirección se concentra en src/backgrounds.css, importado después de styles.css.

- Preparar el layout y la cámara detrás de la intro antes de revelarla. No aplicar un segundo zoom automático a hero-camera ni montar la experiencia nuevamente al terminar la intro: la cámara debe responder al scroll.

- Navegación actual: barra de capítulos con índice completo de 16 destinos, indicador de sección y atajos. Mantener todos los destinos accesibles también en móvil y en inglés. F5 comienza arriba; los enlaces deliberados desde el caso TCGym conservan el destino elegido.

- Galería: mantener fundido y deslizamiento direccional, imagen decodificada antes del cambio, miniaturas, teclado, Escape y movimiento reducido. Usar Web Animations nativo; no sumar dependencias para estas transiciones.

- Ritmo de movimiento: curvas suaves coherentes, amplitud de cámara moderada, paneles con fundido/desplazamiento corto y salida animada. Evitar recortes bruscos y no aumentar tiempos indiscriminadamente. Medir rendimiento antes de afirmar fluidez o puntuaciones.

- Selector de servicio: conservar el desplegable personalizado verde/champagne, sus cinco opciones, descripciones bilingües, navegación por teclado y sincronización con las ideas y el borrador. El select nativo queda como respaldo sin JavaScript.
