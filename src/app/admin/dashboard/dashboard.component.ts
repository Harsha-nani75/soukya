import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartOptions } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
// import { DashboardService } from 'src/app/services/dashboard.service';
import {  ChartType } from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
   
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
    }
  };

  // Labels
  public barChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

  // Dataset
  public barChartDatasets: ChartConfiguration<'bar'>['data']['datasets'] = [
    { data: [10, 20, 30, 40, 50], label: 'Sales' },
    { data: [15, 25, 35, 45, 55], label: 'Revenue' }
  ];
  
  dashboardData: any = {
    geriatricEnquiries: 0,
    medicalEnquiries: 0,
    totalPatients: 0,
    totalVisitors: 0,
    revenue: 0,
    generalEnquiries: 0,
    activeUsers: [],
    pageViews: []
  };
 constructor(public auth: AuthService, private router: Router) {}
   
  ngOnInit():void {
     this.loadDashboard();
  }
  
  loadDashboard(): void {
  //   this.dashboardService.getDashboardData().subscribe(data => {
  //     this.dashboardData = data;
  //   }
  // );
  }
  
renderCharts(): void {
  // Enquiries chart
  new Chart('enquiriesChart', {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [
        { label: 'Geriatric Enquiries', data: this.dashboardData.geriatricMonthly, borderColor: 'green', fill: false },
        { label: 'Medical Enquiries', data: this.dashboardData.medicalMonthly, borderColor: 'orange', fill: false },
        { label: 'Patients', data: this.dashboardData.patientMonthly, borderColor: 'red', fill: false }
      ]
    }
  });

  // Active Users chart
  new Chart('activeUsersChart', {
    type: 'line',
    data: {
      labels: this.dashboardData.last7Days,
      datasets: [{ label: 'Active Users', data: this.dashboardData.activeUsers, borderColor: 'blue', fill: false }]
    }
  });

  // Page Views chart
  new Chart('pageViewsChart', {
    type: 'line',
    data: {
      labels: this.dashboardData.last7Days,
      datasets: [{ label: 'Page Views', data: this.dashboardData.pageViews, borderColor: 'cyan', fill: false }]
    }
  });

}

}
