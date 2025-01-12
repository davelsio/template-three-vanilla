export function addEvent(
  eventName: keyof WindowEventMap,
  callback: () => void,
  options?: AddEventListenerOptions | boolean
) {
  window.addEventListener(eventName, callback, options);
  return () => window.removeEventListener(eventName, callback);
}
