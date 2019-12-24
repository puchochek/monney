import { Injectable } from '@angular/core';
import { ApplicationUser } from './interfaces';
import { HttpClient, HttpRequest } from '@angular/common/http';
//import { Headers, RequestOptions, Response } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import { Observable, throwError } from 'rxjs';
// import { catchError, retry } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	userBaseUrl: string = `${environment.apiBaseUrl}/user`;

	constructor(
		private http: HttpClient,
		private router: Router,
	) { }


	createNewUser(user: ApplicationUser) {
		const requestUrl = `${this.userBaseUrl}/register`;
		console.log('---> requestUrl ', requestUrl);
		this.http.post(requestUrl, user, { observe: 'response' }
		).subscribe(
			response => {
				console.log('---> login response ', response);
			},
			error => {
				console.log('---> user login error ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	singInWithGoogle() {
		// const requestUrl = `${environment.apiBaseUrl}/auth/google`;
		this.router.navigate(['/externalRedirect', { externalUrl: `${environment.apiBaseUrl}/auth/google` }], {
			skipLocationChange: true,
		});
	}
}
