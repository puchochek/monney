import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	constructor() { }

	updateToken(token: string) {
		console.log('---> StorageService token ', token);
		if (token) {
			localStorage.setItem('token', token);
		}
	}

	cleanStorage() {
		localStorage.clear();
	}
}
