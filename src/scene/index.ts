import { PortalScene } from './Experience';
import { portalState } from './State';

export function createPortalScene() {
  return new PortalScene(portalState);
}
