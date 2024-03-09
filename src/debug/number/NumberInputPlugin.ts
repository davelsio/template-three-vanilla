import {
  BindingReader,
  BindingWriter,
  NumberInputPlugin as DefaultNumberInputPlugin,
} from '@tweakpane/core';

import { customAccept } from '../helpers/customAccept';
import {
  InputBindingArgs,
  InputBindingArgsWithStateParams,
} from '../helpers/customTypes';

/**
 * Plugin type alias.
 */
type TNumberInputPlugin = typeof DefaultNumberInputPlugin;

/**
 * Default binding arguments.
 */
type NumberInputBindingArgs = InputBindingArgs<TNumberInputPlugin>;

/**
 * Extended binding params with custom reader and writer bindings.
 */
type NumberInputBindingArgsExtended =
  InputBindingArgsWithStateParams<TNumberInputPlugin>;

/**
 * Custom number input/monitor reader function.
 * @param _args binding arguments
 */
function getNumberReader(_args: NumberInputBindingArgs): BindingReader<number> {
  const {
    params: { _reader },
    target,
  } = _args as NumberInputBindingArgsExtended;
  return (_) => {
    return _reader?.(target.key);
  };
}

/**
 * Custom number input/monitor writer function.
 * @param _args binding arguments
 */
function getNumberWriter(_args: NumberInputBindingArgs): BindingWriter<number> {
  const {
    params: { _writer },
  } = _args as NumberInputBindingArgsExtended;
  return (target, value) => {
    return _writer({ [target.key]: value });
  };
}

/**
 * Override the binding and accept functions.
 */
const {
  accept, // passes params to the binding
  api,
  binding, // defines reader and writer functions
  controller,
  core,
  id,
  type,
} = DefaultNumberInputPlugin;

export const NumberInputPlugin: TNumberInputPlugin = {
  id: id + 'state',
  type,
  accept: customAccept(accept),
  binding: {
    constraint: binding.constraint,
    equals: binding.equals,
    reader: getNumberReader,
    writer: getNumberWriter,
  },
  controller,
  core,
  api,
};
