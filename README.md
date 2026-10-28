# Sayukiit Creative Lab

Sitio comercial estático para **Sayukiit Creative Lab**, estudio creativo independiente de diseño, fotografía y producción audiovisual en Cuenca, Ecuador.

La dirección visual parte de un portafolio editorial: un hero a sangre con imagen a pantalla completa (75 % del alto), tipografía expresiva, imágenes cálidas y una paleta de crema, vino y tinta. La implementación es HTML5 + CSS moderno + JavaScript vanilla, sin dependencias de build.

---

## 1. Cómo ver el sitio

Puedes abrir `index.html` directamente en el navegador. Para que las rutas y fuentes se comporten como en producción, es mejor levantar un servidor local:

```bash
python -m http.server 4173
```

Luego visita `http://localhost:4173`.

No requiere instalación de paquetes ni compilación.

---

## 2. Estructura del proyecto

```text
sayu-creative-lab/
├── index.html                 # Estructura semántica completa
├── css/
│   └── styles.css             # Tokens, componentes, secciones, responsive y motion
├── js/
│   └── main.js                # Menú, scrollspy, reveals, formulario y año
├── assets/
│   ├── isotipo.svg            # Isotipo / favicon
│   └── img/                   # Fotografías de muestra
└── README.md
```

### Bloques de la página

| Bloque | ID | Etiqueta |
| --- | --- | --- |
| Navegación fija | — | `<header>` + `<nav>` |
| Hero | `#inicio` | `<section>` |
| Manifiesto | `#manifiesto` | `<section>` |
| Servicios | `#services` | `<section>` + 3 `<article>` |
| Portafolio | `#proyectos` | `<section>` + 4 `<article>` |
| Contacto | `#contacto` | `<section>` + `<form>` |
| Footer | — | `<footer>` |

La navegación utiliza anclas internas y `scroll-behavior: smooth`. El desplazamiento compensa la altura del header fijo con `scroll-padding-top`.

---

## 3. Sistema de diseño

Los tokens están declarados al inicio de `css/styles.css`:

```css
:root {
  --bg-cream: #f4eedf;
  --primary-burgundy: #7a2e32;
  --text-dark: #2c2c2c;
  --text-muted: #6b6259;
  --accent-clay: #c1775d;
  --accent-blush: #e7bdae;
  --font-display: "Fraunces", Georgia, serif;
  --font-sans: "Manrope", system-ui, sans-serif;
  --gutter: clamp(1.25rem, 4vw, 4.5rem);
  --header-height: 5.25rem;
}
```

Para cambiar la identidad visual, modifica esos valores. Los componentes usan las variables en cascada, así que el cambio se propaga a todo el sitio.

### Tipografía

- **Noto Serif JP** para el nombre del estudio y la marca de agua del footer.
- **Fraunces** para títulos y firmas editoriales.
- **Manrope** para interfaz, navegación, párrafos y metadatos.

Ambas se cargan desde Google Fonts con fallback local. Si necesitas un sitio 100 % offline, descarga los archivos de fuente y sustituye el `<link>` por `@font-face`.

### Hero

El hero es una imagen a sangre que ocupa el 75 % del alto de la pantalla (`min-height: 75svh`). El texto, el sello y la barra de servicios se superponen con un degradado cálido (`.hero__scrim`) para garantizar contraste. El header pasa de crema (sobre la foto) a tinta (al hacer scroll), controlado por las variables `--header-*`.

Como el alto del contenido no depende del viewport, en pantallas anchas y bajas (portátiles de 1366×768 o 1280×800) el bloque crecía por encima del 75 %. La sección **14b** de `styles.css` añade tres media queries por altura (`max-height`) que comprimen espaciados y escala el título con `vh`, de modo que la proporción se mantiene entre 0,75 y 0,79 en cualquier tamaño, sin recortar texto.

### Sello hanko

El sello del hero está construido en HTML/CSS (`.seal`) con una retícula tipográfica `SA/YU` y la leyenda `Cuenca · EC`. No es una imagen, por lo que puede adaptarse de tamaño o color desde el CSS.

El isotipo del header y footer es `assets/isotipo.svg`. Reemplázalo por el archivo oficial manteniendo el mismo nombre.

---

## 4. Responsive

Puntos de quiebre principales:

- `1180px`: ajustes del hero y tarjetas de servicio.
- `960px`: navegación móvil, hero a una columna, servicios a una columna, portafolio a una columna.
- `720px`: ajustes de composición, formulario y footer.
- `480px`: refinamiento de tipografía y metadatos.

El menú móvil se controla con JavaScript y mantiene el bloqueo de scroll del `body` mientras está abierto. Se cierra con el botón, al seleccionar un enlace o con `Escape`.

---

## 5. Comportamientos JavaScript

`js/main.js` incluye, sin librerías:

