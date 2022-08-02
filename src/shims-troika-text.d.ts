declare module 'troika-three-text' {
  import { Mesh, Vector3 } from 'three';
  class Text extends Mesh {
    text: string;
    fontSize: number;
    position: Vector3;
    sync: (callback?: () => void) => void;
  }

  function preloadFont(
    options: {
      font?: string;
      characters?: string | string[];
      sdfGlyphSize?: number;
    },
    onLoaded: () => void
  ): void;
}
