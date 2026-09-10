type ReaderMode = 'paged' | 'continuous';
type ReaderTheme = 'light' | 'sepia' | 'dark';
interface Preferences { mode: ReaderMode; font: 'serif' | 'sans'; fontSize: number; lineHeight: number; width: number; theme: ReaderTheme; align: 'left' | 'justify'; reducedMotion: boolean }
interface Progress { slug: string; anchor?: 'cover' | 'content'; heading: string; block: number; progress: number; updatedAt: string }
type ReadingAnchor = HTMLElement | 'cover';

const preferenceKey = 'agp:reader:preferences';
const defaults: Preferences = { mode: 'paged', font: 'serif', fontSize: 19, lineHeight: 1.7, width: 42, theme: 'light', align: 'left', reducedMotion: false };
const numberIn = (value: unknown, min: number, max: number, fallback: number) => typeof value === 'number' && value >= min && value <= max ? value : fallback;

export function parsePreferences(raw: string | null): Preferences {
  if (!raw) return { ...defaults };
  try {
    const value = JSON.parse(raw);
    return {
      mode: value.mode === 'continuous' ? 'continuous' : 'paged',
      font: value.font === 'sans' ? 'sans' : 'serif',
      fontSize: numberIn(value.fontSize, 16, 24, defaults.fontSize),
      lineHeight: numberIn(value.lineHeight, 1.45, 1.9, defaults.lineHeight),
      width: numberIn(value.width, 32, 52, defaults.width),
      theme: ['light', 'sepia', 'dark'].includes(value.theme) ? value.theme : defaults.theme,
      align: value.align === 'justify' ? 'justify' : 'left',
      reducedMotion: Boolean(value.reducedMotion),
    };
  } catch { return { ...defaults }; }
}

