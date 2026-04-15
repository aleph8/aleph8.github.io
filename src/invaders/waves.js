import { WAVE_PAUSE_MS, SHOP_EVERY_N, waveEnemyCount } from './constants.js';

export class WaveManager {
  constructor() {
    this.wave         = 0;
    this.pauseTimer   = 0;
    this.betweenWaves = false;

    this._onSpawn  = null; // (count, waveNum) => void
    this._onBanner = null; // (waveNum) => void
    this._onShop   = null; // () => void - called every SHOP_EVERY_N waves
  }

  start(onSpawn, onBanner, onShop) {
    this.wave         = 0;
    this.pauseTimer   = 0;
    this.betweenWaves = false;
    this._onSpawn     = onSpawn;
    this._onBanner    = onBanner;
    this._onShop      = onShop;
    this._triggerWave();
  }

  _triggerWave() {
    this.wave++;
    if (this._onBanner) this._onBanner(this.wave);
    setTimeout(() => {
      if (this._onSpawn) this._onSpawn(waveEnemyCount(this.wave), this.wave);
    }, 1500);
  }

  /** Resume after shop - fire the next wave immediately. */
  triggerNextWave() {
    this._triggerWave();
  }

  update(dt, enemies) {
    if (this.betweenWaves) {
      this.pauseTimer -= dt;
      if (this.pauseTimer <= 0) {
        this.betweenWaves = false;
        const shopDue = this.wave % SHOP_EVERY_N === 0 && this._onShop;
        if (shopDue) {
          this._onShop();
        } else {
          this._triggerWave();
        }
      }
    } else if (enemies.length === 0 && this.wave > 0) {
      // Wave cleared - wait before next wave (or shop)
      this.betweenWaves = true;
      this.pauseTimer   = WAVE_PAUSE_MS;
    }
  }

  reset() {
    this.wave         = 0;
    this.pauseTimer   = 0;
    this.betweenWaves = false;
    this._onSpawn     = null;
    this._onBanner    = null;
    this._onShop      = null;
  }
}
