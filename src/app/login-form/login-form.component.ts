import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { LoggedUser } from '../interfaces';

const wrongName = `Name field may only consist of letters or numbers.`;
const wrongEmail = `Email field must contain @ symbol.`;
const wrongPassword = `Password must contain 6 or more characters.
Requires at least one upper case letter, one lower case letter and one no-letter character.`;

@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

	@Input() name: string;
	@Input() mailAddress: string;
	@Input() password: string;

	status: string;
	isValidName: boolean;
	isEmailValid: boolean;
	isPasswordVaild: boolean;
	isFormInvalid: boolean;
	isInvalidInput: boolean;
	invalidInputMessage: string;
	url: string;
	isModalShown: boolean;
	isLoginFormShown: boolean;
	message: string;

	constructor(
		private data: DataService,
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router, ) { }

	ngOnInit() {
		this.isLoginFormShown = true;
		this.isModalShown = false;
		this.url = this.router.url;
	}

	validateInput() {
		const requestParam = this.url.split('/')[1];
		//console.log('requestParam ', requestParam);
		this.isValidName = this.validateName(this.name);
		this.isEmailValid = this.validateEmail(this.mailAddress);
		this.isPasswordVaild = this.validatePassword(this.password);

		if (this.isValidName && this.isEmailValid && this.isPasswordVaild) {
			const currentAction = this.url;
			if (currentAction.includes('login')) {
				this.login();
			} else if (currentAction.includes('autorize')) {
				this.autorize();
			}
			//console.log('---> currentAction ', currentAction);

		} else {
			this.disableLoginButton();
			this.isInvalidInput = true;
			this.invalidInputMessage = this.setErrorMessage(this.isValidName, this.isEmailValid, this.isPasswordVaild);
		}
	}

	setErrorMessage(nameInput: boolean, emailInput: boolean, passwordInput: boolean): string {
		let invalidInputMessage: string;

		if (!nameInput && !emailInput && !passwordInput) {
			this.clearWrongInput(['name', 'email', 'password']);
			invalidInputMessage = wrongName + ' ' + wrongEmail + ' ' + wrongPassword;
		} else if (!nameInput && !passwordInput) {
			this.clearWrongInput(['name', 'password']);
			invalidInputMessage = wrongName + ' ' + wrongPassword;
		} else if (!emailInput && !passwordInput) {
			this.clearWrongInput(['email', 'password']);
			invalidInputMessage = wrongEmail + ' ' + wrongPassword;
		} else if (!nameInput && !emailInput) {
			this.clearWrongInput(['name', 'email']);
			invalidInputMessage = wrongName + ' ' + wrongEmail;
		} else if (!nameInput) {
			this.clearWrongInput(['name']);
			invalidInputMessage = wrongName;
		} else if (!emailInput) {
			this.clearWrongInput(['email']);
			invalidInputMessage = wrongEmail;
		} else if (!passwordInput) {
			this.clearWrongInput(['password']);
			invalidInputMessage = wrongPassword;
		} else {
			invalidInputMessage = `Something is wron, but I don't know what exactly.`;
		}

		return invalidInputMessage;
	}

	clearWrongInput(wrongInputs: string[]) {
		//console.log('wrongInput ', wrongInputs);
		wrongInputs.forEach(wrongInput => {
			switch (wrongInput) {
				case 'name':
					this.name = '';
				case 'email':
					this.mailAddress = '';
				case 'password':
					this.password = '';
			}
		});

	}

	validateName(nameInput: string) {
		// allows lowercase and one uppercase letters and numbers
		const expression = /^([- A-Za-zа-яА-ЯёЁ0-9]+)$/;
		if (expression.test(String(nameInput).toLowerCase()) || nameInput.length === 0) {
			return true;
		} else {
			return false;
		}
	}

	validateEmail(emailInput: string): boolean {
		const expression = /\S+@\S+/;
		return expression.test(String(emailInput).toLowerCase()) ? true : false;
	}

	disableLoginButton() {
		this.isFormInvalid = true;
	}

	validatePassword(passwordInput: string): boolean {
		//console.log('passwordInput ', passwordInput);
		// at least one number, one lowercase and one uppercase letter
		// at least six characters
		//const expression = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
		//const expression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
		const expression = /^[A-Za-z]\w{7,15}$/;
		//console.log(expression.test(String(passwordInput).toLowerCase()));
		return expression.test(String(passwordInput).toLowerCase()) ? true : false;

	}

	closeModal(event) {
		if (event.value === 'error') {
			this.isLoginFormShown = true;
			this.isModalShown = false;
		} else {
			this.message = 'Please, check your email to continue.';
			this.isLoginFormShown = false;
			this.isModalShown = true;
		}
	}

	login() {
		// TODO add validation for all params
		//console.log('password', this.password);
		this.http.post('http://localhost:3000/user/register', {
			password: this.password,
			name: this.name,
			email: this.mailAddress
		}).subscribe((response: LoggedUser) => {
			if (response) {
				console.log('---> result REGISTRED', response);
				this.status = 'saved';
				this.message = 'Congratulations! You were successfully logged in the app. Now check your email to continue.';
				this.isLoginFormShown = false;
				this.isModalShown = true;
			} else {
				this.status = 'error';
				this.message = 'Something goes wrong. Try again.';
				this.isLoginFormShown = false;
				this.isModalShown = true;
			}
			//this.router.navigate(['/login/' + response.name || 'error' + '/' + this.status]);
		});
	}

	autorize() {
		console.log('localStorage ', localStorage.getItem('token'));
		this.http.post('http://localhost:3000/user/autorize', {
			password: this.password,
			name: this.name,
			email: this.mailAddress
		}, {
				headers: new HttpHeaders().set('authorization', 'Bearer ' + localStorage.getItem('token'))
			}).subscribe((response: LoggedUser) => {
				console.log('result AUTHORIZED', response);
				if (response) {
					// TODO add modal message kind of "Check your email"
					// this.router.navigate(['/myprofile/' + response.id]);
				} else {
					// TODO add error modal
				}
			});
	}

	hideMessage() {
		this.isFormInvalid = false;
		this.isInvalidInput = false;
	}



}
