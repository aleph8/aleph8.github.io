/* tslint:disable */
/* eslint-disable */

export enum LifeRule {
    Conway = 0,
    HighLife = 1,
    Seeds = 2,
}

export class Universe {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Returns a copy, in row order, with the first cell in the highest bit.
     */
    cells(): Uint8Array;
    clear(): void;
    getCell(row: number, col: number): boolean;
    height(): number;
    constructor(width: number, height: number, rule: LifeRule);
    setCell(row: number, col: number, value: boolean): void;
    tick(): void;
    width(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_universe_free: (a: number, b: number) => void;
    readonly universe_cells: (a: number) => [number, number];
    readonly universe_clear: (a: number) => void;
    readonly universe_getCell: (a: number, b: number, c: number) => number;
    readonly universe_height: (a: number) => number;
    readonly universe_new: (a: number, b: number, c: number) => [number, number, number];
    readonly universe_setCell: (a: number, b: number, c: number, d: number) => void;
    readonly universe_tick: (a: number) => void;
    readonly universe_width: (a: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
