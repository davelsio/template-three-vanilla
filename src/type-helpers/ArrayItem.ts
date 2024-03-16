export type ArrayItem<T extends unknown[]> = T extends (infer U)[] ? U : never;
