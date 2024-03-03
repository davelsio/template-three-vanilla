import { WebGLView } from '@helpers/webgl-view';
import { ResourceLoader } from '@loaders/resources';
import { portalFragmentShader, portalVertexShader } from '@shaders/portal';
import { Store } from '@state/store';
import {
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  Uniform,
} from 'three';
import { GLTF } from 'three-stdlib';

interface ModelMeshes {
  baked: Mesh;
  poleLightL: Mesh;
  poleLightR: Mesh;
  portalLight: Mesh;
}

interface ModelMaterials {
  baked: MeshBasicMaterial;
  poleLight: MeshBasicMaterial;
  portalLight: ShaderMaterial;
}

interface Props {
  poleLightColor: Color;
  portalColorStart: Color;
  portalColorEnd: Color;
  uvDisplacementOffset: number;
  uvStrengthOffset: number;
}

export class Portal extends WebGLView<Props> {
  private portalBakedTexture: Texture;
  private portalScene: GLTF;

  private model: Group;
  private meshes: ModelMeshes;
  private materials: ModelMaterials;

  public namespace = 'Portal';

  constructor(scene: Scene, props?: Partial<Props>) {
    super(scene, {
      poleLightColor: new Color(0xffffff),
      portalColorStart: new Color(0x000000),
      portalColorEnd: new Color(0xffffff),
      uvDisplacementOffset: 5.0,
      uvStrengthOffset: 5.0,
      ...props,
    });
    super.flagAsLoading();
    this.init();
  }

  public async init() {
    await this.setupAssets();
    this.setupMaterial();
    this.setupModel();
    this.setupSubscriptions();
    super.flagAsLoaded();
  }

  public destroy() {
    Store.debug.unsubscribe(this.namespace);
    Store.time.unsubscribe(this.namespace);

    this.materials.baked.dispose();
    this.materials.poleLight.dispose();
    this.materials.portalLight.dispose();
    this.remove(this.model);
    this._scene.remove(this);
  }

  /* SETUP */

  private async setupAssets() {
    this.portalBakedTexture =
      await ResourceLoader.loadTexture('portalBakedTexture');
    this.portalBakedTexture.flipY = false;
    this.portalBakedTexture.colorSpace = SRGBColorSpace;
    this.portalScene = await ResourceLoader.loadGltfModel('portalModel');
  }

  private setupMaterial() {
    const bakedMaterial = new MeshBasicMaterial({
      map: this.portalBakedTexture,
    });

    const poleLightMaterial = new MeshBasicMaterial({
      color: this._props.poleLightColor,
    });

    const portalLightMaterial = new ShaderMaterial({
      fragmentShader: portalFragmentShader,
      vertexShader: portalVertexShader,
      uniforms: {
        uColorEnd: new Uniform(this._props.portalColorEnd),
        uColorStart: new Uniform(this._props.portalColorStart),
        uOffsetDisplacementUv: new Uniform(this._props.uvDisplacementOffset),
        uOffsetStrengthUv: new Uniform(this._props.uvStrengthOffset),
        uTime: new Uniform(0),
      },
    });

    this.materials = {
      baked: bakedMaterial,
      poleLight: poleLightMaterial,
      portalLight: portalLightMaterial,
    };
  }

  private setupModel() {
    this.model = this.portalScene.scene;
    this.model.name = 'PortalScene';

    try {
      this.meshes = Object.fromEntries(
        this.model.children.map((child) => {
          return [child.name, child];
        })
      ) as unknown as ModelMeshes;

      this.meshes.baked.material = this.materials.baked;
      this.meshes.poleLightL.material = this.materials.poleLight;
      this.meshes.poleLightR.material = this.materials.poleLight;
      this.meshes.portalLight.material = this.materials.portalLight;
    } catch (error) {
      console.error(
        'One or more of the model meshes in the Portal',
        'scene could not be assigned a material.',
        error
      );
    }
    this.add(this.model);
  }

  private setupSubscriptions() {
    Store.debug.subscribe(
      this.namespace,
      (state) => state.enabled,
      this.debug,
      { fireImmediately: true }
    );

    Store.time.subscribe(this.namespace, (state) => state.elapsed, this.update);
  }

  /* CALLBACKS */

  private debug = (active?: boolean) => {
    if (!active) return;

    Store.debug.addConfig({
      folder: {
        title: 'Portal',
      },
      bindings: [
        {
          object: this._props,
          key: 'portalColorStart',
          options: {
            label: 'uColorStart',
            color: { type: 'float' },
          },
        },
        {
          object: this._props,
          key: 'portalColorEnd',
          options: {
            label: 'uColorEnd',
            color: { type: 'float' },
          },
        },
        {
          object: this._props,
          key: 'uvDisplacementOffset',
          options: {
            label: 'uDisplacement',
            min: 0,
            max: 50,
            step: 0.1,
          },
          onChange: ({ value }) =>
            (this.materials.portalLight.uniforms.uOffsetDisplacementUv.value =
              value),
        },
        {
          object: this._props,
          key: 'uvStrengthOffset',
          options: {
            label: 'uStrength',
            min: 0,
            max: 50,
            step: 0.1,
          },
          onChange: ({ value }) =>
            (this.materials.portalLight.uniforms.uOffsetStrengthUv.value =
              value),
        },
      ],
    });

    Store.debug.addConfig({
      folder: {
        title: 'Environment',
      },
      bindings: [
        {
          object: this._props,
          key: 'poleLightColor',
          options: {
            label: 'poleLightColor',
            color: { type: 'float' },
          },
          onChange: (ev) => {
            this.materials.poleLight.color.set(ev.value);
          },
        },
      ],
    });
  };

  private update = (elapsed: number) => {
    this.materials.portalLight.uniforms.uTime.value = elapsed;
  };
}
