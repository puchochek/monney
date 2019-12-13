import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SnackBarService {
	private readonly snackMessage = new BehaviorSubject<string>(null);
	readonly _snackMessage = this.snackMessage.asObservable();

	constructor() { }

	get snackBarMessage(): string {
		return this.snackMessage.getValue();
	}

	set snackBarMessage(message: string) {
		this.snackMessage.next(message);
	}
}
