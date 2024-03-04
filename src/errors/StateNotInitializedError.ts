export class StateNotInitializedError extends Error {
  constructor(stateName: string) {
    super(`Trying to access ${stateName} state before initialization`);
  }
}
