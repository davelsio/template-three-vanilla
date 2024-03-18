import gsap from 'gsap';
import { Mesh, PlaneGeometry, ShaderMaterial, Uniform, Vector4 } from 'three';

import { WebGLView } from '@helpers/classes/WebGLView';
import { ColorWithAlpha } from '@helpers/types/ColorWithAlpha';
import {
  barFragmentShader,
  barVertexShader,
  overlayFragmentShader,
  overlayVertexShader,
} from '@shaders/progress';
import { Store } from '@state/Store';

export interface LoadingProps {
  loadingColor: ColorWithAlpha;
  loadingDuration: number;
}

export class Loading extends WebGLView<LoadingProps> {
  private _barGeometry: PlaneGeometry;
  private _barMaterial: ShaderMaterial;
  private _barMesh: Mesh;

  private _overlayGeometry: PlaneGeometry;
  private _overlayMaterial: ShaderMaterial;
  private _overlayMesh: Mesh;

  constructor() {
    super('Loading', {
      loadingColor: { r: 0.03, g: 0.01, b: 0.0, a: 1.0 },
      loadingDuration: 0.5,
      withLoading: false,
    });
    void this.init(
      this.setupOverlayGeometry,
      this.setupOverlayMaterial,
      this.setupOverlayMesh,
      this.setupBarGeometry,
      this.setupBarMaterial,
      this.setupBarMesh,
      this.setupSubscriptions
    );
  }

  public destroy() {
    Store.unsubscribe(this.namespace);
    this._barGeometry.dispose();
    this._barMaterial.dispose();
    this._overlayGeometry.dispose();
    this._overlayMaterial.dispose();
    this.remove(this._barMesh, this._overlayMesh);
    this._scene.remove(this);
  }

  /* SETUP */

  private setupBarGeometry = () => {
    this._barGeometry = new PlaneGeometry(1.0, 0.04, 1, 1);
  };

  private setupBarMaterial = () => {
    this._barMaterial = new ShaderMaterial({
      uniforms: {
        uAlpha: new Uniform(1.0),
        uProgress: new Uniform(-this._props.loadingDuration),
      },
      fragmentShader: barFragmentShader,
      vertexShader: barVertexShader,
      transparent: true,
    });
  };

  private setupBarMesh = () => {
    this._barMesh = new Mesh(this._barGeometry, this._barMaterial);
    this.add(this._barMesh);
  };

  private setupOverlayGeometry = () => {
    this._overlayGeometry = new PlaneGeometry(2, 2, 1, 1);
  };

  private setupOverlayMaterial = () => {
    const { r, g, b, a } = this._props.loadingColor;
    this._overlayMaterial = new ShaderMaterial({
      uniforms: {
        uAlpha: new Uniform(1.0),
        uColor: new Uniform(new Vector4(r, g, b, a)),
      },
      fragmentShader: overlayFragmentShader,
      vertexShader: overlayVertexShader,
      transparent: true,
    });
  };

  private setupOverlayMesh = () => {
    this._overlayMesh = new Mesh(this._overlayGeometry, this._overlayMaterial);
    this.add(this._overlayMesh);
  };

  private setupSubscriptions = () => {
    const { world } = Store.getSubscribers(this.namespace);

    world(
      (state) => state.viewsProgress,
      (progress) => {
        gsap
          .to(this._barMaterial.uniforms.uProgress, {
            duration: this._props.loadingDuration,
            value: progress,
          })
          .then((res) => {
            if (res.vars.value === 1) {
              this.destroy();
            }
          });
      }
    );
  };
}
