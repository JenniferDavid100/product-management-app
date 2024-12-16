import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface Alert {
  type: 'success' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alert = signal<Alert | null>(null);

  getAlert() {
    return this.alert;
  }

  success(message: string) {
    this.alert.set({ type: 'success', message });
    this.clearAfterDelay();
  }

  error(message: string) {
    this.alert.set({ type: 'error', message });
    this.clearAfterDelay();
  }

  private clearAfterDelay() {
    setTimeout(() => {
      this.alert.set(null);
    }, 3000);
  }
} 