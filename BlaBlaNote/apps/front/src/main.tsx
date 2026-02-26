import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/App';
import i18n from './i18n';
import {
  applyDocumentDirection,
  getInitialLanguage,
  persistLanguage,
  resolveSupportedLanguage,
} from './i18n/detectLanguage';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const initialLanguage = getInitialLanguage();

function renderApp() {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

void i18n.changeLanguage(initialLanguage).finally(() => {
  applyDocumentDirection(initialLanguage);

  i18n.on('languageChanged', (language) => {
    persistLanguage(language);
    const supportedLanguage = resolveSupportedLanguage(language) ?? 'fr';
    applyDocumentDirection(supportedLanguage);
  });

  renderApp();
});
