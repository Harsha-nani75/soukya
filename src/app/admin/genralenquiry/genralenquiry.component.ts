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

  startEntry = 0;
  endEntry = 0;

  constructor(private enq: EnquiryService) {}

  ngOnInit() {
    this.fetchEnquiries();
  }

  fetchEnquiries() {
    this.enq.getEnquires().subscribe({
      next: (data) => {
        this.allData = data;
        this.filterData();
      },
      error: (err) => {
        console.error('Error fetching enquiries:', err);
      }
    });
  }

  filterData() {
    const lowerSearch = this.searchText.toLowerCase();
    this.filteredData = this.allData.filter(entry =>
      entry.name.toLowerCase().includes(lowerSearch) ||
      entry.phoneNo?.includes(lowerSearch) ||
      entry.email.toLowerCase().includes(lowerSearch) ||
      entry.message.toLowerCase().includes(lowerSearch) ||
      entry.serviceType.toLowerCase().includes(lowerSearch) ||
      entry.treatmentIssue?.toLowerCase().includes(lowerSearch)
    );
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
}
