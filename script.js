(() => {
  const links = window.OMEGAUP_DONATION_LINKS || {};
  let active = 0;
  document.querySelectorAll('[data-method]').forEach((element) => {
    const raw = links[element.dataset.method];
    if (typeof raw !== 'string' || !raw.trim()) return;
    try {
      const url = new URL(raw.trim());
      if (url.protocol !== 'https:') return;
      element.href = url.href;
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
      element.hidden = false;
      active++;
    } catch { /* Never display an invalid payment destination. */ }
  });
  document.getElementById('availability').hidden = active > 0;
})();
