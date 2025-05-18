import {
  type Color,
  type CubeTexture,
  type IUniform,
  type Matrix3,
  type Matrix4,
  type Quaternion,
  ShaderMaterial,
  type ShaderMaterialParameters,
  type Texture,
  Uniform,
  UniformsUtils,
  type Vector2,
  type Vector3,
  type Vector4,
} from 'three';

import { TypedObject } from '../utils';

/**
 * Valid uniform value types.
 */
type UniformValue =
  | boolean
  | Color
  | CubeTexture
  | Texture
  | number
  | Vector2
  | Vector3
  | Vector4
  | Matrix3
  | Matrix4
  | Quaternion;

/**
 * Raw uniform arguments for the `shaderMaterial` factory function.
 */
type UniformsInput = {
  [uniform: string]: UniformValue;
};

/**
 * Constructed uniforms object for the ShaderMaterial class.
 */
type UniformsObject = {
  [uniform: string]: IUniform<UniformsInput[keyof UniformsInput]>;
};

/**
 * Shader material params without the factory function arguments.
 */
type ShaderMaterialParams<T> = Omit<ShaderMaterialParameters, 'uniforms'> & {
  uniforms?: T;
};

export class CustomShaderMaterial<
  T extends UniformsInput,
> extends ShaderMaterial {
  declare public uniforms: { [uniform in keyof T]: IUniform<T[uniform]> };

  constructor({
    uniforms: uniformsInput,
    ...args
  }: ShaderMaterialParams<T> | undefined = {}) {
    let uniforms: UniformsObject | undefined = undefined;

    if (uniformsInput) {
      const entries = TypedObject.entries(uniformsInput ?? ({} as T)).map(
        ([name, value]) => [name, new Uniform(value)]
      ) as Array<[keyof T, IUniform<T[keyof T]>]>;

      uniforms = UniformsUtils.clone(Object.fromEntries(entries));
    }

    super({ ...args, uniforms });
  }
}
