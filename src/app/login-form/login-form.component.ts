import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { LoggedUser } from '../interfaces';

const wrongName = `Name field may only consist of letters or numbers.`;
const wrongEmail = `Email field must contain @ symbol.`;
const wrongPassword = `Password must contain 5 or more characters.
At least one upper case letter, one lower case letter and one no-letter character.`;

@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

	@Input() name: string;
	@Input() mailAddress: string;
	@Input() password: string;

	nameFieldLabel: string;
	mailFieldLabel: string;
	passwordFieldLabel: string;

	status: string; // FWP?
	isValidName: boolean; // form validation
	isEmailValid: boolean; // form validation
	isPasswordVaild: boolean; // form validation
	isInvalidInput: boolean; //
	invalidInputMessage: string;
	url: string;
	isModalShown: boolean;
	isLoginFormShown: boolean;
	message: string;
	title: string;
	isLogin: boolean;


	constructor(
		private data: DataService,
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router, ) { }

	ngOnInit() {
		this.nameFieldLabel = 'name';
		this.mailFieldLabel = 'e-mail';
		this.passwordFieldLabel = 'password';
		this.isLoginFormShown = true;
		this.isModalShown = false;
		this.url = this.router.url;
		this.isLogin = this.url == '/login' ?
			true
			: false;
		this.title = this.isLogin ?
			'sign up'
			: 'sign in';
	}

	validateInput() {
		this.isValidName = this.validateName(this.name);
		this.isEmailValid = this.validateEmail(this.mailAddress);
		this.isPasswordVaild = this.validatePassword(this.password);

		if (this.isValidName && this.isEmailValid && this.isPasswordVaild) {
			if (this.isLogin) {
				this.login();
			} else {
				this.autorize();
			}
		} else {
			this.isInvalidInput = true;
			this.invalidInputMessage = this.setErrorMessage(this.isValidName, this.isEmailValid, this.isPasswordVaild);
		}
	}

	setErrorMessage(isValidName: boolean, isEmailValid: boolean, isPasswordVaild: boolean): string {
		let invalidInputMessage: string;

		if (!isValidName && !isEmailValid && !isPasswordVaild) {
			invalidInputMessage = `${wrongName} ${wrongEmail} ${wrongPassword}`;
		} else if (!isValidName && !isPasswordVaild) {
			invalidInputMessage = `${wrongName} ${wrongPassword}`;
		} else if (!isEmailValid && !isPasswordVaild) {
			invalidInputMessage = `${wrongEmail} ${wrongPassword}`;
		} else if (!isValidName && !isEmailValid) {
			invalidInputMessage = `${wrongName} ${wrongEmail}`;
		} else if (!isValidName) {
			invalidInputMessage = wrongName;
		} else if (!isEmailValid) {
			invalidInputMessage = wrongEmail;
		} else if (!isPasswordVaild) {
			invalidInputMessage = wrongPassword;
		} else {
			invalidInputMessage = `Something is wrong, but I don't know what exactly.`;
		}

		return invalidInputMessage;
	}

	validateName(nameInput: string) {
		// allows lowercase and one uppercase letters and numbers from 1 to 40 symbols length
		let isNameValid = false;
		const expression = /^([- A-Za-zа-яА-ЯёЁ0-9]+)$/;
		if (nameInput) {
			if ((nameInput.length > 0) && (nameInput.length < 40)) {
				if (expression.test(String(nameInput).toLowerCase())) {
					isNameValid = true;
				}
			}
		}
		return isNameValid;
	}

	validateEmail(emailInput: string): boolean {
		let isEmailValid = false;
		const expression = /\S+@\S+/;
		if (emailInput && (expression.test(String(emailInput).toLowerCase()))) {
			isEmailValid = true;
		}
		return isEmailValid;
	}

	validatePassword(passwordInput: string): boolean {
		let isPasswordVaild = false;
		//Password expresion that requires one lower case letter, one upper case letter, one digit, 5-10 length, and no spaces.
		const expression    = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{5,10}$/;
		if (passwordInput && (expression.test(String(passwordInput)))) {
			isPasswordVaild = true;
		}
		return isPasswordVaild;
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
}
