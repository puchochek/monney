import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggedUser } from './interfaces';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly user = new BehaviorSubject<LoggedUser>(null);
	readonly _user = this.user.asObservable();

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router
	) { }

	get appUser(): LoggedUser {
		return this.user.getValue();
	}

	set appUser(user: LoggedUser) {
		this.user.next(user);
	}

	doUserControllerCall() {
		console.log('---> doUserControllerCall');
		const tokenisedId = localStorage.getItem("token").split(" ")[1];
		const url = `${environment.apiBaseUrl}/user/user-by-token/${tokenisedId}`;
		this.http.get(url, { observe: 'response' })
			.subscribe(
				response => {
					this.appUser = <LoggedUser>response.body;
					this.dataService.updateToken(response.headers.get('Authorization'));
					console.log('---> USER SERVICE response ', response);
				},
				error => {
					console.log('---> USER SERVICE error ', error);
					this.router.navigate(['/hello-monney']);
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}
}
