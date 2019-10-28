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
		private dataService: DataService,
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
		this.isValidName = this.isLogin ?
			this.validateName(this.name)
			: true;
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
		const expression = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{5,10}$/;
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
		const url = `http://localhost:3000/user/register`;
		this.http.post(url, {
			password: this.password,
			name: this.name,
			email: this.mailAddress
		}, { observe: 'response' }).subscribe(
			response => {
				console.log('---> LoginFormComponent REGISTRED', response);
				this.status = 'saved';
				this.message = 'Congratulations! You were successfully logged in the app. Now check your email to continue.';
				this.isLoginFormShown = false;
				this.isModalShown = true;
				const currantUser = <LoggedUser>response.body;
				this.dataService.updateUserId(currantUser.id);
			},
			error => {
				console.log('---> LoginFormComponent error ', error);
				this.status = 'error';
				this.message = 'Something goes wrong. Try again.';
				this.isLoginFormShown = false;
				this.isModalShown = true;
				this.dataService.cleanLocalstorage();
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	autorize() {
		const url = `http://localhost:3000/user/autorize`;
		this.http.post(url, {
			password: this.password,
			name: this.name,
			email: this.mailAddress
		}, { observe: 'response' }
		).subscribe(
			response => {
				this.isLoginFormShown = false;
				const currentUser = <LoggedUser>response.body;
				console.log('---> AUTHORIZED response ', response);
				if (currentUser) {
					this.dataService.updateUserId(currentUser.id);
					this.updateToken(currentUser);
					//this.router.navigate(['/myprofile/' + currentUser.id]);
				}
			},
			error => {
				console.log('---> autorize error ', error);
				this.status = 'error';
				this.message = 'Something goes wrong. Try again.';
				this.isLoginFormShown = false;
				this.isModalShown = true;
				this.dataService.cleanLocalstorage();
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	updateToken(authorizedUser: LoggedUser) {
		const url = `http://localhost:3000/user/user-token/${authorizedUser.id}`;
		this.http.get(url, { observe: 'response' }
		).subscribe(
			response => {
				// const currentUser = <LoggedUser>response.body;
				console.log('---> AUTHORIZED updateToken response ', response);
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.router.navigate(['/myprofile/' + authorizedUser.id]);
			},
			error => {
				console.log('---> updateToken autorize error ', error);
				this.status = 'error';
				this.message = 'Something goes wrong. Try again.';
				this.isLoginFormShown = false;
				this.isModalShown = true;
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);

	}
}