- Estado visual del header al hacer scroll.
- Menú móvil accesible (`aria-expanded`, `aria-controls`, retorno de foco).
- Aparición progresiva con `IntersectionObserver`.
- Scrollspy para marcar la sección activa en la navegación.
- Año dinámico en el footer.
- Manejo del formulario de contacto.

Si el usuario prefiere movimiento reducido (`prefers-reduced-motion`), los reveals y animaciones se desactivan.

---

## 6. Formulario de contacto

Por defecto funciona **sin backend**: al enviar un formulario válido, el sitio abre la aplicación de correo del usuario con asunto y cuerpo ya armados, usando la dirección indicada en el `action`:

```html
<form
  action="mailto:hola@sayucreativelab.com"
  method="post"
  enctype="text/plain"
  data-contact-form
  data-endpoint=""
>
```

### Conectar un servicio real

1. Crea un endpoint en Formspree, Basin, Getform o tu propia API.
2. Agrega la URL en `data-endpoint`:

```html
<form data-contact-form data-endpoint="https://formspree.io/f/TU_ID" ...>
```

3. El script hará un `POST` con `FormData` y mostrará el estado de envío en `.form-status`.

Si usas Formspree, revisa su configuración de CORS y su respuesta JSON. El código actual asume una respuesta `2xx` estándar.

---

## 7. Personalización rápida

### Cambiar correo, redes y datos

Busca en `index.html`:

- `hola@sayucreativelab.com`
- `@sayucreativelab`
- enlaces de Instagram, Behance y Vimeo
- `Cuenca, Ecuador`

Los enlaces sociales actuales son marcadores de posición. Sustitúyelos por los perfiles oficiales.

### Cambiar imágenes

Reemplaza los archivos dentro de `assets/img/` conservando los nombres:

| Archivo | Uso |
| --- | --- |
| `hero-general.jpg` | Hero a sangre (2000 × 1125) |
| `manifesto-pen.jpg` | Manifiesto |
| `project-cafe.jpg` | Café de Barrio |
| `project-ceramics.jpg` | Materia Viva |
| `project-event.jpg` | Feria de los Sentidos |
| `project-camera.jpg` | Detrás de la Escena |

Las imágenes están optimizadas para web y tienen dimensiones declaradas para evitar saltos de layout. Si las reemplazas, mantén una relación de aspecto similar y actualiza los atributos `width`/`height` cuando cambie.

### Cambiar el portafolio

Cada caso es un `<article class="project ...">`. Las variantes de layout son:

- `project--wide` / `project--narrow`: columnas.
- `project--offset`: desplazamiento vertical.
- `project__media--landscape`, `--portrait`, `--wide`: relación de aspecto.

Para agregar un proyecto, duplica un `<article>` y ajusta imagen, categoría, título, descripción y año.

### Cambiar la paleta del contacto

La sección de contacto invierte la paleta con `background: var(--primary-burgundy)`. Si prefieres mantener todo en crema, elimina la clase/estilos de `.contact` y ajusta los colores de las variables `--cream-muted` y `--line-light` en el formulario.

---

## 8. Créditos de imágenes

Las fotografías son marcadores de posición de **Unsplash** y deben reemplazarse por el material real de Sayu Creative Lab antes de publicar.

- Hero: https://unsplash.com/photos/1524250502761-1ac6f2e30d43
- Manifiesto: https://unsplash.com/photos/1455390582262-044cdead277a
- Café de Barrio: https://unsplash.com/photos/1501339847302-ac426a4a7cbb
- Materia Viva: https://unsplash.com/photos/1610701596007-11502861dcfa
- Feria de los Sentidos: https://unsplash.com/photos/1492684223066-81342ee5ff30
- Detrás de la Escena: https://unsplash.com/photos/1542038784456-1ea8e935640e

Revisa la licencia de Unsplash antes de usar las imágenes en un sitio comercial definitivo.

---

## 9. Publicación

El sitio es estático. Puedes desplegarlo en Netlify, Vercel, Cloudflare Pages, GitHub Pages o cualquier hosting con soporte para archivos estáticos.

Checklist antes de publicar:

- Reemplazar imágenes de muestra y enlaces sociales.
- Confirmar correo y datos de contacto.
- Conectar el formulario a un backend o servicio.
- Añadir analítica si corresponde.
- Actualizar `og:image` con una URL absoluta y una imagen de 1200 × 630 px.
- Revisar el sitio en Safari, Chrome y dispositivos móviles reales.

---

## 10. Notas de implementación

Se eligió **CSS moderno puro** en lugar de Tailwind para mantener:

- Cero dependencias y cero proceso de build.
- Control total de variables corporativas y tipografía editorial.
- Componentes semánticos fáciles de mover a un CMS o a un framework posterior.

Si en el futuro se migra a Tailwind, los tokens pueden trasladarse a `theme.extend` y los componentes actuales sirven como referencia visual y de interacción.
