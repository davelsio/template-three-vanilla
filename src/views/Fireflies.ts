import { WebGLView } from '@helpers/WebGLView';
import { fireflyFragmentShader, fireflyVertexShader } from '@shaders/fireflies';
import { StageState } from '@state/Stage';
import { Store } from '@state/Store';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  Scene,
  ShaderMaterial,
  Uniform,
  Vector2,
} from 'three';

export class Fireflies extends WebGLView {
  private geometry: BufferGeometry;
  private material: ShaderMaterial;
  private fireflies: Points;

  constructor(scene: Scene) {
    super('Fireflies', scene);
    super.flagAsLoading();
    this.init();
  }

  public async init() {
    this.setupGeometry();
    this.setupMaterial();
    this.setupPoints();
    this.setupSubscriptions();
    super.flagAsLoaded();
  }

  public destroy() {
    Store.unsubscribe(this.namespace);
    this.geometry.dispose();
    this.material.dispose();
    this.remove(this.fireflies);
    this._scene.remove(this);
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
        uColor: new Uniform(Store.debug.state.color),
        uResolution: new Uniform(
          new Vector2(
            Store.stage.state.width * Store.stage.state.pixelRatio,
            Store.stage.state.height * Store.stage.state.pixelRatio
          )
        ),
        uSize: new Uniform(Store.debug.state.baseSize),
        uTime: new Uniform(0),
      },
    });
  }

  private setupPoints() {
    this.fireflies = new Points(this.geometry, this.material);
    this.add(this.fireflies);
  }

  private setupSubscriptions() {
    const debugSub = Store.debug.getSubscriber(this.namespace);
    debugSub((state) => state.baseSize, this.updateSize);
    debugSub((state) => state.color, this.updateColor);
    Store.stage.subscribe(this.namespace, (state) => state, this.resize);
    Store.time.subscribe(
      this.namespace,
      (state) => state.elapsed,
      this.updateTime
    );
  }

  /* CALLBACKS */

  private resize = (state: StageState) => {
    /**
     * Ensure that the fireflies are correctly sized if the user moves the
     * browser window to another screen with a different pixel ratio.
     */
    const width = state.width * state.pixelRatio;
    const height = state.height * state.pixelRatio;
    this.material.uniforms.uResolution.value.set(width, height);
  };

  private updateSize = (size: number) => {
    this.material.uniforms.uSize.value = size;
  };

  private updateColor = (color: Color) => {
    this.material.uniforms.uColor.value = color;
  };

  private updateTime = (elapsed: number) => {
    this.material.uniforms.uTime.value = elapsed;
  };
}
