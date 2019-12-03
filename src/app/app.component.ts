import { Component, OnInit } from '@angular/core';
import { LoggedUser } from './interfaces';
import { DataService } from './data.service';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'monney';
	currentUser: LoggedUser;
	private sbscr: Subscription;

	constructor(
		private dataService: DataService,
		private http: HttpClient,
		public userService: UserService,
		private router: Router,
	) { }

	ngOnInit() {
		this.sbscr = this.userService._user.subscribe((response) => {
			console.log('--->  MAIN userServise INIT', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.setAppBackground();
			} else {
				this.doUserControllerCall();
			}
		});
	}

	ngOnDestroy() {
		this.sbscr.unsubscribe();
	}

	doUserControllerCall() {
		const token = localStorage.getItem("token");
		if (token) {
			const tokenisedId = localStorage.getItem("token").split(" ")[1];
			const url = `${environment.apiBaseUrl}/user/user-by-token/${tokenisedId}`;
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						console.log('--->  MAIN doUserControllerCall ', response);
						this.currentUser = <LoggedUser>response.body;
						this.userService.appUser = this.currentUser;
						this.setAppBackground();
					},
					error => {
						console.log('---> MAIN error ', error);
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	setAppBackground() {
		console.log('---> setAppBackground ', this.currentUser.theme);
		document.getElementById('monney-app').style.backgroundImage = `url(../assets/images/${this.currentUser.theme}.jpg)`;
	}
 }
