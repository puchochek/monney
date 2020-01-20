import { Component, OnInit, Input, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from '../user.service';
import { ValidationService } from '../validation.service';
import { ApplicationUser } from '../interfaces';
import { LoginUser } from '../interfaces';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';


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
	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		this.key = event.key;
	}
	@ViewChild("userName", { static: false }) _elName: ElementRef;
	@ViewChild("userEmail", { static: false }) _elEmail: ElementRef;

	isSpinner: boolean;
	isNewUser: boolean;
	loginFormLbl: string;
	isEmailValid: boolean;
	isPasswordValid: boolean;
	isNameValid: boolean;
	isInvalidNameMessage: boolean;
	isInvalidEmailMessage: boolean;
	isInvalidPasswordMessage: boolean;

	DEFAULT_SORT_CATEGORIES_ORDER = `date`;
	userNameLbl: string = `name`;
	userEmailLbl: string = `email`;
	userPasswordLbl: string = `password`;
	loginActionBtnLbl: string = `submit`;
	forgotPasswordLbl: string = `I forgot my password`;
	googleAuthLbl: string = `or authorize with google`;
	invalidNameMessage: string = `name has to contain at least 3 symbols`;
	invalidEmailMessage: string = `email has to contain @ symbol`;
	invalidPasswordMessage: string = `password has to contain 1 uppercase letter and 1 non-letter character at least`;
	successLoginMessage: string = `Congratulations! You were succesfully logged in the Monney-app. Please, check your email to continue`;
	failLoginMessage: string = `Login failed. `;
	emailRegexp = /\S+@\S+/;
	usernameRegexp = /[0-9a-zA-Z]{3,30}/;
	passwordRegexp = /[0-9a-zA-Z]{6,30}/;

	private selfRegistredUserSubscription: Subscription;
	confirmationDialogRef: MatDialogRef<ConfirmationModalComponent>;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userService: UserService,
		private validationService: ValidationService,
		private dialog: MatDialog,
	) { }

	ngAfterViewInit() {
		if (this._elName) {
			this._elName.nativeElement.focus();
		} else {
			this._elEmail.nativeElement.focus();
		}
	}

	ngOnInit() {
		this.selfRegistredUserSubscription = this.userService._selfRegistredUserStatus.subscribe(response => {
			if (response) {
				if (response === `success`) {
					this.openConfirmationDialog(this.successLoginMessage);
				} else if (response.includes(`error`)) {
					this.openConfirmationDialog(this.failLoginMessage + response);
				}
			}
		});

		this.isNewUser = this.checkIfNewUser();
		this.loginFormLbl = this.isNewUser ? `sing in` : `sing up`;
	}

	ngOnDestroy() {
		if (this.selfRegistredUserSubscription) {
			this.selfRegistredUserSubscription.unsubscribe();
		}
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

		this.isNameValid = this.validationService.validateStringInput(this.usernameRegexp, this.name);
		if (!this.isNameValid) {
			this.isInvalidNameMessage = true;
		}
		this.isEmailValid = this.validationService.validateStringInput(this.emailRegexp, this.email);
		if (!this.isEmailValid) {
			this.isInvalidEmailMessage = true;
		}
		this.isPasswordValid = this.validationService.validateStringInput(this.passwordRegexp, this.password);
		if (!this.isPasswordValid) {
			this.isInvalidPasswordMessage = true;
		}
		if (this.isNameValid && this.isEmailValid && this.isPasswordValid) {
			const newUser: ApplicationUser = {
				name: this.name,
				email: this.email,
				password: this.password,
				isConfirmed: false,
				provider: `self-registerd`,
				balanceEdge: 0,
				sortCategoriesBy: this.DEFAULT_SORT_CATEGORIES_ORDER,
				categories: [],
				transactions: []
			};
			this.userService.createSelfRegistredUser(newUser);
		} else {
			this.isSpinner = false;
		}
	}

	singUpExistedUser() {
		this.isSpinner = true;

		this.isEmailValid = this.validationService.validateStringInput(this.emailRegexp, this.email);
		if (!this.isEmailValid) {
			this.isInvalidEmailMessage = true;
		}
		this.isPasswordValid = this.validationService.validateStringInput(this.passwordRegexp, this.password);
		if (!this.isPasswordValid) {
			this.isInvalidPasswordMessage = true;
		}
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

	openConfirmationDialog(message: string) {
		this.confirmationDialogRef = this.dialog.open(ConfirmationModalComponent, {
			data: {
				message: message
			}
		});
		this.confirmationDialogRef
			.afterClosed()
			.subscribe(isActionConfirmed => {
				if (isActionConfirmed) {
					this.router.navigate(['/home']);
				}
			});
	}

}
