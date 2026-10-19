// Registar Service Worker com caminho relativo (compatível com GitHub Pages)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registado! Escopo:', reg.scope))
      .catch(err => console.error('Erro ao registar Service Worker:', err));
  });
}