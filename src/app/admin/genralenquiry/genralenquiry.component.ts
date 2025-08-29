import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnquiryService } from 'src/app/services/enquiry.service';

@Component({
  selector: 'app-genralenquiry',
  templateUrl: './genralenquiry.component.html',
  styleUrls: ['./genralenquiry.component.css']
})
export class GenralenquiryComponent implements OnInit {
// allData: any[] = [];
//   filteredData: any[] = [];
//   paginatedData: any[] = [];

//   entriesPerPage = 10;
//   currentPage = 1;
//   searchText = '';

//   startEntry = 0;
//   endEntry = 0;
//     constructor(private http: HttpClient,private enq:EnquiryService) {}


//   ngOnInit() {
//      this.http.get<any[]>('assets/genralenq.json').subscribe(data => {
//       this.allData = data;
//       this.filterData();
//     });
//      }

//   generateDummyData(): any[] {
//     const data: any[] = [];
//     for (let i = 1; i <= 50; i++) {
//       data.push({
//         name: `User ${i}`,
//         mobile: `99999${1000 + i}`,
//         email: `user${i}@example.com`,
//         message: `This is message number ${i}`
//       });
//     }
//     return data;
//   }

//   filterData() {
//     const lowerSearch = this.searchText.toLowerCase();
//     this.filteredData = this.allData.filter(entry =>
//       entry.name.toLowerCase().includes(lowerSearch) ||
//       entry.mobile.includes(lowerSearch) ||
//       entry.email.toLowerCase().includes(lowerSearch) ||
//       entry.message.toLowerCase().includes(lowerSearch)
//     );
//     this.currentPage = 1;
//     this.updatePagination();
//   }

//   updatePagination(): void {
//     const start = (this.currentPage - 1) * this.entriesPerPage;
//     const end = start + this.entriesPerPage;
//     this.startEntry = start;
//     this.endEntry = Math.min(end, this.filteredData.length);
//     this.paginatedData = this.filteredData.slice(start, end);
//   }

//   nextPage() {
//     if ((this.currentPage * this.entriesPerPage) < this.filteredData.length) {
//       this.currentPage++;
//       this.updatePagination();
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.updatePagination();
//     }
//   }

allData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];

  entriesPerPage = 10;
  currentPage = 1;
  searchText = '';
  selectedServiceType = ''; // For service type filtering

  startEntry = 0;
  endEntry = 0;

  constructor(private enq: EnquiryService) {}

  ngOnInit() {
    this.fetchEnquiries();
  }

  fetchEnquiries() {
    this.enq.getEnquires().subscribe({
      next: (data) => {
        // console.log('📊 Raw enquiry data received:', data);
        // console.log('📅 Date field analysis:', {
        //   hasCreatedDate: data.some((e: any) => e.created_date),
        //   hasCreatedAt: data.some((e: any) => e.createdAt),
        //   hasCreatedDateCamel: data.some((e: any) => e.createdDate),
        //   sampleDates: data.slice(0, 3).map((e: any) => ({
        //     id: e.id,
        //     created_date: e.created_date,
        //     createdAt: e.createdAt,
        //     createdDate: e.createdDate
        //   }))
        // });
        
        this.allData = data;
        this.filterData();
      },
      error: (err) => {
        console.error('Error fetching enquiries:', err);
      }
    });
  }

  filterData() {
    let filtered = this.allData;

    // Filter by service type first
    if (this.selectedServiceType) {
      filtered = filtered.filter(entry => 
        entry.serviceType?.toLowerCase() === this.selectedServiceType.toLowerCase()
      );
    }

    // Then filter by search text
    if (this.searchText.trim()) {
      const lowerSearch = this.searchText.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.name?.toLowerCase().includes(lowerSearch) ||
        entry.phoneNo?.toLowerCase().includes(lowerSearch) ||
        entry.email?.toLowerCase().includes(lowerSearch) ||
        entry.message?.toLowerCase().includes(lowerSearch) ||
        entry.serviceType?.toLowerCase().includes(lowerSearch) ||
        entry.treatmentIssue?.toLowerCase().includes(lowerSearch) ||
        entry.address?.toLowerCase().includes(lowerSearch)
      );
    }

    this.filteredData = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + this.entriesPerPage;
    this.startEntry = start;
    this.endEntry = Math.min(end, this.filteredData.length);
    this.paginatedData = this.filteredData.slice(start, end);
  }

  nextPage() {
    if ((this.currentPage * this.entriesPerPage) < this.filteredData.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // Helper methods for summary cards
  getElderCareCount(): number {
    return this.allData.filter(entry => 
      entry.serviceType?.toLowerCase() === 'elder care'
    ).length;
  }

  getMedicalTourismCount(): number {
    return this.allData.filter(entry => 
      entry.serviceType?.toLowerCase() === 'medical tourism'
    ).length;
  }

  // Clear all filters
  clearFilters() {
    this.searchText = '';
    this.selectedServiceType = '';
    this.filterData();
  }

  // Get filtered data info for debugging
  getFilterInfo(): string {
    if (this.selectedServiceType && this.searchText.trim()) {
      return `Showing ${this.filteredData.length} results for "${this.selectedServiceType}" service matching "${this.searchText}"`;
    } else if (this.selectedServiceType) {
      return `Showing ${this.filteredData.length} results for "${this.selectedServiceType}" service`;
    } else if (this.searchText.trim()) {
      return `Showing ${this.filteredData.length} results matching "${this.searchText}"`;
    } else {
      return `Showing all ${this.filteredData.length} enquiries`;
    }
  }

  // Debug information computed properties
  getCreatedDateCount(): number {
    return this.allData.filter(e => e.created_date).length;
  }

  getCreatedAtCount(): number {
    return this.allData.filter(e => e.createdAt).length;
  }

  getCreatedDateCamelCount(): number {
    return this.allData.filter(e => e.createdDate).length;
  }

  getFirstRecordDate(): any {
    if (this.allData.length > 0) {
      const first = this.allData[0];
      if (first.created_date) return first.created_date;
      if (first.createdAt) return first.createdAt;
      if (first.createdDate) return first.createdDate;
    }
    return null;
  }

  getFirstRecordDateField(): string {
    if (this.allData.length > 0) {
      const first = this.allData[0];
      if (first.created_date) return 'created_date';
      if (first.createdAt) return 'createdAt';
      if (first.createdDate) return 'createdDate';
    }
    return 'none';
  }
}
