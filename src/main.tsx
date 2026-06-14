import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

if ('serviceWorker' in navigator) {
  // Слушаем ДО того как React смонтируется — иначе событие уходит в никуда
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });

  // Форсируем проверку обновления при возврате на вкладку
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.getRegistration().then(reg => reg?.update());
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
