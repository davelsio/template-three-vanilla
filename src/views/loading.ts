import { WebGLView } from '@helpers/ui';
import {
  barFragmentShader,
  barVertexShader,
  overlayFragmentShader,
  overlayVertexShader,
} from '@shaders/progress';
import { Store } from '@state/store';
import gsap from 'gsap';
import { Group, Mesh, PlaneGeometry, ShaderMaterial } from 'three';

export interface LoadingProps {
  loadingDelay: number;
}

export class Loading extends Group implements WebGLView {
  private _props = {
    loadAnimDuration: 0.5,
  };

  private _barGeometry: PlaneGeometry;
  private _barMaterial: ShaderMaterial;
  private _barMesh: Mesh;

  private _overlayGeometry: PlaneGeometry;
  private _overlayMaterial: ShaderMaterial;
  private _overlayMesh: Mesh;

  public namespace = 'Loading';

  constructor(props?: Partial<LoadingProps>) {
    super();
    this._props = Object.assign(this._props, props);
  }

  public async init() {
    this.setupOverlayGeometry();
    this.setupOverlayMaterial();
    this.setupOverlayMesh();

    this.setupBarGeometry();
    this.setupBarMaterial();
    this.setupBarMesh();

    this.setupSubscriptions();
  }

  public destroy() {
    Store.world.unsubscribe(this.namespace);
    this._barGeometry.dispose();
    this._barMaterial.dispose();
    this._overlayGeometry.dispose();
    this._overlayMaterial.dispose();
    this.remove(this._barMesh, this._overlayMesh);
  }

  /* SETUP */

  private setupBarGeometry() {
    this._barGeometry = new PlaneGeometry(1.0, 0.04, 1, 1);
  }

  private setupBarMaterial() {
    this._barMaterial = new ShaderMaterial({
      uniforms: {
        uAlpha: { value: 1.0 },
        uProgress: { value: -0.5 },
      },
      fragmentShader: barFragmentShader,
      vertexShader: barVertexShader,
      transparent: true,
    });
  }

  private setupBarMesh() {
    this._barMesh = new Mesh(this._barGeometry, this._barMaterial);
    this.add(this._barMesh);
  }

  private setupOverlayGeometry() {
    this._overlayGeometry = new PlaneGeometry(2, 2, 1, 1);
  }

  private setupOverlayMaterial() {
    this._overlayMaterial = new ShaderMaterial({
      uniforms: {
        uAlpha: { value: 1.0 },
      },
      fragmentShader: overlayFragmentShader,
      vertexShader: overlayVertexShader,
      transparent: true,
    });
  }

  private setupOverlayMesh() {
    this._overlayMesh = new Mesh(this._overlayGeometry, this._overlayMaterial);
    this.add(this._overlayMesh);
  }

  private setupSubscriptions() {
    Store.world.subscribe(
      this.namespace,
      (state) => state.viewsProgress,
      (progress) => {
        gsap
          .to(this._barMaterial.uniforms.uProgress, {
            duration: 0.5,
            value: progress,
          })
          .then((res) => {
            if (res.vars.value === 1) {
              Store.world.setLoadingReady();
            }
          });
      }
    );
  }
}
