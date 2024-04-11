import {
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  SRGBColorSpace,
  Texture,
} from 'three';

import { TimeAtomValue } from '@atoms/atomWithTime';
import { WebGLView } from '@helpers/classes/WebGLView';
import { isThreeMesh } from '@helpers/guards/isThreeMesh';
import { ResourceLoader } from '@loaders/ResourceLoader';
import {
  portalColorInnerAtom,
  portalColorOuterAtom,
  portalDisplacementAtom,
  portalLightColorAtom,
  portalStrengthAtom,
} from '@state/portal/portal';
import { appStore } from '@state/store';
import { TypedObject } from '@utils/typedObject';

import { PortalMaterial } from './PortalMaterial';

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

  constructor() {
    super('Portal');

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
      color: new Color(appStore.get(portalLightColorAtom)),
    });

    const portalLightMaterial = new PortalMaterial();

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
