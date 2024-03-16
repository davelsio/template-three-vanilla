import { StoreInstance } from '@helpers/classes/StoreInstance';
import { TimeSettings, timeSettings } from '@settings/time';

export interface TimeState extends TimeSettings {
  /**
   * Time elapsed in milliseconds since the previous frame.
   */
  delta: number;
  /**
   * Time elapsed in milliseconds since the clock started.
   */
  elapsed: number;
}

export class TimeStore extends StoreInstance<TimeState> {
  constructor() {
    super({
      delta: 16,
      elapsed: 0,
      ...timeSettings,
    });
  }
}
