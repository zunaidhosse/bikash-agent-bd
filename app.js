let deferredPrompt;
const installButton = document.getElementById('install-button');

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Handle the `beforeinstallprompt` event to show the install button
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default browser install prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show the custom install button
  if (installButton) {
    installButton.style.display = 'inline-block';
  }
});

// Handle the install button click
if (installButton) {
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // The prompt can only be used once, so clear it
      deferredPrompt = null;
      // Hide the install button
      installButton.style.display = 'none';
    }
  });
}

// Optional: Listen for the appinstalled event
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  // Hide the install button if it's somehow still visible
  if (installButton) {
    installButton.style.display = 'none';
  }
});