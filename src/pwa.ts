// PWA Utilities for BIM Viewer

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
}

export class PWAManager {
  private static instance: PWAManager;
  private deferredPrompt: any = null;
  private updateAvailable = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  private init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupUpdateDetection();
    this.setupOfflineDetection();
  }

  private registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('PWA: Service Worker registered successfully', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.updateAvailable = true;
                    this.showUpdateNotification();
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('PWA: Service Worker registration failed', error);
          });
      });
    }
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });
  }

  private setupUpdateDetection() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (this.updateAvailable) {
          window.location.reload();
        }
      });
    }
  }

  private setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.hideOfflineIndicator();
    });

    window.addEventListener('offline', () => {
      this.showOfflineIndicator();
    });

    // Check initial status
    if (!navigator.onLine) {
      this.showOfflineIndicator();
    }
  }

  private showInstallPrompt() {
    const prompt = document.getElementById('pwa-install-prompt');
    if (prompt && !localStorage.getItem('pwa-prompt-dismissed')) {
      setTimeout(() => {
        prompt.classList.remove('hidden');
      }, 3000);
    }
  }

  private showUpdateNotification() {
    // Create update notification
    const notification = document.createElement('div');
    notification.id = 'pwa-update-notification';
    notification.className = 'fixed top-4 left-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg border border-blue-500 max-w-sm z-50';
    notification.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold">Update Available</h3>
        <button id="close-update" class="text-blue-200 hover:text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <p class="text-sm text-blue-100 mb-3">A new version of BIM Viewer is available.</p>
      <div class="flex gap-2">
        <button id="update-app" class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm font-medium">
          Update Now
        </button>
        <button id="dismiss-update" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">
          Later
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Add event listeners
    document.getElementById('update-app')?.addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('dismiss-update')?.addEventListener('click', () => {
      notification.remove();
    });

    document.getElementById('close-update')?.addEventListener('click', () => {
      notification.remove();
    });
  }

  private showOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.classList.remove('hidden');
    }
  }

  private hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.classList.add('hidden');
    }
  }

  public async installApp(): Promise<boolean> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      return outcome === 'accepted';
    }
    return false;
  }

  public isInstallable(): boolean {
    return this.deferredPrompt !== null;
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  public getAppInfo(): PWAConfig {
    return {
      name: 'BIM 3.0 Viewer',
      shortName: 'BIM Viewer',
      description: 'A modern Building Information Modeling viewer with 3D visualization capabilities',
      themeColor: '#6528d7',
      backgroundColor: '#1a1d23'
    };
  }
}

// Initialize PWA Manager
export const pwaManager = PWAManager.getInstance();

// Export for use in other modules
export default pwaManager; 