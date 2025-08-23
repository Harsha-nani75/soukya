import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Package, ServiceType } from './package.model';
import { PackageService } from 'src/app/services/package.service';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {
// form!: FormGroup;
//   list: Package[] = [];
//   filtered: Package[] = [];
//   mode: 'create' | 'edit' = 'create';
//   editingId: number | null = null;
//   search = '';

//   services: ServiceType[] = ['Couples', 'Individuals'];

  // constructor(private fb: FormBuilder, private store: PackageService) {}

  // ngOnInit(): void {
  //   this.form = this.fb.group({
  //     service: ['', Validators.required],
  //     name: ['', [Validators.required, Validators.maxLength(60)]],
  //     priceMonthly: [null, [Validators.min(0)]],
  //     priceYearly:  [null, [Validators.min(0)]],
  //     description1: [''],
  //     description2: ['']
  //   });
  //   this.refresh();
  // }

  // private refresh(): void {
  //   this.list = this.store.getAll();
  //   this.applyFilter();
  // }

  // applyFilter(): void {
  //   const q = this.search.trim().toLowerCase();
  //   this.filtered = !q
  //     ? [...this.list]
  //     : this.list.filter(p =>
  //         [p.name, p.service, String(p.priceMonthly ?? ''), String(p.priceYearly ?? ''), p.description1 ?? '', p.description2 ?? '']
  //           .some(v => v.toLowerCase().includes(q))
  //       );
  // }

  // submit(): void {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     Swal.fire({ icon: 'warning', title: 'Please complete required fields' });
  //     return;
  //   }

  //   const payload = this.form.value as Omit<Package, 'id' | 'createdAt' | 'updatedAt'>;

  //   if (this.mode === 'create') {
  //     this.store.add(payload);
  //     Swal.fire({ icon: 'success', title: 'Package saved' });
  //   } else if (this.mode === 'edit' && this.editingId != null) {
  //     this.store.update(this.editingId, payload);
  //     Swal.fire({ icon: 'success', title: 'Package updated' });
  //   }

  //   this.resetForm();
  //   this.refresh();
  // }

  // edit(item: Package): void {
  //   this.mode = 'edit';
  //   this.editingId = item.id;
  //   this.form.patchValue({
  //     service: item.service,
  //     name: item.name,
  //     priceMonthly: item.priceMonthly,
  //     priceYearly: item.priceYearly,
  //     description1: item.description1 ?? '',
  //     description2: item.description2 ?? ''
  //   });
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }

  // remove(item: Package): void {
  //   Swal.fire({
  //     title: `Delete "${item.name}"?`,
  //     text: 'This action cannot be undone.',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Delete',
  //     confirmButtonColor: '#d33'
  //   }).then(res => {
  //     if (res.isConfirmed) {
  //       this.store.delete(item.id);
  //       this.refresh();
  //       Swal.fire({ icon: 'success', title: 'Deleted' });
  //     }
  //   });
  // }

  // view(item: Package): void {
  //   const html = `
  //     <div class="text-start">
  //       <div><strong>Service:</strong> ${item.service}</div>
  //       <div><strong>Monthly:</strong> ${this.formatCurrency(item.priceMonthly)}</div>
  //       <div><strong>Yearly:</strong> ${this.formatCurrency(item.priceYearly)}</div>
  //       ${item.description1 ? `<hr><div><strong>About Package</strong><br>${this.escape(item.description1)}</div>` : ''}
  //       ${item.description2 ? `<hr><div><strong>Terms & conditions</strong><br>${this.escape(item.description2)}</div>` : ''}
  //       <hr class="my-2">
  //       <div class="small text-muted">Created: ${new Date(item.createdAt).toLocaleString()}</div>
  //       <div class="small text-muted">Updated: ${new Date(item.updatedAt).toLocaleString()}</div>
  //     </div>
  //   `;
  //   Swal.fire({
  //     title: item.name,
  //     html,
  //     icon: 'info',
  //     confirmButtonText: 'Close',
  //     width: 600
  //   });
  // }

  // cancelEdit(): void {
  //   this.resetForm();
  // }

  // private resetForm(): void {
  //   this.mode = 'create';
  //   this.editingId = null;
  //   this.form.reset();
  // }

  // private formatCurrency(n: number | null): string {
  //   if (n == null) return '-';
  //   return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  // }

  // private escape(s: string): string {
  //   const div = document.createElement('div');
  //   div.innerText = s;
  //   return div.innerHTML;
  // }

  // // optional: seed some demo data once
  // seedDemo(): void {
  //   if (this.list.length) return;
  //   this.store.add({
  //     service: 'Couples',
  //     name: 'Golden Care',
  //     priceMonthly: 6250,
  //     priceYearly: 150000,
  //     description1: 'Includes home visits and priority support',
  //     description2: 'Diet plan + teleconsultations'
  //   });
  //   this.refresh();
  //}

  form!: FormGroup;
  mode: 'create' | 'edit' = 'create';
  packages: Package[] = [];
  filtered: Package[] = [];
  selectedId: number | null = null;
  search: string = '';

  services = ['Couples', 'Individuals'];

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      service: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(60)]],
      priceMonthly: [null],
      priceYearly: [null],
      aboutPackage: [''],
      termsAndConditions: ['']
    });

    this.loadPackages();
  }

  // Load packages from API
  loadPackages(): void {
    this.packageService.getAll().subscribe({
      next: (data) => {
        this.packages = data;
        this.filtered = data;
      },
      error: (err) => console.error('Error loading packages:', err)
    });
  }

  // Filter by search
  applyFilter(): void {
    const s = this.search.toLowerCase();
    this.filtered = this.packages.filter(
      p =>
        p.name.toLowerCase().includes(s) ||
        p.service.toLowerCase().includes(s)
    );
  }

  // Submit (Add / Update)
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;

    if (this.mode === 'create') {
      this.packageService.add(payload).subscribe({
        next: () => {
          this.loadPackages();
          this.form.reset();
        },
        error: (err) => console.error('Error creating package:', err)
      });
    } else if (this.mode === 'edit' && this.selectedId) {
      this.packageService.update(this.selectedId, payload).subscribe({
        next: () => {
          this.loadPackages();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating package:', err)
      });
    }
  }

  // Edit package
  edit(pkg: Package): void {
    this.mode = 'edit';
    this.selectedId = pkg.id;
    this.form.patchValue({
      service: pkg.service,
      name: pkg.name,
      priceMonthly: pkg.priceMonthly,
      priceYearly: pkg.priceYearly,
      aboutPackage: pkg.aboutPackage,
      termsAndConditions: pkg.termsAndConditions
    });
  }

  // Cancel edit
  cancelEdit(): void {
    this.mode = 'create';
    this.selectedId = null;
    this.form.reset();
  }

  // Delete package
  remove(pkg: Package): void {
    if (!confirm(`Delete package "${pkg.name}"?`)) return;

    this.packageService.delete(pkg.id).subscribe({
      next: () => this.loadPackages(),
      error: (err) => console.error('Error deleting package:', err)
    });
  }

  // View package details (expand later with modal)
  // view(pkg: Package): void {
  //   alert(`Package: ${pkg.name}\nService: ${pkg.service}\nPrice Monthly: ${pkg.priceMonthly}\nPrice Yearly: ${pkg.priceYearly}`);
  // }

  
  view(pkg: Package): void {
      const createdAt = pkg.created_at
    ? formatDate(pkg.created_at, 'medium', 'en-US')
    : 'N/A';
  const updatedAt = pkg.created_at
    ? formatDate(pkg.created_at, 'medium', 'en-US')
    : 'N/A';
// console.log(,pkg.updated)

    const html = `
      <div class="text-start">
        <div><strong>Service:</strong> ${pkg.service}</div>
        <div><strong>Monthly:</strong> ${pkg.priceMonthly}</div>
        <div><strong>Yearly:</strong> ${pkg.priceYearly}</div>
        ${pkg.aboutPackage ? `<hr><div><strong>About Package</strong><br>${pkg.aboutPackage}</div>` : ''}
        ${pkg.termsAndConditions ? `<hr><div><strong>Terms & conditions</strong><br>${pkg.termsAndConditions}</div>` : ''}
        <hr class="my-2">
        <div class="small text-muted">Created: ${createdAt}</div>
      <div class="small text-muted">Updated: ${updatedAt}</div>
      </div>
    `;
    Swal.fire({
      title: pkg.name,
      html,
      icon: 'info',
      confirmButtonText: 'Close',
      width: 600
    });
  }

  
}