import { Injectable } from '@angular/core';
import { ApplicationUser, StorageUser } from './interfaces';


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

	updateStorageUser(currentUser: ApplicationUser) {
		const storageUser: StorageUser = {
			avatar: currentUser.avatar
		}
		localStorage.setItem('storageUser', JSON.stringify(storageUser));
	}

	cleanStorage() {
		localStorage.clear();
	}
}
