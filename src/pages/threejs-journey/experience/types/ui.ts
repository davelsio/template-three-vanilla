export interface WebGLView {
  namespace: string;
  init(): void | Promise<void>;
  destroy(): void;
}
