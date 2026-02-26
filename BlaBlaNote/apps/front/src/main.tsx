import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/App';
import i18n from './i18n';
import { applyDocumentDirection, getInitialLanguage } from './i18n/detectLanguage';
import './styles.css';

const initialLanguage = getInitialLanguage();
void i18n.changeLanguage(initialLanguage);
applyDocumentDirection(initialLanguage);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
