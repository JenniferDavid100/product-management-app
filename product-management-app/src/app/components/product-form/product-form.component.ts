import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h3>{{ editMode ? 'Edit' : 'Add New' }} Product</h3>
      <form (ngSubmit)="onSubmit()" #productForm="ngForm">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="name" 
                 [(ngModel)]="product.name" name="name" required
                 #name="ngModel"
                 [class.is-invalid]="name.invalid && name.touched">
          <div class="invalid-feedback">Name is required</div>
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input type="number" class="form-control" id="price" 
                 [(ngModel)]="product.price" name="price" required min="0"
                 #price="ngModel"
                 [class.is-invalid]="price.invalid && price.touched">
          <div class="invalid-feedback">Valid price is required</div>
        </div>
        <div class="mb-3">
          <label for="category" class="form-label">Category</label>
          <select class="form-control" id="category" 
                  [(ngModel)]="product.category" name="category" required
                  #category="ngModel"
                  [class.is-invalid]="category.invalid && category.touched">
            <option value="">Select Category</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
          <div class="invalid-feedback">Category is required</div>
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" class="form-check-input" id="inStock"
                 [(ngModel)]="product.inStock" name="inStock">
          <label class="form-check-label" for="inStock">In Stock</label>
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="productForm.invalid">
          {{ editMode ? 'Update' : 'Add' }} Product
        </button>
        <button type="button" class="btn btn-secondary ms-2" (click)="resetForm()">Cancel</button>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  @Input() productId?: number;
  editMode = false;
  categories: string[];
  
  product: Partial<Product> = {
    name: '',
    price: 0,
    category: '',
    inStock: false
  };

  constructor(private productService: ProductService, private alertService: AlertService) {
    this.categories = this.productService.getCategories();
  }

  ngOnInit() {
    this.loadProduct();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId']) {
      this.loadProduct();
    }
  }

  private loadProduct() {
    if (this.productId) {
      const existingProduct = this.productService.getProductById(this.productId);
      if (existingProduct) {
        this.product = { ...existingProduct };
        this.editMode = true;
      }
    }
  }

  onSubmit() {
    if (this.product.name?.trim() === '') {
      this.alertService.error('Product name cannot be empty');
      return;
    }

    if (this.product.price && this.product.price <= 0) {
      this.alertService.error('Price must be greater than 0');
      return;
    }

    if (!this.product.category) {
      this.alertService.error('Please select a category');
      return;
    }

    if (this.editMode && this.productId) {
      this.productService.updateProduct({ ...this.product, id: this.productId } as Product);
    } else {
      this.productService.addProduct(this.product as Omit<Product, 'id'>);
    }
    this.resetForm();
  }

  resetForm() {
    this.product = {
      name: '',
      price: 0,
      category: '',
      inStock: false
    };
    this.editMode = false;
    this.productId = undefined;
    this.productService.clearSelectedProduct();
  }
} 