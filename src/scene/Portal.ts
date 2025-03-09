import gsap from 'gsap';
import {
  Color,
  type Group,
  type Mesh,
  MeshBasicMaterial,
  SRGBColorSpace,
  type Texture,
} from 'three';

import type { ThreeState } from '@helpers/atoms';
import { isThreeMesh } from '@helpers/guards/isThreeMesh';
import { WebGLView } from '@helpers/three';
import { TypedObject } from '@helpers/utils';
import { portalFragmentShader, portalVertexShader } from '@shaders/portal';

import { PortalMaterial } from './PortalMaterial';
import {
  assets,
  portalColorInnerAtom,
  portalColorOuterAtom,
  portalDisplacementAtom,
  portalLightColorAtom,
  portalStrengthAtom,
} from './State';

interface ModelMeshes {
  baked: Mesh;
  poleLightL: Mesh;
  poleLightR: Mesh;
  portalLight: Mesh;
}

interface ModelMaterials {
  baked: MeshBasicMaterial;
  poleLight: MeshBasicMaterial;
  portalLight: PortalMaterial;
}

export class Portal extends WebGLView {
  private model: Group;
  private materials: ModelMaterials;
  private texture: Texture;

  constructor(state: ThreeState) {
    super('Portal', state);

    void this.init(
      this.setupAssets,
      this.setupMaterial,
      this.setupModel,
      this.setupSubscriptions
    );

    void this.dispose(() => {
      this.materials.baked.dispose();
      this.materials.poleLight.dispose();
      this.materials.portalLight.dispose();
    });
  }

  /* SETUP SCENE */

  private setupAssets = async () => {
    this.texture = await assets.textures.get('portalBakedTexture');
    this.texture.flipY = false;
    this.texture.colorSpace = SRGBColorSpace;
    const gltf = await assets.gltfs.get('portalModel');
    this.model = gltf.scene;
  };

  private setupMaterial = () => {
    const bakedMaterial = new MeshBasicMaterial({
      map: this.texture,
    });

    const poleLightMaterial = new MeshBasicMaterial({
      color: new Color(portalLightColorAtom.get()),
    });

    const uColorEnd = new Color(portalColorOuterAtom.get());
    const uColorStart = new Color(portalColorInnerAtom.get());
    const uOffsetDisplacementUv = portalDisplacementAtom.get();
    const uOffsetStrengthUv = portalDisplacementAtom.get();
    const portalLightMaterial = new PortalMaterial({
      vertexShader: portalVertexShader,
      fragmentShader: portalFragmentShader,
      uniforms: {
        uColorEnd,
        uColorStart,
        uOffsetDisplacementUv,
        uOffsetStrengthUv,
        uTime: 0,
      },
    });

    this.materials = {
      baked: bakedMaterial,
      poleLight: poleLightMaterial,
      portalLight: portalLightMaterial,
    };
  };

  private setupModel = () => {
    this.model.name = 'Portal';

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
    portalColorInnerAtom.sub(this.updatePortalStartColor, {
      namespace: this.namespace,
    });
    portalColorOuterAtom.sub(this.updatePortalEndColor, {
      namespace: this.namespace,
    });
    portalDisplacementAtom.sub(this.updatePortalDisplacement, {
      namespace: this.namespace,
    });
    portalLightColorAtom.sub(this.updatePoleLightColor, {
      namespace: this.namespace,
    });
    portalStrengthAtom.sub(this.updatePortalStrength, {
      namespace: this.namespace,
    });

    gsap.ticker.add((time) => {
      this.updateTime(time);
    });
  };

  /* CALLBACKS */

  private updatePortalStartColor = (value: string) => {
    this.materials.portalLight.uColorStart = new Color(value);
  };

  private updatePortalEndColor = (value: string) => {
    this.materials.portalLight.uColorEnd = new Color(value);
  };

  private updatePortalDisplacement = (value: number) => {
    this.materials.portalLight.uOffsetDisplacementUv = value;
  };

  private updatePortalStrength = (value: number) => {
    this.materials.portalLight.uOffsetStrengthUv = value;
  };

  private updatePoleLightColor = (value: string) => {
    this.materials.poleLight.color.set(new Color(value));
  };

  private updateTime = (elapsed: number) => {
    this.materials.portalLight.uTime = elapsed;
  };
}
