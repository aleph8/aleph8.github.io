import { createMatrixUniverse, patterns, type MatrixUniverse, type Rule } from '../lib/lifelike';

class LifelikeVisor extends HTMLElement {
  private universe?: MatrixUniverse;
  private timer?: number;
  private events?: AbortController;
  private resize?: ResizeObserver;
  private fitFrame?: number;
  private revision = 0;
  private generation = 0;
  private busy = false;
  private grid = false;

  private element<T extends Element>(selector: string): T {
    return this.querySelector<T>(selector)!;
  }

  connectedCallback() {
    this.events = new AbortController();
    const options = { signal: this.events.signal };
    this.resize = new ResizeObserver(() => this.scheduleFit());
    this.resize.observe(this);
    window.addEventListener('resize', () => this.scheduleFit(), options);
    void document.fonts.ready.then(() => { if (this.isConnected) this.scheduleFit(); });
    this.element<HTMLSelectElement>('[data-pattern]').addEventListener('change', () => {
      const pattern = this.preset();
      this.element<HTMLSelectElement>('[data-rule]').value = pattern.rule;
      void this.reset();
    }, options);
    this.element('[data-rule]').addEventListener('change', () => void this.reset(), options);
    const info = this.element<HTMLButtonElement>('[data-info-button]');
    info.addEventListener('click', () => {
      const visible = info.getAttribute('aria-pressed') !== 'true';
      info.setAttribute('aria-pressed', String(visible));
      this.element('[data-info]').toggleAttribute('hidden', !visible);
    }, options);
    const grid = this.element<HTMLButtonElement>('[data-grid-button]');
    this.grid = grid.getAttribute('aria-pressed') === 'true';
    grid.addEventListener('click', () => {
      this.grid = !this.grid;
      grid.setAttribute('aria-pressed', String(this.grid));
      this.draw();
    }, options);
    this.element('[data-play-button]').addEventListener('click', () => this.timer === undefined ? this.start() : this.stop(), options);
    this.element('[data-step]').addEventListener('click', () => { this.stop(); this.tick(); }, options);
    this.element('[data-reset]').addEventListener('click', () => void this.reset(), options);
    this.element('[data-clear]').addEventListener('click', () => {
      this.stop();
      this.universe?.clear();
      this.generation = 0;
      this.draw();
    }, options);
    this.element<HTMLCanvasElement>('canvas').addEventListener('click', (event) => {
      if (!this.universe || this.busy) return;
      const bounds = this.element('canvas').getBoundingClientRect();
      const row = Math.floor((event.clientY - bounds.top) / bounds.height * this.universe.height());
      const col = Math.floor((event.clientX - bounds.left) / bounds.width * this.universe.width());
      this.universe.setCell(row, col, !this.universe.getCell(row, col));
      this.draw();
    }, options);
    void this.reset(this.dataset.autoplay === 'true' && !matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  disconnectedCallback() {
    this.revision++;
    this.stop();
    this.events?.abort();
    this.resize?.disconnect();
    if (this.fitFrame !== undefined) cancelAnimationFrame(this.fitFrame);
    this.fitFrame = undefined;
    this.universe?.free();
    this.universe = undefined;
  }

  private scheduleFit() {
    if (this.fitFrame !== undefined) return;
    this.fitFrame = requestAnimationFrame(() => {
      this.fitFrame = undefined;
      if (this.isConnected) this.fit();
    });
  }

  private fit() {
    const board = this.element<HTMLElement>('.board');
    if (this.dataset.fullViewport === 'true') {
      if (!this.universe || this.busy) return;
      const width = Math.max(8, Math.floor(board.clientWidth / 10));
      const height = Math.max(8, Math.floor(board.clientHeight / 10));
      if (width !== this.universe.width() || height !== this.universe.height()) {
        void this.reset(this.timer !== undefined, { width, height });
      }
      return;
    }
    const controls = this.element<HTMLElement>('.toolbar').offsetHeight + 2;
    // Content above an embed must not shrink its universe to a thumbnail.
    const available = window.innerHeight - controls - 96;
    const height = Math.floor(Math.max(200, Math.min(560, available)));
    const ratio = Number(this.dataset.width) / Number(this.dataset.height);
    const parentWidth = this.parentElement?.clientWidth ?? this.clientWidth;
    const width = Math.floor(Math.min(parentWidth, height * ratio));
    this.style.setProperty('--visor-width', `${width}px`);
  }

  private preset() {
    const value = this.element<HTMLSelectElement>('[data-pattern]').value;
    return patterns.find((pattern) => pattern.id === value) ?? patterns[0];
  }

  private async reset(autoplay = false, dimensions?: { width: number; height: number }) {
    this.stop();
    const revision = ++this.revision;
    this.busy = true;
    this.element<HTMLFieldSetElement>('fieldset').disabled = true;
    const error = this.element<HTMLParagraphElement>('[data-error]');
    error.hidden = true;
    try {
      const rule = this.element<HTMLSelectElement>('[data-rule]').value as Rule;
      const universe = await createMatrixUniverse(dimensions?.width ?? Number(this.dataset.width), dimensions?.height ?? Number(this.dataset.height), rule);
      if (!this.isConnected || revision !== this.revision) { universe.free(); return; }
      if (dimensions && this.universe) {
        const previous = this.universe;
        const bytes = previous.cells();
        const top = Math.floor((universe.height() - previous.height()) / 2);
        const left = Math.floor((universe.width() - previous.width()) / 2);
        for (let row = 0; row < previous.height(); row++) {
          for (let col = 0; col < previous.width(); col++) {
            const index = row * previous.width() + col;
            const r = row + top, c = col + left;
            if (r >= 0 && c >= 0 && r < universe.height() && c < universe.width() && (bytes[index >> 3] & (1 << (7 - index % 8)))) {
              universe.setCell(r, c, true);
            }
          }
        }
      } else {
        const rows = this.preset().rows;
        const top = Math.floor((universe.height() - rows.length) / 2);
        const left = Math.floor((universe.width() - rows[0].length) / 2);
        rows.forEach((row, r) => [...row].forEach((cell, c) => {
          if (cell === 'O') universe.setCell(top + r, left + c, true);
        }));
        this.generation = 0;
      }
      this.universe?.free();
      this.universe = universe;
      this.dataset.width = String(universe.width());
      this.dataset.height = String(universe.height());
      const canvas = this.element<HTMLCanvasElement>('canvas');
      canvas.width = universe.width() * 10;
      canvas.height = universe.height() * 10;
      this.draw();
      if (autoplay) this.start();
    } catch (cause) {
      if (!this.isConnected || revision !== this.revision) return;
      error.textContent = this.dataset.errorMessage!;
      error.hidden = false;
      console.error('Lifelike viewer:', cause);
    } finally {
      if (this.isConnected && revision === this.revision) {
        this.busy = false;
        this.element<HTMLFieldSetElement>('fieldset').disabled = !this.universe;
        this.scheduleFit();
      }
    }
  }

  private start() {
    if (!this.universe || this.timer !== undefined) return;
    this.timer = window.setInterval(() => this.tick(), Number(this.dataset.interval));
    this.playbackState(true);
  }

  private stop() {
    window.clearInterval(this.timer);
    this.timer = undefined;
    this.playbackState(false);
  }

  private playbackState(running: boolean) {
    const button = this.element<HTMLButtonElement>('[data-play-button]');
    const label = (running ? this.dataset.pause : this.dataset.play)!;
    button.setAttribute('aria-label', label);
    button.title = label;
    button.setAttribute('aria-pressed', String(running));
    this.element('[data-play-icon]').toggleAttribute('hidden', running);
    this.element('[data-pause-icon]').toggleAttribute('hidden', !running);
  }

  private tick() {
    if (!this.universe) return;
    this.universe.tick();
    this.generation++;
    this.draw();
  }

  private draw() {
    if (!this.universe) return;
    const canvas = this.element<HTMLCanvasElement>('canvas');
    const context = canvas.getContext('2d')!;
    const bytes = this.universe.cells();
    const width = this.universe.width();
    const height = this.universe.height();
    const cell = canvas.width / width;
    let population = 0;
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#8ce8ae';
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const index = row * width + col;
        if (bytes[index >> 3] & (1 << (7 - index % 8))) {
          population++;
          context.fillRect(col * cell, row * cell, cell - 1, cell - 1);
        }
      }
    }
    if (this.grid) {
      context.beginPath();
      context.strokeStyle = '#e5e5e5';
      context.lineWidth = 1;
      for (let col = 0; col <= width; col++) {
        const x = Math.min(col * cell + .5, canvas.width - .5);
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
      }
      for (let row = 0; row <= height; row++) {
        const y = Math.min(row * cell + .5, canvas.height - .5);
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
      }
      context.stroke();
    }
    this.element('[data-generation]').textContent = String(this.generation);
    this.element('[data-population]').textContent = String(population);
  }
}

if (!customElements.get('lifelike-visor')) customElements.define('lifelike-visor', LifelikeVisor);
