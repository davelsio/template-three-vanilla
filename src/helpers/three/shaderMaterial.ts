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

import { InferConstructableType } from '@helpers/types/InferConstructableType';

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

/**
 * Helper function to infer the custom shader material class type.
 */
export type ShaderMaterialType<T> = InferConstructableType<T>;

export function shaderMaterial<T extends UniformsInput>() {
  class CustomShaderMaterial extends ThreeShaderMaterial {
    constructor({
      uniforms,
      ...args
    }: ShaderMaterialParams<T> | undefined = {}) {
      const entries = Object.entries(uniforms ?? {});

      // Create the uniforms object
      const _uniforms = entries.reduce<UniformsObject>((acc, [name, value]) => {
        const uniform = UniformsUtils.clone({ [name]: new Uniform(value) });
        return { ...acc, ...uniform };
      }, {});

      // Initialize the shader material
      super({ ...args, uniforms: _uniforms });

      // Create uniform accessors
      entries.forEach(([name]) =>
        Object.defineProperty(this, name, {
          get: () => this.uniforms[name].value,
          set: (value) => (this.uniforms[name].value = value),
        })
      );
    }
  }
  const material = CustomShaderMaterial;
  return material as unknown as new (
    args?: ShaderMaterialParams<T>
  ) => T & CustomShaderMaterial;
}
