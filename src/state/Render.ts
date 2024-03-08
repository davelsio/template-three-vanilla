import { StoreInstance } from '@helpers/StoreInstance';
import { RenderSettings, renderSettings } from '@settings/renderer';

export interface RenderState extends RenderSettings {}

export class RenderStore extends StoreInstance<RenderState> {
  constructor() {
    super({
      ...renderSettings,
    });
  }
}
