import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from '../user.service';
import { ApplicationUser } from '../interfaces';
import { LoginUser } from '../interfaces';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	@Input() name: string;
	@Input() email: string;
	@Input() password: string;
	key: any;
	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		this.key = event.key;
	}

	isSpinner: boolean;
	isNewUser: boolean;
	loginFormLbl: string;
	isEmailValid: boolean;
	isPasswordValid: boolean;
	isNameValid: boolean;
	isInvalidNameMessage: boolean;
	isInvalidEmailMessage: boolean;
	isInvalidPasswordMessage: boolean;

	userNameLbl: string = `name`;
	userEmailLbl: string = `email`;
	userPasswordLbl: string = `password`;
	loginActionBtnLbl: string = `submit`;
	forgotPasswordLbl: string = `I forgot my password`;
	googleAuthLbl: string = `or sing in with google`;
	invalidNameMessage: string = `name has to contain at least 3 symbols`;
	invalidEmailMessage: string = `email has to contain @ symbol`;
	invalidPasswordMessage: string = `password has to contain 1 uppercase letter and 1 non-letter character at least`;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userService: UserService,
	) { }

	ngOnInit() {
		this.isNewUser = this.checkIfNewUser();
		this.loginFormLbl = this.isNewUser ? `sing in` : `sing up`;
	}

	checkIfNewUser(): boolean {
		const curentUrl = this.router.url;
		const curentUrlSplited = curentUrl.split(`/`);
		const lastParamIndex = curentUrlSplited.length - 1;
		const currentAction = curentUrlSplited[lastParamIndex];

		return currentAction === `singin` ? true : false;
	}

	submitForm() {
		if (this.isNewUser) {
			this.singInNewUser();
		} else {
			this.singUpExistedUser();
		}

	}

	singInNewUser() {
		this.isSpinner = true;
		this.isNameValid = this.validateUserName(this.name);
		this.isEmailValid = this.validateUserEmail(this.email);
		this.isPasswordValid = this.validateUserPassword(this.password);
		if (this.isNameValid && this.isEmailValid && this.isPasswordValid) {
			const newUser: ApplicationUser = {
				name: this.name,
				email: this.email,
				password: this.password,
				isConfirmed: false,
				provider: `self-registerd`,
				categories: []
			};
			this.userService.createSelfRegistredUser(newUser);
		} else {
			this.isSpinner = false;
		}
	}

	singUpExistedUser() {
		this.isSpinner = true;
		this.isEmailValid = this.validateUserEmail(this.email);
		this.isPasswordValid = this.validateUserPassword(this.password);
		if (this.isEmailValid && this.isPasswordValid) {
			const loginUser: LoginUser = {
				email: this.email,
				password: this.password
			};
			this.userService.loginSelfRegistredUser(loginUser);
		} else {
			this.isSpinner = false;
		}

	}

	validateUserName(name: string): boolean {
		const usernameRegexp = new RegExp('[0-9a-zA-Z]{3,30}');
		const isUsernameValid = usernameRegexp.test(name);
		if (!isUsernameValid) {
			this.isInvalidNameMessage = true;
		}

		return isUsernameValid;
	}

	validateUserEmail(email: string): boolean {
		const emailRegexp = new RegExp(
			'^([a-zA-Z0-9_\\-.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9-]+\\.)+))([a-zA-Z]{2,4}|[0-9' +
			']{1,3})(\\]?)$',
		);
		const isEmailValid = emailRegexp.test(email);
		if (!isEmailValid) {
			this.isInvalidEmailMessage = true;
		}

		return isEmailValid;
	}

	validateUserPassword(password: string): boolean {
		const passwordRegexp = new RegExp('[0-9a-zA-Z]{6,30}');
		const isPasswordValid = passwordRegexp.test(password);
		if (!isPasswordValid) {
			this.isInvalidPasswordMessage = true;
		}

		return isPasswordValid;
	}

	hideInvalidInputMessage(event) {
		const inputId = event.srcElement.id;
		switch (inputId) {
			case `name`:
				this.isInvalidNameMessage = false;
				break;
			case `email`:
				this.isInvalidEmailMessage = false;
				break;
			case `password`:
				this.isInvalidPasswordMessage = false;
				break;
		}
	}

	authoriseWithGoogle() {
		this.isSpinner = true;
		this.userService.authoriseWithGoogle();
	}

}
