import { Injectable, signal } from '@angular/core';

interface SnackbarMessage {
  message: string;
  actionLabel: string;
  duration: number;
  onAction: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private currentMessage = signal<SnackbarMessage | null>(null);
  readonly message$ = this.currentMessage.asReadonly();

  private timerRef: any;

  constructor() { }

  showUndo(message: string, onUndo: () => void, duration: number = 5000): void {
    const actionLabel = 'Undo';

    if (this.timerRef) {
      clearTimeout(this.timerRef);
    }

    this.currentMessage.set({
      message,
      actionLabel,
      duration,
      onAction: onUndo
    });

    this.timerRef = setTimeout(() => {
      if (this.currentMessage()) {
        this.clearMessage();
      }
    }, duration);
  }

  clearMessage(): void {
    if (this.timerRef) {
      clearTimeout(this.timerRef);
      this.timerRef = null;
    }
    this.currentMessage.set(null);
  }

  performAction(): void {
    const message = this.currentMessage();
    if (message && message.onAction) {
      message.onAction();
    }
    this.clearMessage();
  }
}