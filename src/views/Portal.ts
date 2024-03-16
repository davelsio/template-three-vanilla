import {
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  Uniform,
} from 'three';

import { WebGLView } from '@helpers/classes/WebGLView';
import { isThreeMesh } from '@helpers/guards/isThreeMesh';
import { ResourceLoader } from '@loaders/ResourceLoader';
import { portalFragmentShader, portalVertexShader } from '@shaders/portal';
import { Store } from '@state/Store';
import { TypedObject } from '@utils/typedObject';

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
  private model: Group;
  private materials: ModelMaterials;
  private texture: Texture;

  constructor() {
    super('Portal');
    void this.init(
      this.setupAssets,
      this.setupMaterial,
      this.setupModel,
      this.setupSubscriptions
    );
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

  private setupAssets = async () => {
    this.texture = await ResourceLoader.loadTexture('portalBakedTexture');
    this.texture.flipY = false;
    this.texture.colorSpace = SRGBColorSpace;
    const gltf = await ResourceLoader.loadGltfModel('portalModel');
    this.model = gltf.scene;
  };

  private setupMaterial = () => {
    const bakedMaterial = new MeshBasicMaterial({
      map: this.texture,
    });

    const poleLightMaterial = new MeshBasicMaterial({
      color: Store.world.state.poleLightColor,
    });

    const portalLightMaterial = new ShaderMaterial({
      fragmentShader: portalFragmentShader,
      vertexShader: portalVertexShader,
      uniforms: {
        uColorEnd: new Uniform(Store.world.state.portalColorEnd),
        uColorStart: new Uniform(Store.world.state.portalColorStart),
        uOffsetDisplacementUv: new Uniform(
          Store.world.state.portalDisplacement
        ),
        uOffsetStrengthUv: new Uniform(Store.world.state.portalStrength),
        uTime: new Uniform(0),
      },
    });

    this.materials = {
      baked: bakedMaterial,
      poleLight: poleLightMaterial,
      portalLight: portalLightMaterial,
    };
  };

  private setupModel = () => {
    this.model.name = 'PortalScene';

    try {
      const meshArray = this.model.children.filter(isThreeMesh).map((child) => {
        return [child.name, child] as [keyof ModelMeshes, Mesh];
      });
      const meshes = TypedObject.fromEntries<ModelMeshes>(meshArray);

      meshes.baked.material = this.materials.baked;
      meshes.poleLightL.material = this.materials.poleLight;
      meshes.poleLightR.material = this.materials.poleLight;
      meshes.portalLight.material = this.materials.portalLight;
    } catch (error) {
      console.error(
        'One or more of the model meshes in the Portal',
        'scene could not be assigned a material.',
        error
      );
    }
    this.add(this.model);
  };

  private setupSubscriptions = () => {
    const { world, time } = Store.getSubscribers(this.namespace);
    world((state) => state.portalColorStart, this.updatePortalStartColor);
    world((state) => state.portalColorEnd, this.updatePortalEndColor);
    world((state) => state.portalDisplacement, this.updatePortalDisplacement);
    world((state) => state.portalStrength, this.updatePortalStrength);
    world((state) => state.poleLightColor, this.updatePoleLightColor);
    time((state) => state.elapsed, this.updateTime);
  };

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
