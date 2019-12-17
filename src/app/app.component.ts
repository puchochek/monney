import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { SnackBarService } from './snack-bar.service';
import { ThemeService } from './theme.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	TITLE = `monney`;
	isLoading: boolean;
	private spinnerSubscription: Subscription;
	private snackBarSubscription: Subscription;
	private themeSubscription: Subscription;

	//backgroungImg: string = `https://res.cloudinary.com/dsiwkaugw/image/upload/v1576564427/purple-wall_ferxf4.jpg`;
	backgroungImg: string;

	constructor(
		private userService: UserService,
		private spinnerService: SpinnerService,
		private snackBar: MatSnackBar,
		private snackBarService: SnackBarService,
		private themeService: ThemeService,
	) {
		this.userService.getUser();
	}

	ngOnInit() {
		this.spinnerSubscription = this.spinnerService._spinner.subscribe((response) => {
			console.log('---> APP _SPINNER ', response);
			this.isLoading = response;
		});
		this.themeSubscription = this.themeService._theme.subscribe(response => {
			if (response) {
				console.log('---> backgroungImg ', response);
				this.backgroungImg = response;
			} else {
				this.backgroungImg = this.themeService.DEFAULT_THEME;
			}
		});
		this.snackBarSubscription = this.snackBarService._snackMessage.subscribe((response) => {
			if (response) {
				const snackMessage = response;
				const action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
			}
		});
	}

	ngOnDestroy() {
		if (this.spinnerSubscription) {
			this.spinnerSubscription.unsubscribe();
		}
		if (this.snackBarSubscription) {
			this.snackBarSubscription.unsubscribe();
		}
		if (this.themeSubscription) {
			this.themeSubscription.unsubscribe();
		}
	}

}
