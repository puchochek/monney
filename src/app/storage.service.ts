import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	constructor() { }

	updateToken(token: string) {
		localStorage.setItem('token', token);
	}

	cleanStorage() {
		localStorage.clear();
	}
}
