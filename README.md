# omegaUp · Donation links

Sitio tipo Linktree, estático y minimalista, para centralizar las formas de donar a omegaUp.
URL de destino prevista: `https://omegaup.github.io/donate/` (cuando esté listo el dominio propio, migrar a `https://donate.omegaup.org`).

## Archivos

- `index.html` — página de enlaces.
- `styles.css` — estilos.
- `links.js` — **el único archivo que editas** para activar los botones.
- `script.js` — muestra cada botón solo si su URL es HTTPS válida.
- `qr.html` — generador del código QR (abrir en navegador, descargar SVG/PNG).
- `assets/logo.svg`, `assets/logo-square.svg` — logotipos oficiales de omegaUp (locales, sin depender de CDNs).
- `assets/qrcode.js` — librería QR (qrcode-generator de Kazuhiko Arase, licencia MIT).

## Diseño

- Solo cuatro métodos: Stripe, PayPal, Benevity y transferencia bancaria.
- Sin rastreadores, formularios, almacenamiento ni procesamiento de pagos.
- No explica qué es omegaUp: ese contexto llega por correo o desde omegaup.org.

## 1. Activar botones

Edita `links.js` y coloca en cada campo una URL HTTPS oficial **verificada**. Mientras un campo esté vacío, su botón no aparece, para no enviar a nadie a un destino incorrecto. Para depósito bancario, apunta a una URL HTTPS con instrucciones seguras y verificadas (nunca publiques claves privadas, credenciales ni información no autorizada).

```js
window.OMEGAUP_DONATION_LINKS = {
  stripe: "https://TU-ENLACE-OFICIAL",
  paypal: "",
  benevity: "",
  bank: ""
};
```

## 2. Generar el QR

1. Abre `qr.html` en el navegador (ver sección Vista previa).
2. Confirma que la URL de destino sea la correcta (por defecto `https://omegaup.github.io/donate/`).
3. Escanéalo con tu teléfono para comprobar que abre el sitio correcto.
4. Descarga **SVG** para imprenta (vectorial, nítido a cualquier tamaño) o **PNG** para slides/correo/chat.

Importante: una vez que distribuyas el QR impreso, cambiar la URL obliga a reimprimir. Si piensas usar el dominio propio, configúralo **antes** de imprimir.

## 3. Vista previa local

Las páginas usan `fetch` para el logo, así que requieren servidor (no abrir con `file://`). Con cualquier servidor estático:

```
# Si tienes Node
npx serve .

# Si tienes Python
python -m http.server 8000
```

Luego abre `http://localhost:8000/` (sitio) y `http://localhost:8000/qr.html` (QR).

## 4. Publicar en GitHub Pages

1. Crea el repositorio `donate` en la organización `omegaup` y sube estos archivos.
2. En GitHub: **Settings → Pages**.
3. En *Build and deployment*, Source: **Deploy from a branch**.
4. Branch: `main`, carpeta `/ (root)`. Guardar.
5. Espera a que publique; el sitio quedará en `https://omegaup.github.io/donate/`.
6. Verifica el certificado HTTPS y prueba cada enlace con el equipo de fundraising **antes de distribuir el QR**.

### Migrar a dominio propio (opcional, después)

1. En **Settings → Pages → Custom domain**, escribe `donate.omegaup.org` y guarda.
2. En el DNS del dominio (GoDaddy), crea un registro **CNAME** `donate` apuntando a `omegaup.github.io`.
3. Activa **Enforce HTTPS** cuando GitHub termine de emitir el certificado.
4. Actualiza `og:url`, `og:image` y el `<footer>` de `index.html` y la URL por defecto de `qr.html` al nuevo dominio, y **regenera el QR**.

## Notas de seguridad

- Nunca pongas credenciales, claves ni datos bancarios sensibles en el repositorio.
- `script.js` solo acepta URLs `https:`; cualquier otra se ignora.
- Verifica cada enlace y el QR con el equipo responsable antes de publicarlos.
