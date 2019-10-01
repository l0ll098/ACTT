import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable()
export class StateService {
    constructor(private platform: Platform) { }

    public isBrowser() {
        return this.platform.isBrowser;
    }

    public isServer() {
        return !this.isBrowser;
    }

    public isMobile() {
        return this.platform.ANDROID || this.platform.IOS;
    }

    public isDesktop() {
        return !this.isMobile;
    }

    public addEventListener(event: "online" | "offline", callback: (e: Event) => void) {
        if (window && window.navigator) {
            window.addEventListener(event, (e) => {
                callback(e);
            });
        }
    }

    public isOnline() {
        return (window && window.navigator) ? window.navigator.onLine : false;
    }

    public isOffline() {
        return (window && window.navigator) ? !window.navigator.onLine : false;
    }

    public async registerSyncTag(tag: string) {
        if (navigator) {
            const swReg = await navigator.serviceWorker.ready;
            return swReg.sync.register(tag);
        }
    }
}
