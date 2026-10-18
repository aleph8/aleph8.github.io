import type { Universe } from '../../public/lifelike/v0.1.0/lifelike_wasm';

export type Rule = 'Conway' | 'HighLife' | 'Seeds';
export type MatrixUniverse = Pick<Universe, 'width' | 'height' | 'cells' | 'getCell' | 'setCell' | 'tick' | 'clear' | 'free'>;

type WasmModule = typeof import('../../public/lifelike/v0.1.0/lifelike_wasm');
let engine: Promise<WasmModule> | undefined;

// Keep the current matrix API behind this factory; the viewer owns its instance.
export async function createMatrixUniverse(width: number, height: number, rule: Rule): Promise<MatrixUniverse> {
  engine ??= (async () => {
    const url = new URL(`${import.meta.env.BASE_URL}lifelike/v0.1.0/lifelike_wasm.js`, window.location.origin).href;
    const module: WasmModule = await import(/* @vite-ignore */ url);
    await module.default();
    return module;
  })().catch((error) => {
    engine = undefined;
    throw error;
  });
  const module = await engine;
  return new module.Universe(width, height, module.LifeRule[rule]);
}

export const rules: Rule[] = ['Conway', 'HighLife', 'Seeds'];

export const patterns = [
  { id: 'replicator', name: 'Replicator', rule: 'HighLife', rows: ['..OOO', '.O..O', 'O...O', 'O..O.', 'OOO..'] },
  { id: 'glider', name: 'Glider', rule: 'Conway', rows: ['.O.', '..O', 'OOO'] },
  { id: 'blinker', name: 'Blinker', rule: 'Conway', rows: ['OOO'] },
  { id: 'toad', name: 'Toad', rule: 'Conway', rows: ['.OOO', 'OOO.'] },
  { id: 'r-pentomino', name: 'R-pentomino', rule: 'Conway', rows: ['.OO', 'OO.', '.O.'] },
  { id: 'leaf', name: 'Lifelike Leaf', rule: 'HighLife', rows: ['......OO', '....OO.O', '...O..OO', '..O.O.O.', '..OO.O..', '.O.OO...', '.OO.....', 'O.......'] },
] satisfies { id: string; name: string; rule: Rule; rows: string[] }[];
