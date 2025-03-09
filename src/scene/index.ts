import { PortalScene } from './Experience';
import { state } from './State';

export function createPortalScene() {
  return new PortalScene(state);
}
