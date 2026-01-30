// ========================================
// SISTEMA DE NOTIFICAÇÃO PWA
// ========================================

class PWANotification {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.notificationElement = null;
        this.init();
    }

    init() {
        this.checkIfInstalled();
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showNotification();
        });

        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideNotification();
            localStorage.setItem('pwa-installed', 'true');
        });
    }

    checkIfInstalled() {
        const isInstalled = localStorage.getItem('pwa-installed') === 'true';
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        this.isInstalled = isInstalled || isStandalone;
    }

    showNotification() {
        if (this.isInstalled || this.wasRejectedToday()) return;

        this.createNotificationElement();
        
        setTimeout(() => {
            if (this.notificationElement) {
                this.notificationElement.classList.add('show');
            }
        }, 2000);

        setTimeout(() => {
            this.hideNotification();
        }, 8000);
    }

    createNotificationElement() {
        const notification = document.createElement('div');
        notification.className = 'pwa-notification';
        notification.innerHTML = `
            <div class="pwa-notification-header">
                <svg class="pwa-notification-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <h4 class="pwa-notification-title">Instalar Calculadora</h4>
            </div>
            <p class="pwa-notification-message">
                Instale nossa calculadora para usar offline e ter acesso rápido!
            </p>
            <div class="pwa-notification-actions">
                <button class="pwa-btn pwa-btn-close" onclick="pwaNotification.dismiss()">
                    Agora não
                </button>
                <button class="pwa-btn pwa-btn-install" onclick="pwaNotification.install()">
                    Instalar
                </button>
            </div>
        `;

        document.body.appendChild(notification);
        this.notificationElement = notification;
    }

    async install() {
        if (!this.deferredPrompt) return;

        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                this.isInstalled = true;
                localStorage.setItem('pwa-installed', 'true');
            } else {
                this.setRejectedToday();
            }
            
            this.deferredPrompt = null;
            this.hideNotification();
            
        } catch (error) {
            console.error('Erro ao instalar PWA:', error);
            this.hideNotification();
        }
    }

    dismiss() {
        this.setRejectedToday();
        this.hideNotification();
    }

    hideNotification() {
        if (this.notificationElement) {
            this.notificationElement.classList.add('hide');
            
            setTimeout(() => {
                if (this.notificationElement) {
                    document.body.removeChild(this.notificationElement);
                    this.notificationElement = null;
                }
            }, 400);
        }
    }

    wasRejectedToday() {
        const rejectedDate = localStorage.getItem('pwa-rejected-date');
        const today = new Date().toDateString();
        return rejectedDate === today;
    }

    setRejectedToday() {
        const today = new Date().toDateString();
        localStorage.setItem('pwa-rejected-date', today);
    }
}

const pwaNotification = new PWANotification();