import { FolderArgs, InputArgs } from './debug';

/* ACTIONS */

// Debug
interface AddInput {
  type: 'ADD_INPUT';
  payload: InputArgs;
}

interface AddFolder {
  type: 'ADD_FOLDER';
  payload: FolderArgs;
}

// World
interface UpdateViewProgress {
  type: 'UPDATE_VIEW_PROGRESS';
  payload: { name: string };
}

interface UpdateViewsToLoad {
  type: 'UPDATE_VIEWS_TO_LOAD';
  payload: { names: string[] };
}

/* DISPATCHES */
interface DebugDispatch {
  controller: 'DebugController';
  action: DebugAction;
}

interface WorldDispatch {
  controller: 'WorldController';
  action: WorldAction;
}

export type Subscription = () => void;

export type DebugAction = AddInput | AddFolder;
export type WorldAction = UpdateViewProgress | UpdateViewsToLoad;

export type Dispatch = DebugDispatch | WorldDispatch;
