import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from '../user.service';
import { ApplicationUser } from '../interfaces';

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
		this.isNameValid = this.validateUserName(this.name);
		this.isEmailValid = this.validateUserEmail(this.email);
		this.isPasswordValid = this.validateUserPassword(this.password);
		if (this.isNameValid && this.isEmailValid && this.isPasswordValid) {
			const newUser: ApplicationUser = {
				name: this.name,
				email: this.email,
				password: this.password,
				isConfirmed: false,
				provider: `self-registerd`
			};
			this.userService.createSelfRegistredUser(newUser);
		}
	}

	validateUserName(name: string): boolean {
		const usernameRegexp = new RegExp('[0-9a-zA-Z]{3,30}');
		const isUsernameValid = usernameRegexp.test(name);
		console.log('---> isUsernameValid ', isUsernameValid);
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
		console.log('---> isEmailValid ', isEmailValid);
		if (!isEmailValid) {
			this.isInvalidEmailMessage = true;
		}

		return isEmailValid;
	}

	validateUserPassword(password: string): boolean {
		const passwordRegexp = new RegExp('[0-9a-zA-Z]{6,30}');
		const isPasswordValid = passwordRegexp.test(password);
		console.log('---> isPasswordValid ', isPasswordValid);
		if (!isPasswordValid) {
			this.isInvalidPasswordMessage = true;
		}
		return isPasswordValid;
	}

	hideInvalidInputMessage(event) {
		const inputId = event.srcElement.id;
		console.log('---> i ', inputId);
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
		this.userService.authoriseWithGoogle();
	}

}
