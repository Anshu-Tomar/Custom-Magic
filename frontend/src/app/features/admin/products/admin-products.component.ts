import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/services';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  showForm = false;
  editProduct: Product | null = null;
  form: FormGroup;
  saving = false;
  selectedFiles: File[] = [];
  page = 1;
  pages = 1;
  total = 0;

  categories = ['Fruits & Veggies', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Personal Care', 'Household', 'Meat & Fish', 'Bakery'];

  constructor(private productService: ProductService, private toast: ToastService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      originalPrice: [''],
      discountPercent: [0],
      category: ['', Validators.required],
      brand: [''],
      stock: [0, Validators.required],
      unit: ['piece'],
      deliveryTime: ['10 mins'],
      isFeatured: [false],
      isFlashDeal: [false],
      tags: ['']
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.productService.getProducts({ page: this.page, limit: 15 }).subscribe({
      next: (res: any) => {
        this.products = res.data?.products || [];
        this.total = res.data?.total || 0;
        this.pages = res.data?.pages || 1;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openForm(product?: Product): void {
    this.editProduct = product || null;
    this.showForm = true;
    if (product) {
      this.form.patchValue({ ...product, tags: product.tags?.join(',') || '' });
    } else {
      this.form.reset({ isFeatured: false, isFlashDeal: false, stock: 0, deliveryTime: '10 mins' });
    }
    this.selectedFiles = [];
  }

  closeForm(): void { this.showForm = false; this.editProduct = null; }

  onFileSelect(e: any): void {
    this.selectedFiles = Array.from(e.target.files || []);
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const fd = new FormData();
    const val = this.form.value;
    Object.keys(val).forEach(k => {
      if (k === 'tags') fd.append(k, JSON.stringify(val[k].split(',').map((t: string) => t.trim()).filter(Boolean)));
      else fd.append(k, val[k]);
    });
    this.selectedFiles.forEach(f => fd.append('images', f));

    const obs = this.editProduct
      ? this.productService.updateProduct(this.editProduct._id, fd)
      : this.productService.createProduct(fd);

    obs.subscribe({
      next: () => {
        this.toast.success(this.editProduct ? 'Product updated!' : 'Product created!');
        this.closeForm();
        this.load();
        this.saving = false;
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Failed to save');
        this.saving = false;
      }
    });
  }

  delete(id: string, name: string): void {
    if (!confirm(`Delete "${name}"?`)) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => { this.toast.success('Product deleted'); this.load(); },
      error: () => this.toast.error('Delete failed')
    });
  }

  changePage(p: number): void { this.page = p; this.load(); }
  get skeletons() { return Array(6).fill(0); }
}
