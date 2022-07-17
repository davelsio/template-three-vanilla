import gsap from 'gsap';
import { Subscription } from 'rxjs';
import { Group, Mesh, PlaneBufferGeometry, ShaderMaterial } from 'three';

import {
  barFragmentShader,
  barVertexShader,
  overlayFragmentShader,
  overlayVertexShader,
} from '../shaders/progress';
import { Store } from '../store';
import { WebGLView } from '../types/ui';

export interface LoadingProps {
  loadingDelay: number;
}

export class Loading extends Group implements WebGLView {
  private _props = {
    loadingDelay: 0.5,
  };

  private _subscriptions: Subscription[] = [];

  private _barGeometry: PlaneBufferGeometry;
  private _barMaterial: ShaderMaterial;
  private _barMesh: Mesh;

  private _overlayGeometry: PlaneBufferGeometry;
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
    this._subscriptions.forEach((sub) => sub.unsubscribe());
    this._barGeometry.dispose();
    this._barMaterial.dispose();
    this._overlayGeometry.dispose();
    this._overlayMaterial.dispose();
    this.remove(this._barMesh, this._overlayMesh);
  }

  /* SETUP */

  private setupBarGeometry() {
    this._barGeometry = new PlaneBufferGeometry(1.0, 0.04, 1, 1);
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
    this._overlayGeometry = new PlaneBufferGeometry(2, 2, 1, 1);
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
    const worldSub = Store.world.subscribe((state) => {
      this.animate(
        state.viewsLoaded[state.viewsLoaded.length - 1],
        state.viewsProgress
      );
    });
    this._subscriptions.push(worldSub);
  }

  /* CALLBACKS */

  private animate = (view: string, progress: number) => {
    gsap.to(this._barMaterial.uniforms.uProgress, {
      duration: this._props.loadingDelay,
      value: progress,
    });
  };
}
