import {
  Color,
  CubeTexture,
  IUniform,
  Matrix3,
  Matrix4,
  Quaternion,
  ShaderMaterial as ThreeShaderMaterial,
  ShaderMaterialParameters,
  Texture,
  Uniform,
  UniformsUtils,
  Vector2,
  Vector3,
  Vector4,
} from 'three';

import { InferConstructableType } from '../types/InferConstructableType';

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
 * Raw uniforms for the `ShaderMaterial` constructor.
 */
type InputUniforms = {
  [uniform: string]: UniformValue;
};

/**
 * Uniforms object in the ShaderMaterial class.
 */
type MaterialUniforms<T extends InputUniforms> = {
  [uniform in keyof T]: IUniform<T[uniform]>;
};

/**
 * Shader material params without the factory function arguments.
 */
type ShaderMaterialParams<T> = Omit<ShaderMaterialParameters, 'uniforms'> & {
  uniforms?: T;
};

/**
 * Type of the custom ShaderMaterial class.
 */
export type ShaderMaterial<T extends InputUniforms> = InferConstructableType<
  typeof ShaderMaterial<T>
>;

/**
 * Custom ShaderMaterial class with type inference and root level uniform access.
 */
export const ShaderMaterial = class ShaderMaterial<
  T extends InputUniforms,
> extends ThreeShaderMaterial {
  uniforms: MaterialUniforms<T>;

  constructor({ uniforms, ...args }: ShaderMaterialParams<T> | undefined = {}) {
    const entries = Object.entries(uniforms ?? {});
    const _uniforms = entries.reduce<MaterialUniforms<T>>(
      (acc, [name, value]) => {
        const uniform = UniformsUtils.clone({ [name]: new Uniform(value) });
        return { ...acc, ...uniform };
      },
      {} as MaterialUniforms<T>
    );

    super({ ...args, uniforms: _uniforms });
    this.uniforms = _uniforms;

    // Create uniform accessors
    entries.forEach(([name]) =>
      Object.defineProperty(this, name, {
        get: () => this.uniforms[name].value,
        set: (value) => (this.uniforms[name].value = value),
      })
    );
  }
} as unknown as new <T extends InputUniforms>(
  args?: ShaderMaterialParams<T>
) => T & ThreeShaderMaterial;
