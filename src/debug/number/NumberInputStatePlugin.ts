import {
  CompositeConstraint,
  Constraint,
  createListConstraint,
  createNumberTextInputParamsParser,
  createNumberTextPropsObject,
  createPlugin,
  createRangeConstraint,
  createSliderTextProps,
  createStepConstraint,
  createValue,
  DefiniteRangeConstraint,
  findConstraint,
  InputBindingController,
  InputBindingPlugin,
  ListConstraint,
  ListController,
  ListInputBindingApi,
  ListParamsOptions,
  numberFromUnknown,
  NumberInputParams,
  NumberTextController,
  parseListOptions,
  parseNumber,
  parseRecord,
  SliderInputBindingApi,
  SliderTextController,
  ValueMap,
  writePrimitive,
} from '@tweakpane/core';

import { getCustomAccept } from '../getCustomAccept';
import { getNumberReader, getNumberWriter } from '../getCustomBindings';

function createConstraint(
  params: NumberInputParams,
  initialValue: number
): Constraint<number> {
  const constraints: Constraint<number>[] = [];

  const sc = createStepConstraint(params, initialValue);
  if (sc) {
    constraints.push(sc);
  }
  const rc = createRangeConstraint(params);
  if (rc) {
    constraints.push(rc);
  }
  const lc = createListConstraint<number>(params.options);
  if (lc) {
    constraints.push(lc);
  }

  return new CompositeConstraint(constraints);
}

export const NumberInputStatePlugin: InputBindingPlugin<
  number,
  number,
  NumberInputParams
> = createPlugin({
  id: 'input-number',
  type: 'input',
  accept: (value, params) => {
    if (typeof value !== 'number') {
      return null;
    }
    const result = parseRecord<NumberInputParams>(params, (p) => ({
      ...createNumberTextInputParamsParser(p),
      options: p.optional.custom<ListParamsOptions<number>>(parseListOptions),
      readonly: p.optional.constant(false),
    }));
    return result
      ? {
          initialValue: value,
          params: {
            ...result,
            ...getCustomAccept(params),
          },
        }
      : null;
  },
  binding: {
    reader: (_args) => getNumberReader(_args) ?? numberFromUnknown,
    constraint: (args) => createConstraint(args.params, args.initialValue),
    writer: (_args) => getNumberWriter(_args) ?? writePrimitive,
  },
  controller: (args) => {
    const value = args.value;
    const c = args.constraint;

    const lc = c && findConstraint<ListConstraint<number>>(c, ListConstraint);
    if (lc) {
      return new ListController(args.document, {
        props: new ValueMap({
          options: lc.values.value('options'),
        }),
        value: value,
        viewProps: args.viewProps,
      });
    }

    const textPropsObj = createNumberTextPropsObject(
      args.params,
      value.rawValue
    );

    const drc = c && findConstraint(c, DefiniteRangeConstraint);
    if (drc) {
      return new SliderTextController(args.document, {
        ...createSliderTextProps({
          ...textPropsObj,
          keyScale: createValue(textPropsObj.keyScale),
          max: drc.values.value('max'),
          min: drc.values.value('min'),
        }),
        parser: parseNumber,
        value: value,
        viewProps: args.viewProps,
      });
    }

    return new NumberTextController(args.document, {
      parser: parseNumber,
      props: ValueMap.fromObject(textPropsObj),
      value: value,
      viewProps: args.viewProps,
    });
  },
  api(args) {
    if (typeof args.controller.value.rawValue !== 'number') {
      return null;
    }

    if (args.controller.valueController instanceof SliderTextController) {
      return new SliderInputBindingApi(
        args.controller as InputBindingController<number, SliderTextController>
      );
    }
    if (args.controller.valueController instanceof ListController) {
      return new ListInputBindingApi(
        args.controller as InputBindingController<
          number,
          ListController<number>
        >
      );
    }

    return null;
  },
});
