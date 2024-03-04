import './src/styles/reset.css';
import './src/styles/webgl.css';
import './src/styles/tweak-pane.css';

import { Experience } from './src/Experience';

const root = document.querySelector<HTMLDivElement>('#root');

if (!root) {
  throw new Error('Root element not found');
}

const experience = new Experience(root);
experience.onLoad(() => console.log('Experience loaded'));
