(() => {
  'use strict';

  const links = window.OMEGAUP_DONATION_LINKS || {};
  let active = 0;

  // --- Métodos tipo enlace (Stripe, PayPal): solo HTTPS válido ---
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

  // --- Paneles desplegables (acordeón accesible) ---
  function wireToggle(toggleId, panelId) {
    const toggle = document.getElementById(toggleId);
    const panel = document.getElementById(panelId);
    if (!toggle || !panel) return null;
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
    return { toggle, panel };
  }

  // --- Benevity: botón + lista de ejemplos por empresa ---
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

  // --- Transferencia bancaria: filas con copiar al portapapeles ---
  const bank = window.OMEGAUP_BANK;
  if (bank && bank.account && bank.clabe) {
    const rows = [
      { label: 'Banco', value: bank.bank, copy: false },
      { label: 'Cuenta', value: bank.account, copy: true },
      { label: 'CLABE interbancaria', value: bank.clabe, copy: true },
      { label: 'Moneda', value: bank.currency, copy: false }
    ];
    const container = document.getElementById('bankRows');
    rows.forEach((row) => {
      if (!row.value) return;
      const wrap = document.createElement(row.copy ? 'button' : 'div');
      wrap.className = 'bank-row' + (row.copy ? ' copyable' : '');
      if (row.copy) {
        wrap.type = 'button';
        wrap.setAttribute('aria-label', `Copiar ${row.label}: ${row.value}`);
      }
      wrap.innerHTML =
        `<span class="bank-label">${row.label}</span>` +
        `<span class="bank-value">${row.value}</span>` +
        (row.copy ? `<span class="bank-copy" aria-hidden="true">Copiar</span>` : '');
      if (row.copy) {
        wrap.addEventListener('click', () => copyText(row.value, wrap));
      }
      container.appendChild(wrap);
    });
    const t = document.getElementById('bankToggle');
    if (t) t.hidden = false;
    wireToggle('bankToggle', 'bankPanel');
    active++;
  }

  function copyText(text, el) {
    const done = () => {
      const tag = el.querySelector('.bank-copy');
      if (!tag) return;
      const prev = tag.textContent;
      tag.textContent = 'Copiado ✓';
      el.classList.add('copied');
      setTimeout(() => { tag.textContent = prev; el.classList.remove('copied'); }, 1600);
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
})();
