# Guía rápida de contenido

Todo el contenido se edita en `index.html`. Busca los bloques marcados así:

```
<!-- ═══════════════ EDITABLE · NOMBRE ═══════════════ -->
...
<!-- ═══════════════ FIN EDITABLE · NOMBRE ═══════════════ -->
```

| Bloque | Qué cambiar |
|---|---|
| Último lanzamiento | Portada, título, texto, año y enlaces (`href="#"` = el botón se oculta) |
| Discografía | Un `<article>` por single |
| Reproductor de Spotify | `data-src` (artista, single o álbum) |
| Conciertos | Un `<article data-date="AAAA-MM-DD">` por fecha; los pasados se mueven solos a "Conciertos anteriores" |
| Biografía / Formación | Texto y miembros |
| Vídeos | `data-yt` y `href` con el ID de YouTube; el primero es el grande |
| Mailing list | Bloque comentado: activar cuando haya plataforma |

## Imágenes (sustituir manteniendo el mismo nombre)

Formato: WebP (se puede convertir gratis en squoosh.app), calidad ~75.

| Archivo | Tamaño | Uso |
|---|---|---|
| `assets/img/hero.webp` | 1920×1080 | Portada, horizontal (se ve en B/N) |
| `assets/img/hero-mobile.webp` | 1080×1440 | Portada, recorte vertical para móvil |
| `assets/img/banda.webp` | 1000×1200 | Foto oficial en "La banda" |
| `assets/img/releases/versus.webp` | 1000×1000 | Portada del último lanzamiento |
| `assets/img/releases/*.webp` | 600×600 | Portadas de la discografía |
| `assets/img/og-cover.jpg` | 1200×630 | Imagen al compartir el enlace (JPG) |
| `assets/img/logo/favicon.svg` | SVG | Icono de pestaña |
| `assets/img/logo/apple-touch-icon.png` | 180×180 | Icono en móviles |
| `assets/img/logo/isotipo.svg` | SVG | Logo de la cabecera (ver comentario en el HTML) |
| `assets/video/hero.mp4` | ≤ 4 MB | Opcional: vídeo de fondo de la portada |

Las miniaturas de los vídeos las pone YouTube automáticamente.

## Cada vez que publiques algo importante

- Actualiza `<lastmod>` en `sitemap.xml`.
- Si cambia el lanzamiento principal, revisa `<title>` y `<meta name="description">`.

## No tocar

`politica-de-privacidad.html` y `eliminacion-de-datos.html` (enlazados a la app de Meta).

## Versión

En la cabecera aparece la versión (p. ej. `v0.3.0`). En cada cambio se sube en tres sitios de `index.html`: el `<span class="site-version">`, y el `?v=` de `main.css` y `main.js` (esto obliga al navegador a descargar los estilos y scripts nuevos). Si al recargar ves la versión nueva, estás viendo la web actualizada.

## Colores por fase

Los colores salen de `Colores_de_marca.md` (carpeta de materiales) y están en `assets/css/main.css`, bloque «COLORES DE MARCA POR FASE».
Para cambiar de fase basta con editar el atributo de `<html>` en `index.html` y `404.html`:

- `data-fase="azul"`: fase 1 (desde el 2/11/2026)
- `data-fase="rojo"`: fase 2

Las fotos no cambian solas: al pasar a la fase roja, sustituye `hero.webp`, `hero-mobile.webp` y `banda.webp` por las versiones rojas.
