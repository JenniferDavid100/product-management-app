import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-3">
      @if (alert()?.message) {
        <div class="alert" [class.alert-success]="alert()?.type === 'success'"
                          [class.alert-danger]="alert()?.type === 'error'">
          {{ alert()?.message }}
        </div>
      }
    </div>
  `
})
export class AlertComponent {
  alert: any;

  constructor(private alertService: AlertService) {
    this.alert = this.alertService.getAlert();
  }
}