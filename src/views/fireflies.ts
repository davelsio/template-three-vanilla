import { WebGLView } from '@helpers/ui';
import { fireflyFragmentShader, fireflyVertexShader } from '@shaders/fireflies';
import { Store } from '@state/store';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Points,
  ShaderMaterial,
  Uniform,
} from 'three';

interface Props {
  baseSize: number;
}

export class Fireflies extends Group implements WebGLView {
  private _props = {
    baseSize: 0.75,
    color: new Color(0xffffff),
  };

  private geometry: BufferGeometry;
  private material: ShaderMaterial;
  private fireflies: Points;

  public namespace = 'Fireflies';

  constructor(props?: Partial<Props>) {
    super();
    this._props = Object.assign(this._props, props);
  }

  public async init() {
    this.setupGeometry();
    this.setupMaterial();
    this.setupPoints();
    this.setupSubscriptions();

    Store.world.addViewLoaded(this.namespace);
  }

  public destroy() {
    Store.debug.unsubscribe(this.namespace);
    Store.stage.unsubscribe(this.namespace);
    Store.time.unsubscribe(this.namespace);

    this.geometry.dispose();
    this.material.dispose();
    this.remove(this.fireflies);
  }

  /* SETUP */

  private setupGeometry() {
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
  }

  private setupMaterial() {
    this.material = new ShaderMaterial({
      fragmentShader: fireflyFragmentShader,
      vertexShader: fireflyVertexShader,
      //
      blending: AdditiveBlending, // Blend the material color with the background color
      depthWrite: false, // Prevent particles to hide other particles
      transparent: true,
      //
      uniforms: {
        uColor: new Uniform(this._props.color),
        uSize: new Uniform(this._props.baseSize),
        uScale: new Uniform(Store.stage.state.height * 0.5),
        uTime: new Uniform(0),
      },
    });
  }

  private setupPoints() {
    this.fireflies = new Points(this.geometry, this.material);
    this.add(this.fireflies);
  }

  private setupSubscriptions() {
    Store.debug.subscribe(
      this.namespace,
      (state) => state.enabled,
      this.debug,
      { fireImmediately: true }
    );

    Store.stage.subscribe(
      this.namespace,
      (state) => state.pixelRatio,
      this.resize
    );

    Store.time.subscribe(this.namespace, (state) => state.elapsed, this.update);
  }

  /* CALLBACKS */

  private debug = (active?: boolean) => {
    if (!active) return;
    Store.debug.addConfig({
      folder: {
        title: 'Fireflies',
      },
      bindings: [
        {
          object: this._props,
          key: 'baseSize',
          options: {
            label: 'baseSize',
            min: 0.01,
            max: 2.0,
            step: 0.01,
          },
        },
        {
          object: this._props,
          key: 'color',
          options: {
            label: 'uColor',
            color: { type: 'float' },
          },
        },
      ],
    });
  };

  private resize = (pixelRatio: number) => {
    /**
     * Ensure that the fireflies are correctly sized if the user moves the
     * browser window to another screen with a different pixel ratio.
     */
    this.material.uniforms.uSize.value = this._props.baseSize * pixelRatio;
  };

  private update = (elapsed: number) => {
    this.material.uniforms.uTime.value = elapsed;
  };
}
