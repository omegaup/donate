(() => {
  'use strict';

  // ---------------------------------------------------------------
  // Traducciones. Cada clave corresponde a un atributo data-i18n en el HTML,
  // o se usa desde JS para los textos generados dinámicamente.
  // ---------------------------------------------------------------
  const I18N = {
    es: {
      htmlLang: 'es',
      docTitle: 'Donar a omegaUp',
      metaDescription: 'Elige cómo donar a omegaUp: PayPal, Stripe, Benevity o transferencia bancaria.',
      title: 'Donaciones',
      subtitle: 'Elige tu forma de apoyar',
      paypalTitle: 'Donar con PayPal',
      paypalSub: 'PayPal · Único o mensual',
      stripeTitle: 'Tarjeta o pago digital',
      stripeSub: 'Stripe · Apple Pay, ACH y más',
      benevityTitle: 'Donar con tu empresa',
      benevitySub: 'Benevity · Matching',
      benevityBody: 'Si tu empresa tiene programa de <strong>matching</strong>, puede duplicar tu aportación. Busca <strong>“omegaUp”</strong> en el portal de donaciones de tu empresa.',
      benevityNote: 'Ejemplos (cada enlace funciona solo para empleados de esa empresa):',
      bankTitle: 'Transferencia bancaria',
      bankSub: 'BBVA México · Transferencia en MXN',
      bankCopyNote: 'Toca cualquier dato para copiarlo.',
      taxNote: 'omegaUp es una organización sin fines de lucro 501(c)(3) en EE.&nbsp;UU. Tus donativos pueden ser deducibles de impuestos. EIN: 81-3404168.',
      soon: 'Próximamente estarán disponibles los enlaces de donación.',
      bank_bank: 'Banco',
      bank_account: 'Cuenta',
      bank_clabe: 'CLABE interbancaria',
      bank_currency: 'Moneda',
      copy: 'Copiar',
      copied: 'Copiado ✓',
      copyAria: (label, value) => `Copiar ${label}: ${value}`
    },
    en: {
      htmlLang: 'en',
      docTitle: 'Donate to omegaUp',
      metaDescription: 'Choose how to donate to omegaUp: PayPal, Stripe, Benevity or bank transfer.',
      title: 'Donate',
      subtitle: 'Choose how you want to help',
      paypalTitle: 'Donate with PayPal',
      paypalSub: 'PayPal · One-time or monthly',
      stripeTitle: 'Card or digital wallet',
      stripeSub: 'Stripe · Apple Pay, ACH & more',
      benevityTitle: 'Donate through your company',
      benevitySub: 'Benevity · Matching',
      benevityBody: 'If your company has a <strong>matching</strong> program, it can double your gift. Search for <strong>“omegaUp”</strong> in your company’s giving portal.',
      benevityNote: 'Examples (each link only works for employees of that company):',
      bankTitle: 'Bank transfer',
      bankSub: 'BBVA Mexico · Transfer in MXN',
      bankCopyNote: 'Tap any field to copy it.',
      taxNote: 'omegaUp is a 501(c)(3) nonprofit in the U.S. Your donations may be tax-deductible. EIN: 81-3404168.',
      soon: 'Donation links will be available soon.',
      bank_bank: 'Bank',
      bank_account: 'Account',
      bank_clabe: 'CLABE (interbank)',
      bank_currency: 'Currency',
      copy: 'Copy',
      copied: 'Copied ✓',
      copyAria: (label, value) => `Copy ${label}: ${value}`
    }
  };

  const STORAGE_KEY = 'omegaup-donate-lang';

  function detectLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en') return saved;
    } catch { /* localStorage no disponible */ }
    const nav = (navigator.language || navigator.userLanguage || 'es').toLowerCase();
    return nav.startsWith('es') ? 'es' : 'en';
  }

  let lang = detectLang();

  // Referencias a las filas del banco para re-traducir sin reconstruir el DOM.
  const bankRowRefs = [];

  function applyStaticTranslations() {
    const t = I18N[lang];
    document.documentElement.lang = t.htmlLang;
    document.title = t.docTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t.metaDescription);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (t[key] != null) el.innerHTML = t[key];
    });

    // Estado visual del selector de idioma
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const on = btn.dataset.lang === lang;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', String(on));
    });

    // Re-traducir filas bancarias generadas dinámicamente
    bankRowRefs.forEach((ref) => {
      const t2 = I18N[lang];
      ref.labelEl.textContent = t2[ref.labelKey];
      if (ref.copyEl) ref.copyEl.textContent = t2.copy;
      if (ref.isCopy) ref.wrap.setAttribute('aria-label', t2.copyAria(t2[ref.labelKey], ref.value));
    });
  }

  function setLang(next) {
    if (next !== 'es' && next !== 'en') return;
    lang = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
    applyStaticTranslations();
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  // ---------------------------------------------------------------
  // Métodos de donación
  // ---------------------------------------------------------------
  const links = window.OMEGAUP_DONATION_LINKS || {};
  let active = 0;

  // Enlaces (PayPal, Stripe): solo HTTPS válido
  document.querySelectorAll('a[data-method]').forEach((element) => {
    const raw = links[element.dataset.method];
    if (typeof raw !== 'string' || !raw.trim()) return;
    try {
      const url = new URL(raw.trim());
      if (url.protocol !== 'https:') return; // Nunca mostrar un destino no seguro.
      element.href = url.href;
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
      element.hidden = false;
      active++;
    } catch { /* Ignorar destinos inválidos. */ }
  });

  function wireToggle(toggleId, panelId) {
    const toggle = document.getElementById(toggleId);
    const panel = document.getElementById(panelId);
    if (!toggle || !panel) return;
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
  }

  // Benevity
  const benevity = window.OMEGAUP_BENEVITY;
  if (benevity && Array.isArray(benevity.examples)) {
    const valid = benevity.examples.filter((ex) => {
      try { return new URL(ex.url).protocol === 'https:'; } catch { return false; }
    });
    if (valid.length) {
      const container = document.getElementById('benevityLinks');
      valid.forEach((ex) => {
        const a = document.createElement('a');
        a.href = ex.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'panel-link';
        a.textContent = ex.company;
        container.appendChild(a);
      });
      const t = document.getElementById('benevityToggle');
      if (t) t.hidden = false;
      wireToggle('benevityToggle', 'benevityPanel');
      active++;
    }
  }

  // Transferencia bancaria (con copiar)
  const bank = window.OMEGAUP_BANK;
  if (bank && bank.account && bank.clabe) {
    const rows = [
      { key: 'bank_bank', value: bank.bank, copy: false },
      { key: 'bank_account', value: bank.account, copy: true },
      { key: 'bank_clabe', value: bank.clabe, copy: true },
      { key: 'bank_currency', value: bank.currency, copy: false }
    ];
    const container = document.getElementById('bankRows');
    const t = I18N[lang];
    rows.forEach((row) => {
      if (!row.value) return;
      const wrap = document.createElement(row.copy ? 'button' : 'div');
      wrap.className = 'bank-row' + (row.copy ? ' copyable' : '');

      const labelEl = document.createElement('span');
      labelEl.className = 'bank-label';
      labelEl.textContent = t[row.key];

      const valueEl = document.createElement('span');
      valueEl.className = 'bank-value';
      valueEl.textContent = row.value;

      wrap.appendChild(labelEl);
      wrap.appendChild(valueEl);

      let copyEl = null;
      if (row.copy) {
        wrap.type = 'button';
        wrap.setAttribute('aria-label', t.copyAria(t[row.key], row.value));
        copyEl = document.createElement('span');
        copyEl.className = 'bank-copy';
        copyEl.setAttribute('aria-hidden', 'true');
        copyEl.textContent = t.copy;
        wrap.appendChild(copyEl);
        wrap.addEventListener('click', () => copyText(row.value, wrap, copyEl));
      }

      container.appendChild(wrap);
      bankRowRefs.push({ wrap, labelEl, copyEl, labelKey: row.key, value: row.value, isCopy: row.copy });
    });
    const toggle = document.getElementById('bankToggle');
    if (toggle) toggle.hidden = false;
    wireToggle('bankToggle', 'bankPanel');
    active++;
  }

  function copyText(text, el, copyEl) {
    const done = () => {
      if (!copyEl) return;
      copyEl.textContent = I18N[lang].copied;
      el.classList.add('copied');
      setTimeout(() => { copyEl.textContent = I18N[lang].copy; el.classList.remove('copied'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch { /* sin portapapeles */ }
    document.body.removeChild(ta);
  }

  document.getElementById('availability').hidden = active > 0;

  // Aplicar idioma inicial (después de construir filas bancarias)
  applyStaticTranslations();
})();
