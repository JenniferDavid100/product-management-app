import { Component, Signal, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.css'
})
export class ProductListComponent {
    products: Signal<Product[]>;
    @Output() editProduct = new EventEmitter<number>();
    searchTerm = signal('');
    selectedCategory = signal<string>('all');
    categories: string[];

    constructor(private productService: ProductService) {
        this.products = this.productService.getProducts();
        this.categories = ['all', ...this.productService.getCategories()];
    }

    get filteredProducts() {
        const term = this.searchTerm().toLowerCase();
        const category = this.selectedCategory();
        
        return this.products().filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(term) ||
                                product.category.toLowerCase().includes(term);
            const matchesCategory = category === 'all' || product.category === category;
            return matchesSearch && matchesCategory;
        });
    }

    toggleStock(id: number) {
        this.productService.toggleStock(id);
    }

    deleteProduct(id: number) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id);
        }
    }

    onEdit(id: number) {
        this.editProduct.emit(id);
    }
}
