import { StoreInstance } from '@helpers/classes/StoreInstance';
import { CameraSettings, cameraSettings } from '@settings/camera';

interface CameraState extends CameraSettings {}

export class CameraStore extends StoreInstance<CameraState> {
  constructor() {
    super({
      ...cameraSettings,
    });
  }
}
