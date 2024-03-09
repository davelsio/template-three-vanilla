import { defaultReader } from '@debug/helpers/defaultBindingTarget';
import {
  BindingReader,
  NumberMonitorPlugin as DefaultNumberMonitorPlugin,
} from '@tweakpane/core';

import { customAccept } from '../helpers/customAccept';
import { MonitorBindingArgsWithStateParams } from '../helpers/customTypes';

/**
 * Plugin type alias.
 */
type TNumberMonitorPlugin = typeof DefaultNumberMonitorPlugin;

/**
 * Extended binding params with custom reader and writer bindings.
 */
type NumberMonitorBindingArgsExtended =
  MonitorBindingArgsWithStateParams<TNumberMonitorPlugin>;

/**
 * Custom number input/monitor reader function.
 * @param _args binding arguments
 */
function getNumberReader({
  params,
  target,
}: NumberMonitorBindingArgsExtended): BindingReader<number> {
  const _reader = params.reader ?? defaultReader;
  return (value) => {
    return _reader(target, value as number) as number;
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
