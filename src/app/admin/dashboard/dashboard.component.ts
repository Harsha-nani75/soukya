import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import {  ChartType } from 'chart.js';
import { subscribeOn, Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
   data: any = {};
  chartData!: ChartData<'line'>;
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  };
    sub!: Subscription;

  // Visitors cycle
  visitorModes = ['today', 'monthly', 'yearly', 'total'];
  currentModeIndex = 0;
  currentVisitorLabel = 'Today';
  currentVisitorValue = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe(res => {
      this.data = res;
      this.chartData = {
        labels: res.chart.labels,
        datasets: [
          {
            label: 'Geriatric Enquiries',
            data: res.chart.geriatric,
            borderColor: 'green',
            fill: false
          },
          {
            label: 'Medical Enquiries',
            data: res.chart.medical,
            borderColor: 'orange',
            fill: false
          },
          {
            label: 'Total Patients',
            data: res.chart.patients,
            borderColor: 'red',
            fill: false
          }
        ]
      };
    });

     this.sub = this.dashboardService.getDashboardData().subscribe(res => {
      this.data = res;
      this.updateVisitorValue(); // keep updated
    }
    
  );

    
  }

  updateVisitorValue() {
    switch (this.visitorModes[this.currentModeIndex]) {
      case 'today':
        this.currentVisitorLabel = 'Today';
        this.currentVisitorValue = this.data?.todayVisitors || 0;
        break;
      case 'monthly':
        this.currentVisitorLabel = 'Monthly';
        this.currentVisitorValue = this.data?.monthlyVisitors || 0;
        break;
      case 'yearly':
        this.currentVisitorLabel = 'Yearly';
        this.currentVisitorValue = this.data?.yearlyVisitors || 0;
        break;
      case 'total':
        this.currentVisitorLabel = 'Total';
        this.currentVisitorValue = this.data?.totalVisitors || 0;
        break;
    }
  }
  

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

}
