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
import { CustomShaderMaterial, WebGLView } from '@helpers/three';
import { TypedObject } from '@helpers/utils';
import { portalFragmentShader, portalVertexShader } from '@shaders/portal';

import {
  assets,
  portalColorInnerAtom,
  portalColorOuterAtom,
  portalDisplacementAtom,
  portalLightColorAtom,
  portalStrengthAtom,
} from './State';

type PortalUniforms = {
  uColorEnd: Color;
  uColorStart: Color;
  uOffsetDisplacementUv: number;
  uOffsetStrengthUv: number;
  uTime: number;
};

interface ModelMeshes {
  baked: Mesh;
  poleLightL: Mesh;
  poleLightR: Mesh;
  portalLight: Mesh;
}

interface ModelMaterials {
  baked: MeshBasicMaterial;
  poleLight: MeshBasicMaterial;
  portalLight: CustomShaderMaterial<PortalUniforms>;
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
    const portalLightMaterial = new CustomShaderMaterial<PortalUniforms>({
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
    gsap.ticker.add((time) => {
      this.materials.portalLight.uniforms.uTime.value = time;
    });

    portalColorInnerAtom.sub(
      (value: string) => {
        this.materials.portalLight.uniforms.uColorStart.value = new Color(
          value
        );
      },
      {
        namespace: this.namespace,
      }
    );
    portalColorOuterAtom.sub(
      (value: string) => {
        this.materials.portalLight.uniforms.uColorEnd.value = new Color(value);
      },
      {
        namespace: this.namespace,
      }
    );
    portalDisplacementAtom.sub(
      (value: number) => {
        this.materials.portalLight.uniforms.uOffsetDisplacementUv.value = value;
      },
      {
        namespace: this.namespace,
      }
    );
    portalLightColorAtom.sub(
      (value: string) => {
        this.materials.poleLight.color.set(new Color(value));
      },
      {
        namespace: this.namespace,
      }
    );
    portalStrengthAtom.sub(
      (value: number) => {
        this.materials.portalLight.uniforms.uOffsetStrengthUv.value = value;
      },
      {
        namespace: this.namespace,
      }
    );
  };
}
