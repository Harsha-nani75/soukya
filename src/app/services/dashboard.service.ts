import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
//  private apiUrl = 'http://localhost:3000/api/dashboard'; // replace with your backend URL

  

    private data = {
    geriatricEnq: 12,
    medicalTourismEnq: 8,
    todayVisitors: 20,
    monthlyVisitors: 400,
    yearlyVisitors: 4800,
    totalVisitors: 5228,
    revenue: 250000,
    totalPatients: 320,
    generalEnq: 70,
    chart: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      geriatric: [120, 300, 200, 400, 350, 500, 450, 600, 700, 550, 500, 800],
      medical:   [80,  250, 180, 300, 320, 400, 380, 450, 600, 700, 650, 750],
      patients:  [20,  60,  90,  120, 150, 200, 230, 280, 300, 150, 80,  100]
    }
  };

  private subject = new BehaviorSubject<any>(this.data);

  constructor(private http: HttpClient) {
    // Auto-update visitor counts every 30s
    setInterval(() => {
      this.data.todayVisitors += Math.floor(Math.random() * 5);
      this.data.monthlyVisitors += Math.floor(Math.random() * 20);
      this.data.yearlyVisitors += Math.floor(Math.random() * 30);
      this.data.totalVisitors =
        this.data.todayVisitors +
        this.data.monthlyVisitors +
        this.data.yearlyVisitors;
      this.subject.next({ ...this.data });
    }, 30000);
  }

  getDashboardData() {
    return this.subject.asObservable();
  }


  }
