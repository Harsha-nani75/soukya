import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import {  ChartType } from 'chart.js';
import { interval, subscribeOn, Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
     data: any = {};
  chartData!: ChartData<'line'>;
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  };

  sub!: Subscription;
  visitorTimerSub!: Subscription;

  // Visitors cycle
  visitorModes = ['today', 'monthly', 'yearly', 'total'];
  currentModeIndex = 0;
  currentVisitorLabel = 'Today';
  currentVisitorValue = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Subscribe to dashboard data
    this.sub = this.dashboardService.getDashboardData().subscribe(res => {
      this.data = res;
      this.updateVisitorValue();
      this.updateChartData();
    });

    // Start visitor rotation every 5 seconds
    this.visitorTimerSub = interval(5000).subscribe(() => {
      this.currentModeIndex = (this.currentModeIndex + 1) % this.visitorModes.length;
      this.updateVisitorValue();
    });
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

  updateChartData() {
    this.chartData = {
      labels: this.data.chart?.labels || [],
      datasets: [
        {
          label: 'Geriatric Enquiries',
          data: this.data.chart?.geriatric || [],
          borderColor: 'green',
          fill: false
        },
        {
          label: 'Medical Enquiries',
          data: this.data.chart?.medical || [],
          borderColor: 'orange',
          fill: false
        },
        {
          label: 'Total Patients',
          data: this.data.chart?.patients || [],
          borderColor: 'red',
          fill: false
        }
      ]
    };
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.visitorTimerSub) this.visitorTimerSub.unsubscribe();
  }
}
