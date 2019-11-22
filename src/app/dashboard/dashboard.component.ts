import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard.service';



@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	private sbscr: Subscription;
	dashboardConfig: any;

	constructor(
		private router: Router,
		public dashboardServise: DashboardService
	) { }

	ngOnInit() {
		this.sbscr = this.dashboardServise._dashboardSettings.subscribe((response) => {
			console.log('---> DASHBOARD  dashboardServise INIT', response);
			if (response) {
				this.dashboardConfig = response;
			} else {
				this.router.navigate(['/dashboard/config']);
			}
		});
	}

	ngOnDestroy() {
		this.sbscr.unsubscribe();
	}

}
