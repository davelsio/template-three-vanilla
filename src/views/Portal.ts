import { WebGLView } from '@helpers/WebGLView';
import { ResourceLoader } from '@loaders/ResourceLoader';
import { portalFragmentShader, portalVertexShader } from '@shaders/portal';
import { Store } from '@state/Store';
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

export class Portal extends WebGLView {
  private portalBakedTexture: Texture;
  private portalScene: GLTF;

  private model: Group;
  private meshes: ModelMeshes;
  private materials: ModelMaterials;

  constructor(scene: Scene) {
    super('Portal', scene);
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
    Store.unsubscribe(this.namespace);

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
      color: Store.debug.state.poleLightColor,
    });

    const portalLightMaterial = new ShaderMaterial({
      fragmentShader: portalFragmentShader,
      vertexShader: portalVertexShader,
      uniforms: {
        uColorEnd: new Uniform(Store.debug.state.portalColorEnd),
        uColorStart: new Uniform(Store.debug.state.portalColorStart),
        uOffsetDisplacementUv: new Uniform(
          Store.debug.state.uvDisplacementOffset
        ),
        uOffsetStrengthUv: new Uniform(Store.debug.state.uvStrengthOffset),
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
    const debugSubscriber = Store.debug.getSubscriber(this.namespace);

    debugSubscriber(
      (state) => state.portalColorStart,
      this.updatePortalStartColor
    );

    debugSubscriber((state) => state.portalColorEnd, this.updatePortalEndColor);

    debugSubscriber(
      (state) => state.uvDisplacementOffset,
      this.updatePortalDisplacement
    );

    debugSubscriber(
      (state) => state.uvStrengthOffset,
      this.updatePortalStrength
    );

    debugSubscriber((state) => state.poleLightColor, this.updatePoleLightColor);

    Store.time.subscribe(
      this.namespace,
      (state) => state.elapsed,
      this.updateTime
    );
  }

  /* CALLBACKS */

  private updatePortalStartColor = (color: Color) => {
    this.materials.portalLight.uniforms.uColorStart.value = color;
  };

  private updatePortalEndColor = (color: Color) => {
    this.materials.portalLight.uniforms.uColorEnd.value = color;
  };

  private updatePortalDisplacement = (value: number) => {
    this.materials.portalLight.uniforms.uOffsetDisplacementUv.value = value;
  };

  private updatePortalStrength = (value: number) => {
    this.materials.portalLight.uniforms.uOffsetStrengthUv.value = value;
  };

  private updatePoleLightColor = (color: Color) => {
    this.materials.poleLight.color.set(color);
  };

  private updateTime = (elapsed: number) => {
    this.materials.portalLight.uniforms.uTime.value = elapsed;
  };
}
