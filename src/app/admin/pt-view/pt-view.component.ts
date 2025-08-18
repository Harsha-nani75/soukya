import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pt-view',
  templateUrl: './pt-view.component.html',
  styleUrls: ['./pt-view.component.css']
})
export class PtViewComponent implements OnInit {
  patientId: any;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    // Fetch patient by ID if stored in service/API
  }
}
