import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	private readonly dashboardSettings = new BehaviorSubject<any>(null);
	readonly _dashboardSettings = this.dashboardSettings.asObservable();

	constructor() { }

	get dashboardConfig(): any {
		return this.dashboardSettings.getValue();
	}

	set dashboardConfig(dashboardSettings: any) {
		this.dashboardSettings.next(dashboardSettings);
	}
}
