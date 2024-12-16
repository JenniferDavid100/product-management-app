import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AlertComponent } from './components/alert/alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProductListComponent, ProductFormComponent, AlertComponent],
  template: `
    <app-alert></app-alert>
    <app-product-form [productId]="selectedProductId"></app-product-form>
    <app-product-list (editProduct)="onEditProduct($event)"></app-product-list>
  `
})
export class AppComponent {
  selectedProductId?: number;

  onEditProduct(id: number) {
    this.selectedProductId = id;
    window.scrollTo(0, 0);
  }
}
