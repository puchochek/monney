import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';




@Component({
	selector: 'app-hello-monney',
	templateUrl: './hello-monney.component.html',
	styleUrls: ['./hello-monney.component.scss']
})
export class HelloMonneyComponent implements OnInit {
	isPageLoad: boolean;
	isLoading: boolean = true;
	welcomeMessage: string = `Welcome to the monney-app !`;
	haveAccountMessage: string = `already have an account here ?`;
	private subscription: Subscription;


	constructor(
		private http: HttpClient,
		private router: Router,
		private dataService: DataService,
		private userService: UserService,
	) { }

	ngOnInit() {
		const token = localStorage.getItem("token");
		if (token) {
			const tokenisedId = localStorage.getItem("token").split(" ")[1];
			const url = `${environment.apiBaseUrl}/user/user-by-token/${tokenisedId}`;
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						localStorage.setItem("token", response.headers.get('Authorization').split(" ")[1])
						this.dataService.updateToken(response.headers.get('Authorization'));
						const currentUser = <LoggedUser>response.body;
						console.log('---> HELLO-MONNEY response ', response);
						if (currentUser) {
							this.userService.appUser = currentUser;
							this.isLoading = false;
							this.router.navigate(['/home']);
						} else {
							this.isPageLoad = true;
							this.isLoading = false;
						}
					},
					error => {
						console.log('---> HELLO-MONNEY error ', error);
						this.isPageLoad = true;
						this.isLoading = false;
						this.dataService.cleanLocalstorage();
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		} else {
			this.isPageLoad = true;
			this.isLoading = false;
		}
	}
}
