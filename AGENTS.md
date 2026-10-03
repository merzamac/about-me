# AGENTS.md

Sitio estático (HTML/CSS/JS vanilla) — portafolio personal de Moisés Merza, publicado en GitHub Pages como `https://merzamac.github.io/`. El usuario se comunica en español; responder en español.

## Estructura

- `index.html` — página única (todo el contenido). Sin build, sin frameworks, sin package.json.
- `source/css/style.css`, `source/js/main.js` — todo el JS vive en un solo IIFE en `main.js`.
- `source/pdf/Moises_Merza_CV.pdf` — PDF exportado **manualmente por el usuario desde Word** (nunca automatizar con Office COM: la instalación no está licenciada y los scripts se cuelgan).
- `source/images/me.jpg` — foto de perfil en el home.

## Comandos de verificación (no hay lint/test formales)

```sh
node --check source/js/main.js          # sintaxis JS
python -m http.server 8080              # probar en local: http://localhost:8080
```

- **Nunca probar con doble clic en `index.html` (`file://`)**: Chromium ignora `download` y bloquea `fetch`, así que la descarga del CV "redirige" al visor. Eso es un falso bug; usar el server local o la URL en vivo.
- Balance de tags HTML: `html.parser` de Python (no hay herramienta en el repo).
- PowerShell rompe `python -c "..."` con comillas/`[` anidadas → escribir un `.py` temporal y ejecutarlo.

## Deploy

- Push a `main` → GitHub Pages publica solo lo commiteado (~60 s de build). Verificar con `HEAD https://merzamac.github.io/<ruta>` (esperar ~60 s tras el push).
- `git push` imprime por stderr `remote: This repository moved...` — **no es error**: el remoto `about-me` redirige al repo renombrado `merzamac.github.io`.
- Tras renombrar/mover carpetas, las URLs viejas dan 404 (sin redirects); el HTML se despliega atómico por commit.
- GitHub Pages sirve CSS con `max-age=600` → tras cambiar CSS, incrementar el query `?v=N` en el `<link>` de `index.html` para forzar re-descarga.

## Convenciones de contenido (críticas)

- El texto es **literal del CV del usuario**. No inventar ni ampliar claims: prohibido "Senior", "Disponible", "+100%", "sub-50ms", "STABLE", "telemetry", "Redis", "Odoo XML-RPC", "verificable", porcentajes autoevaluados en skills o testimonios inventados.
- Hechos solo si están en el CV del usuario o evidencia de git.
- Al reescribir secciones: grep de esas palabras al final de toda edición.

## Detalles de implementación fáciles de romper

- **Descarga del CV**: 3 botones `<a href="source/pdf/..." download>` (header, hero, perfil). `main.js` hace `fetch` → blob → click con `download`; el nombre sale de `href.split('/').pop()`, así que funciona con cualquier ruta. El fallback `location.href` solo se activa si el fetch falla.
- **IDs de secciones en español**: `#inicio #perfil #habilidades #trayectoria #proyectos #contacto` — los usa el scrollspy (`data-nav`), el footer y los anchors. Renombrar uno implica actualizar ambos.
- Tres widgets custom en `main.js`: acordeón (skills, un solo abierto), tabs (trayectoria: Trabajo/Educación), slider con scroll-snap nativo (proyectos, sin Swiper). No introducir librerías; el slider es CSS puro + `scrollBy`.
- `avatar`: `<img>` con `position:relative; z-index:1` — si se quita, el anillo cónico `::before` tapa la foto.
- Tipografía de iconos: **Material Symbols** por nombre de ligadura (`arrow_forward`, `expand_more`…), no SVG ni emoji.
- Se mantienen `@media print` (salida tipo CV) y `prefers-reduced-motion` en `style.css`; el typewriter se completa en `beforeprint`.
- Paleta Google como variables CSS (`--blue #4285f4` etc.) + Roboto/Roboto Mono. Tema claro, sin dark mode.
- `.gitignore` excluye `responsive-portfolio-website-Alexa/` (plantilla de referencia clonada localmente); no commitearla ni publicarla.
