import './style.css';
import { i18nReady } from './i18n.js';
import initView from './view.js';

i18nReady.then(() => {
  initView();
});