function initReader(shell: HTMLElement) {
  const viewport = shell.querySelector<HTMLElement>('[data-reader-viewport]')!;
  const pages = shell.querySelector<HTMLElement>('[data-reader-pages]')!;
  const pageOutput = shell.querySelector<HTMLOutputElement>('[data-reader-page]')!;
  const sectionOutput = shell.querySelector<HTMLElement>('[data-reader-section]')!;
  const scrubber = shell.querySelector<HTMLInputElement>('[data-reader-scrubber]')!;
  const index = shell.querySelector<HTMLSelectElement>('[data-reader-index]')!;
  const reopenButton = shell.querySelector<HTMLButtonElement>('[data-reader-reopen]')!;
  const previousButton = shell.querySelector<HTMLButtonElement>('[data-reader-previous]')!;
  const nextButton = shell.querySelector<HTMLButtonElement>('[data-reader-next]')!;
  const cover = shell.querySelector<HTMLElement>('[data-reader-cover]')!;
  const slug = shell.dataset.readerSlug || location.pathname;
  const lang = shell.dataset.readerLang === 'en' ? 'en' : 'es';
  const progressKey = `agp:reader:progress:${slug}`;
  let preferences = parsePreferences(localStorage.getItem(preferenceKey));
  let currentPage = 0;
  let pageCount = 1;
  let saveTimer = 0;
  let resizeTimer = 0;

  const contentBlocks = [...shell.querySelectorAll<HTMLElement>('[data-reader-content] h2, [data-reader-content] h3, [data-reader-content] p, [data-reader-content] ul, [data-reader-content] ol, [data-reader-content] blockquote, [data-reader-content] pre, [data-reader-content] figure, [data-reader-content] table, [data-reader-block]')];
  let heading = '';
  let blockWithinHeading = 0;
  for (const block of contentBlocks) {
    if (/^H[23]$/.test(block.tagName)) {
      if (!block.id) block.id = block.textContent?.trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `section-${index.options.length}`;
      heading = block.id;
      blockWithinHeading = 0;
      index.add(new Option(block.textContent?.trim() || block.id, block.id));
    }
    block.dataset.readerHeading = heading;
    block.dataset.readerBlock = String(blockWithinHeading++);
  }

  const applyPreferences = () => {
    shell.dataset.mode = preferences.mode;
    shell.dataset.font = preferences.font;
    shell.dataset.theme = preferences.theme;
    shell.style.setProperty('--reader-font-size', `${preferences.fontSize}px`);
    shell.style.setProperty('--reader-line-height', String(preferences.lineHeight));
    shell.style.setProperty('--reader-content-width', `${preferences.width}rem`);
    shell.style.setProperty('--reader-align', preferences.align);
    shell.querySelectorAll<HTMLButtonElement>('[data-reader-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.readerMode === preferences.mode)));
    shell.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-pref]').forEach(control => {
      const key = control.dataset.pref as keyof Preferences;
      if (control instanceof HTMLInputElement && control.type === 'checkbox') control.checked = Boolean(preferences[key]);
      else control.value = String(preferences[key]);
    });
  };

  const updateStatus = () => {
    const ratio = preferences.mode === 'paged' ? (pageCount <= 1 ? 0 : currentPage / (pageCount - 1)) : viewport.scrollTop / Math.max(1, viewport.scrollHeight - viewport.clientHeight);
    if (preferences.mode === 'paged') {
      scrubber.max = String(Math.max(0, pageCount - 1));
      scrubber.step = '1';
      scrubber.value = String(currentPage);
    } else {
      scrubber.max = '1000';
      scrubber.step = '1';
      scrubber.value = String(Math.round(Math.max(0, Math.min(1, ratio)) * 1000));
    }
    pageOutput.value = preferences.mode === 'paged'
      ? `${lang === 'es' ? 'Página' : 'Page'} ${currentPage + 1} ${lang === 'es' ? 'de' : 'of'} ${pageCount}`
      : `${Math.round(ratio * 100)}%`;
    previousButton.disabled = ratio <= .001;
    nextButton.disabled = ratio >= .999;

    const block = visibleBlock();
    const headingId = block?.dataset.readerHeading;
    const headingElement = headingId ? shell.querySelector<HTMLElement>(`#${CSS.escape(headingId)}`) : null;
    sectionOutput.textContent = headingElement?.textContent?.trim() || shell.querySelector('h1')?.textContent?.trim() || '';
  };

  const visibleBlock = () => {
    const immersive = shell.classList.contains('immersive');
    const bounds = immersive ? viewport.getBoundingClientRect() : { top: 72, bottom: window.innerHeight, left: 0, right: window.innerWidth };
    return contentBlocks.find(block => {
      const rect = block.getBoundingClientRect();
      return immersive && preferences.mode === 'paged'
        ? rect.right > bounds.left + 8 && rect.left < bounds.right - 8
        : rect.bottom > bounds.top + 8 && rect.top < bounds.bottom - 8;
    }) || contentBlocks[0];
  };

  const coverIsCurrent = () => {
    if (shell.classList.contains('immersive')) {
      if (preferences.mode === 'paged') return currentPage === 0;
      return viewport.scrollTop < Math.max(1, cover.offsetHeight * .65);
    }
    const bounds = cover.getBoundingClientRect();
    return bounds.bottom > 72 && bounds.top < window.innerHeight;
  };

  const currentAnchor = (): ReadingAnchor | undefined => coverIsCurrent() ? 'cover' : visibleBlock();

  const saveProgress = () => {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      if (coverIsCurrent()) {
        const progress: Progress = { slug, anchor: 'cover', heading: '', block: 0, progress: 0, updatedAt: new Date().toISOString() };
        localStorage.setItem(progressKey, JSON.stringify(progress));
        return;
      }
      const block = visibleBlock();
      if (!block) return;
      const ratio = preferences.mode === 'paged' ? currentPage / Math.max(1, pageCount - 1) : viewport.scrollTop / Math.max(1, viewport.scrollHeight - viewport.clientHeight);
      const progress: Progress = { slug, anchor: 'content', heading: block.dataset.readerHeading || '', block: Number(block.dataset.readerBlock || 0), progress: ratio, updatedAt: new Date().toISOString() };
      localStorage.setItem(progressKey, JSON.stringify(progress));
    }, 180);
  };

  const goToPage = (page: number, smooth = true) => {
    currentPage = Math.max(0, Math.min(pageCount - 1, page));
    viewport.scrollTo({ left: currentPage * viewport.clientWidth, behavior: smooth && !preferences.reducedMotion ? 'smooth' : 'auto' });
    updateStatus();
    saveProgress();
  };

  const navigate = (direction: -1 | 1) => {
    if (preferences.mode === 'paged') {
      goToPage(currentPage + direction);
      return;
    }
    viewport.scrollBy({ top: direction * viewport.clientHeight * .82, behavior: preferences.reducedMotion ? 'auto' : 'smooth' });
  };

  const repaginate = (anchor?: ReadingAnchor) => {
    shell.style.setProperty('--reader-page-width', `${viewport.clientWidth}px`);
    if (preferences.mode === 'paged') {
      pageCount = Math.max(1, Math.ceil((pages.scrollWidth - 1) / Math.max(1, viewport.clientWidth)));
      if (anchor === 'cover') {
        currentPage = 0;
      } else if (anchor) {
        const bounds = viewport.getBoundingClientRect();
        const position = anchor.getBoundingClientRect().left - bounds.left + viewport.scrollLeft;
        currentPage = Math.max(0, Math.floor(position / Math.max(1, viewport.clientWidth)));
      }
      goToPage(currentPage, false);
    } else {
      pageCount = 1;
      if (anchor === 'cover') viewport.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      else if (anchor) anchor.scrollIntoView({ block: 'start' });
      updateStatus();
      saveProgress();
    }
  };

  const restore = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || 'null') as Progress | null;
      if (!saved) return repaginate();
      const legacyCover = !saved.anchor && saved.progress <= .001 && !saved.heading && saved.block === 0;
      if (saved.anchor === 'cover' || legacyCover) return repaginate('cover');
      const selector = `[data-reader-heading="${CSS.escape(saved.heading || '')}"][data-reader-block="${Number(saved.block) || 0}"]`;
      const block = shell.querySelector<HTMLElement>(selector) || contentBlocks[Math.round(saved.progress * Math.max(0, contentBlocks.length - 1))];
      repaginate(block);
    } catch { repaginate(); }
  };

  previousButton.addEventListener('click', () => navigate(-1));
  nextButton.addEventListener('click', () => navigate(1));
  shell.querySelectorAll<HTMLButtonElement>('[data-reader-mode]').forEach(button => button.addEventListener('click', () => {
    const anchor = currentAnchor();
    preferences.mode = button.dataset.readerMode as ReaderMode;
    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    applyPreferences();
    requestAnimationFrame(() => repaginate(anchor));
  }));
  shell.querySelector('[data-reader-web]')?.addEventListener('click', () => {
    const anchor = currentAnchor();
    shell.classList.remove('immersive');
    reopenButton.hidden = false;
    document.body.style.overflow = '';
    requestAnimationFrame(() => anchor === 'cover' ? cover.scrollIntoView({ block: 'start' }) : anchor?.scrollIntoView({ block: 'start' }));
  });
  reopenButton.addEventListener('click', () => {
    const anchor = currentAnchor();
    shell.classList.add('immersive');
    reopenButton.hidden = true;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => repaginate(anchor));
  });
  const settingsButton = shell.querySelector<HTMLButtonElement>('[data-reader-settings]')!;
  const settingsPanel = shell.querySelector<HTMLElement>('[data-reader-settings-panel]')!;
  settingsButton.addEventListener('click', () => { settingsPanel.hidden = !settingsPanel.hidden; settingsButton.setAttribute('aria-expanded', String(!settingsPanel.hidden)); });
  shell.querySelector('[data-reader-settings-close]')?.addEventListener('click', () => { settingsPanel.hidden = true; settingsButton.setAttribute('aria-expanded', 'false'); settingsButton.focus(); });
  shell.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-pref]').forEach(control => control.addEventListener('input', () => {
    const anchor = currentAnchor();
    const key = control.dataset.pref as keyof Preferences;
    const value: string | number | boolean = control instanceof HTMLInputElement && control.type === 'checkbox' ? control.checked : control instanceof HTMLInputElement && control.type === 'range' ? Number(control.value) : control.value;
    (preferences as unknown as Record<string, unknown>)[key] = value;
    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    applyPreferences();
    requestAnimationFrame(() => repaginate(anchor));
  }));
  shell.querySelector('[data-reader-reset]')?.addEventListener('click', () => { const anchor = currentAnchor(); preferences = { ...defaults }; localStorage.removeItem(preferenceKey); applyPreferences(); requestAnimationFrame(() => repaginate(anchor)); });
  index.addEventListener('change', () => { const target = document.getElementById(index.value); if (target) repaginate(target); });
  scrubber.addEventListener('input', () => {
    if (preferences.mode === 'paged') {
      goToPage(Number(scrubber.value), false);
      return;
    }
    const ratio = Number(scrubber.value) / 1000;
    viewport.scrollTo({ top: ratio * Math.max(0, viewport.scrollHeight - viewport.clientHeight), behavior: 'auto' });
  });
  viewport.addEventListener('scroll', () => { if (preferences.mode === 'paged') currentPage = Math.round(viewport.scrollLeft / Math.max(1, viewport.clientWidth)); updateStatus(); saveProgress(); }, { passive: true });
  window.addEventListener('keydown', event => {
    if (!shell.classList.contains('immersive') || event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') { event.preventDefault(); navigate(1); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') { event.preventDefault(); navigate(-1); }
    if (event.key === 'Escape') {
      const anchor = currentAnchor();
      shell.classList.remove('immersive');
      reopenButton.hidden = false;
      document.body.style.overflow = '';
      requestAnimationFrame(() => anchor === 'cover' ? cover.scrollIntoView({ block: 'start' }) : anchor?.scrollIntoView({ block: 'start' }));
    }
  });
  let touchStart = 0;
  viewport.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') touchStart = event.clientX; });
  viewport.addEventListener('pointerup', event => { if (event.pointerType !== 'touch' || preferences.mode !== 'paged') return; const distance = event.clientX - touchStart; if (Math.abs(distance) > 45) navigate(distance < 0 ? 1 : -1); });
  window.addEventListener('resize', () => { window.clearTimeout(resizeTimer); const anchor = currentAnchor(); resizeTimer = window.setTimeout(() => repaginate(anchor), 120); });

  applyPreferences();
  document.body.style.overflow = 'hidden';
  Promise.all([document.fonts.ready, ...[...pages.querySelectorAll('img')].map(image => image.complete ? Promise.resolve() : new Promise<void>(resolve => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => resolve(), { once: true });
  }))]).then(restore);
}

document.querySelectorAll<HTMLElement>('[data-reader-shell]').forEach(initReader);
