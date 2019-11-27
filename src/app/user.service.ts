import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggedUser } from './interfaces';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private readonly user = new BehaviorSubject<LoggedUser>(null);
	readonly _user = this.user.asObservable();

	constructor() { }

	get appUser(): LoggedUser {
		return this.user.getValue();
	}

	set appUser(user: LoggedUser) {
		this.user.next(user);
	}
}
