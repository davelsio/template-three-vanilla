import { Experience } from './experience';

declare global {
  interface Window {
    experience?: Experience;
  }
}
export {};
