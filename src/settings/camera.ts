import { Vector3 } from 'three';

import { BindingConfig } from '@controllers/Debug';

/**
 * Debug variables.
 */
export type CameraSettings = typeof cameraSettings;
export type CameraConfig = BindingConfig<CameraSettings>;

export const cameraSettings = {
  cameraPosition: new Vector3(7, 7, 7),
  cameraFov: 25,
  cameraNear: 0.1,
  cameraFar: 100,
  controlsDamping: true,
};

export const cameraConfig: CameraConfig[] = [];
