import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoggedUser } from '../interfaces';
import { environment } from '../../environments/environment';
import { ModalComponent } from '../modal/modal.component';


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

	isValidName: boolean; // form validation
	isEmailValid: boolean; // form validation
	isPasswordVaild: boolean; // form validation
	isInvalidInput: boolean; //
	invalidInputMessage: string;
	url: string;
	title: string;
	isLogin: boolean;

	confirmAuthorisationModal: MatDialogRef<ModalComponent>;

	constructor(
		private dataService: DataService,
		private http: HttpClient,
		private router: Router,
		private dialog: MatDialog
		 ) { }

	ngOnInit() {
		this.nameFieldLabel = 'name';
		this.mailFieldLabel = 'e-mail';
		this.passwordFieldLabel = 'password';
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
		/* allows lowercase and one uppercase letters and numbers from 1 to 40 symbols length */
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
		/*Password expresion that requires one lower case letter, one upper case letter, one digit, 5-10 length, and no spaces.*/
		const expression = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{5,10}$/;
		if (passwordInput && (expression.test(String(passwordInput)))) {
			isPasswordVaild = true;
		}
		return isPasswordVaild;
	}

	login() {
		const url = `${environment.apiBaseUrl}/user/register`;
		this.http.post(url, {
			password: this.password,
			name: this.name,
			email: this.mailAddress
		}, { observe: 'response' }).subscribe(
			response => {
				console.log('---> LoginFormComponent REGISTRED', response);
				this.openConfirmAuthorisationModal(`Congratulations! You were succesfully logged in. Now check your email to continue.`);
				const currantUser = <LoggedUser>response.body;
				this.dataService.updateUserId(currantUser.id);
			},
			error => {
				console.log('---> LoginFormComponent error ', error);
				this.openConfirmAuthorisationModal(`Something goes wrong. Please, try again.`);
				this.dataService.cleanLocalstorage();
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	autorize() {
		const url = `${environment.apiBaseUrl}/user/autorize`;
		this.http.post(url, {
			password: this.password,
			name: this.name,
			email: this.mailAddress
		}, { observe: 'response' }
		).subscribe(
			response => {
				const currentUser = <LoggedUser>response.body;
				console.log('---> AUTHORIZED response ', response);
				if (currentUser) {
					this.dataService.updateUserId(currentUser.id);
					this.updateToken(currentUser);
					this.router.navigate(['/home']);
				} else {
					this.openConfirmAuthorisationModal(`Something goes wrong. Please, try again.`);
				}
			},
			error => {
				console.log('---> autorize error ', error);
				this.openConfirmAuthorisationModal(`Something goes wrong. Please, try again.`);
				this.dataService.cleanLocalstorage();
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	updateToken(authorizedUser: LoggedUser) {
		const url = `${environment.apiBaseUrl}/user/user-token/${authorizedUser.id}`;
		this.http.get(url, { observe: 'response' }
		).subscribe(
			response => {
				console.log('---> AUTHORIZED updateToken response ', response);
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.router.navigate(['/home']);
			},
			error => {
				this.openConfirmAuthorisationModal(`Something goes wrong. Please, try again.`);
				console.log('---> updateToken autorize error ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	openConfirmAuthorisationModal(message: string) {
		this.confirmAuthorisationModal = this.dialog.open(ModalComponent, {
			hasBackdrop: false,
			data: {
				message: message
			}
		});
	}
}
