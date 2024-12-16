// src/app/services/product.service.ts
import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = signal<Product[]>([
    {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      category: 'Electronics',
      inStock: true
    }
  ]);

  readonly categories = [
    'Electronics',
    'Clothing',
    'Books'
  ];

  private selectedProductSubject = signal<number | undefined>(undefined);

  constructor(private alertService: AlertService) {}

  getProducts() {
    return this.products;
  }

  addProduct(product: Omit<Product, 'id'>) {
    try {
      const newProduct = {
        ...product,
        id: this.generateId()
      };
      
      this.products.update(products => [...products, newProduct]);
      this.alertService.success('Product added successfully');
    } catch (error) {
      this.alertService.error('Failed to add product');
      console.error('Error adding product:', error);
    }
  }

  updateProduct(updatedProduct: Product) {
    try {
      this.products.update(products => 
        products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      this.alertService.success('Product updated successfully');
    } catch (error) {
      this.alertService.error('Failed to update product');
      console.error('Error updating product:', error);
    }
  }

  deleteProduct(id: number) {
    try {
      this.products.update(products => 
        products.filter(product => product.id !== id)
      );
      this.alertService.success('Product deleted successfully');
    } catch (error) {
      this.alertService.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  }

  toggleStock(id: number) {
    this.products.update(products => 
      products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p)
    );
  }

  private generateId(): number {
    const products = this.products();
    return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  }

  getProductById(id: number) {
    return this.products().find(p => p.id === id);
  }

  getCategories() {
    return this.categories;
  }

  clearSelectedProduct() {
    this.selectedProductSubject.set(undefined);
  }
}