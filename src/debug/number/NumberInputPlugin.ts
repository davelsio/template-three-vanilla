import {
  defaultPrimitiveWriter,
  defaultReader,
} from '@debug/helpers/defaultBindingTarget';
import {
  BindingReader,
  BindingWriter,
  NumberInputPlugin as DefaultNumberInputPlugin,
} from '@tweakpane/core';

import { customAccept } from '../helpers/customAccept';
import { InputBindingArgsWithStateParams } from '../helpers/customTypes';

/**
 * Plugin type alias.
 */
type TNumberInputPlugin = typeof DefaultNumberInputPlugin;

/**
 * Extended binding params with custom reader and writer bindings.
 */
type NumberInputBindingArgsExtended =
  InputBindingArgsWithStateParams<TNumberInputPlugin>;

/**
 * Custom number input/monitor reader function.
 * @param _args binding arguments
 */
function getNumberReader({
  params,
  target,
}: NumberInputBindingArgsExtended): BindingReader<number> {
  const _reader = params.reader ?? defaultReader;
  return (value) => {
    return _reader(target, value as number) as number;
  };
}

/**
 * Custom number input/monitor writer function.
 * @param _args binding arguments
 */
function getNumberWriter({
  params,
}: NumberInputBindingArgsExtended): BindingWriter<number> {
  const _writer = params.writer ?? defaultPrimitiveWriter;
  return (target, value) => {
    _writer?.(target, value);
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
