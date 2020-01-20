import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ValidationService {

	constructor() { }

	validateStringInput(regExpString: RegExp, input: string): boolean {
		const regExp = new RegExp(regExpString);

		return regExp.test(input);
	}

	validateNumberInput(input: string): boolean {

		return isNaN(Number(input)) ? false : true;
	}
}
