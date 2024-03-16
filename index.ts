import { Experience } from './src/Experience';

import './src/styles/reset.css';
import './src/styles/webgl.css';
import './src/styles/tweakpane.css';

const root = document.querySelector<HTMLDivElement>('#root');

if (!root) {
  throw new Error('Root element not found');
}

const { api } = new Experience(root);

api.world.onLoad(() => {
  console.log('Experience loaded');
});
