import {
  Constants,
  createNumberFormatter,
  createPlugin,
  Formatter,
  GraphLogController,
  GraphLogMonitorBindingApi,
  isEmpty,
  MicroParser,
  MonitorBindingController,
  MonitorBindingPlugin,
  MultiLogController,
  numberFromUnknown,
  NumberMonitorParams,
  parseRecord,
  SingleLogController,
  ValueMap,
} from '@tweakpane/core';

import { getCustomAcceptReadOnly } from '../getCustomAccept';
import { getNumberReader } from '../getCustomBindings';

function createFormatter(params: NumberMonitorParams): Formatter<number> {
  return !isEmpty(params.format) ? params.format : createNumberFormatter(2);
}

function createTextMonitor(
  args: Parameters<
    MonitorBindingPlugin<number, NumberMonitorParams>['controller']
  >[0]
) {
  if (args.value.rawValue.length === 1) {
    return new SingleLogController(args.document, {
      formatter: createFormatter(args.params),
      value: args.value,
      viewProps: args.viewProps,
    });
  }

  return new MultiLogController(args.document, {
    formatter: createFormatter(args.params),
    rows: args.params.rows ?? Constants.monitor.defaultRows,
    value: args.value,
    viewProps: args.viewProps,
  });
}

function createGraphMonitor(
  args: Parameters<
    MonitorBindingPlugin<number, NumberMonitorParams>['controller']
  >[0]
) {
  return new GraphLogController(args.document, {
    formatter: createFormatter(args.params),
    rows: args.params.rows ?? Constants.monitor.defaultRows,
    props: ValueMap.fromObject({
      max: args.params.max ?? 100,
      min: args.params.min ?? 0,
    }),
    value: args.value,
    viewProps: args.viewProps,
  });
}

function shouldShowGraph(params: NumberMonitorParams): boolean {
  return params.view === 'graph';
}

export const NumberMonitorPlugin: MonitorBindingPlugin<
  number,
  NumberMonitorParams
> = createPlugin({
  id: 'monitor-number',
  type: 'monitor',
  accept: (value, params) => {
    if (typeof value !== 'number') {
      return null;
    }
    const result = parseRecord<NumberMonitorParams>(params, (p) => ({
      format: p.optional.function as MicroParser<Formatter<number>>,
      max: p.optional.number,
      min: p.optional.number,
      readonly: p.required.constant(true),
      rows: p.optional.number,
      view: p.optional.string,
    }));
    return result
      ? {
          initialValue: value,
          params: {
            ...result,
            ...getCustomAcceptReadOnly(params),
          },
        }
      : null;
  },
  binding: {
    defaultBufferSize: (params) => (shouldShowGraph(params) ? 64 : 1),
    reader: (_args) => getNumberReader(_args) ?? numberFromUnknown,
  },
  controller: (args) => {
    if (shouldShowGraph(args.params)) {
      return createGraphMonitor(args);
    }
    return createTextMonitor(args);
  },
  api: (args) => {
    if (args.controller.valueController instanceof GraphLogController) {
      return new GraphLogMonitorBindingApi(
        args.controller as MonitorBindingController<number, GraphLogController>
      );
    }
    return null;
  },
});
