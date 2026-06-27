import './styles/index.css';
import { CardVilleGame } from './game/CardVilleGame';
import { ensureAnonymousSession } from './firebase/auth';
import { analyticsPromise } from './firebase/firebaseApp';

const containerId = 'app';

void ensureAnonymousSession().catch((error) => {
  console.warn('[CardVille] Anonymous auth failed:', error);
});

void analyticsPromise.catch((error) => {
  console.warn('[CardVille] Analytics disabled:', error);
});

new CardVilleGame(containerId);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch((error) => console.warn('[CardVille] Service worker registration failed:', error));
  });
}
