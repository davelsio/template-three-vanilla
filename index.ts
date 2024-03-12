import { Experience } from './src/Experience';

import './src/styles/reset.css';
import './src/styles/webgl.css';
import './src/styles/tweak-pane.css';

const root = document.querySelector<HTMLDivElement>('#root');

if (!root) {
  throw new Error('Root element not found');
}

const { api } = new Experience(root);

api.onLoad(() => console.log('Experience loaded'));
