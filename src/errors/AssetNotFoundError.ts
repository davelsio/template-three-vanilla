import { AssetType } from '@loaders/assets';

export class AssetNotFoundError extends Error {
  public constructor(asset: string, type: AssetType) {
    super(`Asset of type "${type}" not found: ${asset}`);
  }
}
