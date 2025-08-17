import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ChartConfiguration, ChartType } from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
   
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  public barChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartConfiguration['data']['datasets'] = [
    { data: [65, 59, 80, 81, 56, 55], label: 'Sales' },
    { data: [28, 48, 40, 19, 86, 27], label: 'Expenses' }
  ];
// Dashboard data
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
 constructor(public auth: AuthService, private router: Router,private dashboardService: DashboardService) {}
   
  ngOnInit():void {
     this.loadDashboard();
  }
  
  loadDashboard(): void {
    this.dashboardService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
    });
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
