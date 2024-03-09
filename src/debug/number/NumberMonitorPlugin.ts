import {
  BindingReader,
  NumberMonitorPlugin as DefaultNumberMonitorPlugin,
} from '@tweakpane/core';

import { customAccept } from '../helpers/customAccept';
import {
  MonitorBindingArgs,
  MonitorBindingArgsWithStateParams,
} from '../helpers/customTypes';

/**
 * Plugin type alias.
 */
type TNumberMonitorPlugin = typeof DefaultNumberMonitorPlugin;

/**
 * Default binding arguments.
 */
type NumberMonitorBindingArgs = MonitorBindingArgs<TNumberMonitorPlugin>;

/**
 * Extended binding params with custom reader and writer bindings.
 */
type NumberMonitorBindingArgsExtended =
  MonitorBindingArgsWithStateParams<TNumberMonitorPlugin>;

/**
 * Custom number input/monitor reader function.
 * @param _args binding arguments
 */
function getNumberReader(
  _args: NumberMonitorBindingArgs
): BindingReader<number> {
  const {
    params: { _reader },
    target,
  } = _args as NumberMonitorBindingArgsExtended;
  return (_) => {
    return _reader(target.key);
  };
}

const {
  accept, // passes params to the binding
  api,
  binding, // defines reader and writer functions
  controller,
  core,
  id,
  type,
} = DefaultNumberMonitorPlugin;

export const NumberMonitorPlugin: TNumberMonitorPlugin = {
  id: id + 'state',
  type,
  accept: customAccept(accept),
  binding: {
    defaultBufferSize: binding.defaultBufferSize,
    reader: getNumberReader,
  },
  controller,
  core,
  api,
};
