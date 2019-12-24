import { Injectable } from '@angular/core';
import { ApplicationUser } from './interfaces';
import { HttpClient, HttpRequest } from '@angular/common/http';
//import { Headers, RequestOptions, Response } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	userBaseUrl: string = `${environment.apiBaseUrl}/user`;

	constructor(
		private http: HttpClient
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
}
