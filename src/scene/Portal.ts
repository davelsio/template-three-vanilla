import {
  Color,
  type Group,
  type Mesh,
  MeshBasicMaterial,
  SRGBColorSpace,
  type Texture,
} from 'three';

import type { TimeAtomValue } from '@atoms/atomWithTime';
import { isThreeMesh } from '@helpers/guards/isThreeMesh';
import { type State, WebGLView } from '@helpers/three';
import { portalFragmentShader, portalVertexShader } from '@shaders/portal';
import { TypedObject } from '@utils/typedObject';

import { PortalMaterial } from './PortalMaterial';
import {
  gltfsFamily,
  portalColorInnerAtom,
  portalColorOuterAtom,
  portalDisplacementAtom,
  portalLightColorAtom,
  portalStrengthAtom,
  texturesFamily,
} from './PortalState';

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

  constructor(state: State) {
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
    this.texture = await this._state.store.get(
      texturesFamily('portalBakedTexture')
    );
    this.texture.flipY = false;
    this.texture.colorSpace = SRGBColorSpace;
    // const gltf = await ResourceLoader.loadGltfModel('portalModel');
    const gltf = await this._state.store.get(gltfsFamily('portalModel'));
    this.model = gltf.scene;
  };

  private setupMaterial = () => {
    const bakedMaterial = new MeshBasicMaterial({
      map: this.texture,
    });

    const poleLightMaterial = new MeshBasicMaterial({
      color: new Color(this._state.store.get(portalLightColorAtom)),
    });

    const uColorEnd = new Color(this._state.store.get(portalColorOuterAtom));
    const uColorStart = new Color(this._state.store.get(portalColorInnerAtom));
    const uOffsetDisplacementUv = this._state.store.get(portalDisplacementAtom);
    const uOffsetStrengthUv = this._state.store.get(portalDisplacementAtom);
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
    this.subToAtom(portalColorInnerAtom, this.updatePortalStartColor);
    this.subToAtom(portalColorOuterAtom, this.updatePortalEndColor);
    this.subToAtom(portalDisplacementAtom, this.updatePortalDisplacement);
    this.subToAtom(portalStrengthAtom, this.updatePortalStrength);
    this.subToAtom(portalLightColorAtom, this.updatePoleLightColor);
    this.subToAtom(this._timeAtom, this.updateTime);
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

  private updateTime = ({ elapsed }: TimeAtomValue) => {
    this.materials.portalLight.uTime = elapsed;
  };
}
