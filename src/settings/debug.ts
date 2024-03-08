import { BindingConfig } from '@controllers/Debug';

/**
 * Debug variables.
 */
export type DebugSettings = typeof debugSettings;
export type DebugConfig = BindingConfig<DebugSettings>;

export const debugSettings = {};

export const debugConfig: DebugConfig[] = [];
