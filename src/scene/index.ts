import { PortalScene } from './Experience';
import { state, store } from './State';

export function createPortalScene() {
  return new PortalScene(state, store);
}
