import { Injectable } from '@angular/core';
import { Package } from '../admin/packages/package.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './environment';
const STORAGE_KEY = 'packages';


@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }
  // private read(): Package[] {
  //   const raw = localStorage.getItem(STORAGE_KEY);
  //   return raw ? (JSON.parse(raw) as Package[]) : [];
  // }

  // private write(list: Package[]): void {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  // }

  // getAll(): Package[] {
  //   return this.read();
  // }

  // getById(id: number): Package | undefined {
  //   return this.read().find(p => p.id === id);
  // }

  // add(pkg: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Package {
  //   const list = this.read();
  //   const id = list.length ? Math.max(...list.map(p => p.id)) + 1 : 1;
  //   const now = new Date().toISOString();
  //   const item: Package = { id, createdAt: now, updatedAt: now, ...pkg };
  //   list.push(item);
  //   this.write(list);
  //   return item;
  // }

  // update(id: number, patch: Partial<Package>): Package | undefined {
  //   const list = this.read();
  //   const idx = list.findIndex(p => p.id === id);
  //   if (idx === -1) return undefined;
  //   const updated: Package = {
  //     ...list[idx],
  //     ...patch,
  //     id,
  //     updatedAt: new Date().toISOString(),
  //   };
  //   list[idx] = updated;
  //   this.write(list);
  //   return updated;
  // }

  // delete(id: number): void {
  //   const list = this.read().filter(p => p.id !== id);
  //   this.write(list);
  // }

  // clearAll(): void {
  //   localStorage.removeItem(STORAGE_KEY);
  // }
// API methods for package management

    getAll(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.apiUrl}/package`);
  }

  // Get single package by ID
  getById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.apiUrl}/package/${id}`);
  }

  // Create new package
  add(pkg: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/package`, pkg);
  }

  // Update package
  update(id: number, pkg:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/package/${id}`, pkg);
  }

  // Delete package
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/package/${id}`);
  }

}
