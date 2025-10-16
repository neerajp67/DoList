import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
  private snackbarService = inject(SnackbarService);
  
  message = this.snackbarService.message$;
  
  handleAction(): void {
    this.snackbarService.performAction();
  }

  dismiss(): void {
    this.snackbarService.clearMessage();
  }
}