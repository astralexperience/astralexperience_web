# Guía rápida de contenido

Todo el contenido se edita en `index.html`. Busca los bloques marcados así:

```
<!-- ═══════════════ EDITABLE · NOMBRE ═══════════════ -->
...
<!-- ═══════════════ FIN EDITABLE · NOMBRE ═══════════════ -->
```

| Bloque | Qué cambiar |
|---|---|
| Lanzamiento destacado (hero) | Portada, título, fecha, enlace "Escuchar" (enlace inteligente) |
| Último lanzamiento | Título, fecha, nota y enlaces por plataforma (`href="#"` = se oculta) |
| Reproductor de Spotify | URL del iframe (artista, single o álbum) |
| Discografía | Un `<li>` por lanzamiento |
| Vídeos | Un `<li data-yt="ID">` por vídeo; el primero sale grande |
| Conciertos | Un `<li data-date="AAAA-MM-DD">` por fecha; los pasados se mueven solos |
| Biografía / Formación | Texto y miembros |
| Mailing list | Bloque comentado: activar cuando haya plataforma |

## Imágenes (sustituir manteniendo el mismo nombre)

Formato recomendado: WebP (se puede convertir gratis en squoosh.app), calidad ~75.

| Archivo | Tamaño | Uso |
|---|---|---|
| `assets/img/hero-desktop.webp` | 2400×1350 | Foto oficial 1, horizontal |
| `assets/img/hero-mobile.webp` | 1080×1620 | Foto oficial 1, recorte vertical |
| `assets/img/banda.webp` | 2000×1125 | Foto oficial 2 |
| `assets/img/merch.webp` | 1200×900 | Foto de merch |
| `assets/img/releases/ultimo-single.webp` | 1000×1000 | Portada del lanzamiento destacado |
| `assets/img/releases/*.webp` | 600×600 | Portadas de la discografía |
| `assets/img/og-image.jpg` | 1200×630 | Imagen al compartir el enlace (JPG) |
| `assets/img/logo/isotipo.svg` | SVG | Isotipo de la cabecera (en claro) |
| `assets/img/logo/favicon.svg` | SVG | Icono de pestaña |
| `assets/img/logo/apple-touch-icon.png` | 180×180 | Icono en móviles |

Las miniaturas de los vídeos las pone YouTube automáticamente.

## Cada vez que publiques algo importante

- Actualiza `<lastmod>` en `sitemap.xml`.
- Si cambia el lanzamiento principal, revisa `<title>` y `<meta name="description">` en `index.html`.

## No tocar

`politica-de-privacidad.html` y `eliminacion-de-datos.html` (enlazados a la app de Meta).
