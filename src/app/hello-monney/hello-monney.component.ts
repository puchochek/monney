import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

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
		const userId = localStorage.getItem('userId');
		const token = localStorage.getItem('token');
		const url = `http://localhost:3000/user/user-by-id/${userId}`;
		console.log('---> HELLO-MONNEY token ', token);
		console.log('---> HELLO-MONNEY userId ', userId);
		if (token) {
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.dataService.updateToken(response.headers.get('Authorization'));
						const currentUser = <LoggedUser>response.body;
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
