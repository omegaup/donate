// Configuración de métodos de donación de omegaUp.
// Solo se aceptan URLs HTTPS oficiales verificadas. Un enlace vacío oculta su botón.
// No coloques credenciales ni información privada en este archivo.
window.OMEGAUP_DONATION_LINKS = {
  // Pago con tarjeta/wallets vía Stripe (Payment Link, USD con adaptive pricing).
  stripe: "https://donate.stripe.com/9B69AT1TjcMCbXdbjl8Ra00",

  // Botón oficial de donaciones de PayPal ("Donate to omegaUp").
  paypal: "https://www.paypal.com/donate/?hosted_button_id=JCP586PA5UQGW"
};

// Formulario de donación de Keela (one-time y mensual, montos sugeridos).
// Se incrusta como iframe dentro de un panel desplegable. Vacío = oculto.
window.OMEGAUP_KEELA = {
  embedUrl: "https://give-usa.keela.co/embed/SSHw3HJcbjJHRFM2d"
};

// Matching corporativo (Benevity). El ID de la causa omegaUp es el mismo para todas
// las empresas; cada empleado usa el portal de SU empresa. Agrega o quita ejemplos aquí.
window.OMEGAUP_BENEVITY = {
  causeId: "840-813404168",
  examples: [
    { company: "Microsoft", url: "https://microsoft.benevity.org/cause/840-813404168" },
    { company: "Netflix",   url: "https://netflixemployeegiving.benevity.org/cause/840-813404168" },
    { company: "Google",    url: "https://google.benevity.org/cause/840-813404168" },
    { company: "ByteDance / TikTok", url: "https://bytedance.benevity.org/cause/840-813404168" }
  ]
};

// Transferencia bancaria (datos verificados por la organización).
// Se muestran para copiar; no es un enlace.
window.OMEGAUP_BANK = {
  bank: "BBVA México",
  account: "0119080899",
  clabe: "012180001190808993",
  currency: "MXN"
};
