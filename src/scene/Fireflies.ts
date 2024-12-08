import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  Vector2,
} from 'three';

import type { TimeAtomValue } from '@atoms/atomWithTime';
import type { ViewportAtomValue } from '@atoms/atomWithViewport';
import { type State, WebGLView } from '@helpers/three';
import { fireflyFragmentShader, fireflyVertexShader } from '@shaders/fireflies';

import { FirefliesMaterial } from './FirefliesMaterial';
import { fireflyColorAtom, fireflySizeAtom } from './PortalState';

export class Fireflies extends WebGLView {
  private geometry: BufferGeometry;
  private material: FirefliesMaterial;
  private fireflies: Points;

  constructor(state: State) {
    super('Fireflies', state);
    void this.init(
      this.setupGeometry,
      this.setupMaterial,
      this.setupPoints,
      this.setupSubscriptions
    );

    void this.dispose(() => {
      this.geometry.dispose();
      this.material.dispose();
    });
  }

  /* SETUP SCENE */

  private setupGeometry = () => {
    this.geometry = new BufferGeometry();

    const count = 30;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const [x, y, z] = [i * 3 + 0, i * 3 + 1, i * 3 + 2];

      // Position firefly within the plane (ground) coordinates [-2, 2], but
      // slightly constrained (*3.5 instead of *4) to avoid the firefly to
      // appear too close to the edges of the plane.
      positions[x] = (Math.random() - 0.5) * 3.5;
      positions[z] = (Math.random() - 0.5) * 3.5;

      // Add some random elevation to the firefly
      positions[y] = (Math.random() + 0.1) * 1.5;

      // Randomly scale the firefly size
      scales[i] = Math.random() * 0.5 + 0.5;
    }

    this.geometry.setAttribute('position', new BufferAttribute(positions, 3));
    this.geometry.setAttribute('aScale', new BufferAttribute(scales, 1));
  };

  private setupMaterial = () => {
    const uSize = this._state.store.get(fireflySizeAtom);
    const uColor = this._state.store.get(fireflyColorAtom);

    this.material = new FirefliesMaterial({
      blending: AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexShader: fireflyVertexShader,
      fragmentShader: fireflyFragmentShader,
      uniforms: {
        uColor: new Color(uColor),
        uSize,
        uTime: 0,
        uResolution: new Vector2(),
      },
    });
  };

  private setupPoints = () => {
    this.fireflies = new Points(this.geometry, this.material);
    this.add(this.fireflies);
  };

  private setupSubscriptions = () => {
    this.subToAtom(this._timeAtom, this.updateTime);
    this.subToAtom(this._vpAtom, this.updateResolution, {
      callImmediately: true,
    });
    this.subToAtom(fireflyColorAtom, this.updateColor);
    this.subToAtom(fireflySizeAtom, this.updateSize, {
      callImmediately: true,
    });
  };

  /* CALLBACKS */

  private updateResolution = (state: ViewportAtomValue) => {
    /**
     * Ensure that the fireflies are correctly sized if the user moves the
     * browser window to another screen with a different pixel ratio.
     */
    const width = state.width * state.pixelRatio;
    const height = state.height * state.pixelRatio;
    this.material.uResolution.set(width, height);
  };

  private updateSize = (size: number) => {
    this.material.uSize = size;
  };

  private updateColor = (color: string) => {
    this.material.uColor = new Color(color);
  };

  private updateTime = ({ elapsed }: TimeAtomValue) => {
    this.material.uTime = elapsed;
  };
}
