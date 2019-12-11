import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private readonly spinner = new BehaviorSubject<boolean>(null);
	readonly _spinner = this.spinner.asObservable();

	constructor() { }

	get isLoading(): boolean {
		return this.spinner.getValue();
	}

	set isLoading(spinner: boolean) {
		this.spinner.next(spinner);
	}
}
