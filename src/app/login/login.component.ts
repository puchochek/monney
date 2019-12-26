import { Component, OnInit, Input } from '@angular/core';
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

	isNewUser: boolean;
	loginFormLbl: string;
	isEmailValid: boolean;
	isPasswordValid: boolean;
	isNameValid: boolean;

	userNameLbl: string = `name`;
	userEmailLbl: string = `email`;
	userPasswordLbl: string = `password`;
	loginActionBtnLbl: string = `submit`;
	forgotPasswordLbl: string = `I forgot my password`;
	googleAuthLbl: string = `or sing in with google`;

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
		console.log('---> ', this.name);
		console.log('---> ', this.email);
		console.log('---> ', this.password);
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

		return true; //HARDCODED FOR NOW; have to return isUsernameValid;
	}

	validateUserEmail(email: string): boolean {
		const emailRegexp = new RegExp(
			'^([a-zA-Z0-9_\\-.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9-]+\\.)+))([a-zA-Z]{2,4}|[0-9' +
			']{1,3})(\\]?)$',
		);
		const isEmailValid = emailRegexp.test(email);

		return true; //HARDCODED FOR NOW; have to return isEmailValid
	}

	validateUserPassword(password: string): boolean {
		const passwordRegexp = new RegExp('[0-9a-zA-Z]{6,30}');
		const isPasswordValid = passwordRegexp.test(password);

		return true; //HARDCODED FOR NOW; have to return isPasswordValid
	}

	authoriseWithGoogle() {
		this.userService.authoriseWithGoogle();
	}

}
