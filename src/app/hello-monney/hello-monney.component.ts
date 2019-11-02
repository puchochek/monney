import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { environment } from '../../environments/environment'

@Component({
	selector: 'app-hello-monney',
	templateUrl: './hello-monney.component.html',
	styleUrls: ['./hello-monney.component.scss']
})
export class HelloMonneyComponent implements OnInit {
	isPageLoad: boolean;

	constructor(
		private http: HttpClient,
		private router: Router,
		private dataService: DataService,

	) { }

	ngOnInit() {
		//http://localhost:4200/myprofile/e2c71aff-6861-4fb0-89b6-238df0456031
		const userId = localStorage.getItem('userId');
		const token = localStorage.getItem('token');
		//TODO why no  headers???
		// this.http.get(`${environment.apiBaseUrl}/user/test`, { observe: 'response' })
		// .subscribe(
		// 	response => {
		// 		console.log('---> TEST response ', response);
		// 	},
		// 	error => {
		// 		console.log('---> TEST error ', error);
		// 	},
		// 	() => {
		// 		// 'onCompleted' callback.
		// 		// No errors, route to new page here
		// 	}
		// );



		const url = `${environment.apiBaseUrl}/user/user-by-id/${userId}`;
		console.log('---> HELLO-MONNEY token ', token);
		console.log('---> HELLO-MONNEY userId ', userId);
		if (token) {
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.dataService.updateToken(response.headers.get('Authorization'));
						const currentUser = <LoggedUser>response.body;
						console.log('---> HELLO-MONNEY response ', response);
						//console.log('---> currentUser ', currentUser);
						if (currentUser) {
							this.router.navigate(['/myprofile/' + currentUser.id]);
						} else {
							this.isPageLoad = true;
						}
					},
					error => {
						console.log('---> HELLO-MONNEY error ', error);
						this.isPageLoad = true;
						this.dataService.cleanLocalstorage();
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		} else {
			this.isPageLoad = true;
		}
	}
}
