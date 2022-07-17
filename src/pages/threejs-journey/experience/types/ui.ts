export interface DOMView {
  destroy(): void;
}

export interface WebGLView {
  namespace: string;
  init(): void | Promise<void>;
  destroy(): void;
}
