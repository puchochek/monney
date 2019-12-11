import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	TITLE = `monney`;
	isLoading: boolean;
	private spinnerSubscription: Subscription;

	constructor(
		private userService: UserService,
		private spinnerService: SpinnerService,
	) { this.userService.getUser(); }

	ngOnInit() {
		this.spinnerSubscription = this.spinnerService._spinner.subscribe((response) => {
			console.log('---> APP _SPINNER ', response);
			this.isLoading = response;
		});
	}

	ngOnDestroy() {
		if (this.spinnerSubscription) {
			this.spinnerSubscription.unsubscribe();
		}
	}

}
