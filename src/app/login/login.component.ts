import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

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
	userNameLbl: string = `name`;
	userEmailLbl: string = `email`;
	userPasswordLbl: string = `password`;
	loginActionBtnLbl: string = `submit`;

	constructor(
		private route: ActivatedRoute,
		private router: Router
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
		
	
	}

}
