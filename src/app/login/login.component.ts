import { Component, OnInit, Input, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from '../user.service';
import { ValidationService } from '../validation.service';
import { StorageService } from '../storage.service';
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
	isLoginForm: boolean;
	loginFormLbl: string;
	isEmailValid: boolean;
	isPasswordValid: boolean;
	isNameValid: boolean;
	isInvalidNameMessage: boolean;
	isInvalidEmailMessage: boolean;
	isInvalidPasswordMessage: boolean;
	currentAction: string;

	DEFAULT_SORT_CATEGORIES_ORDER = `date`;
	userNameLbl: string = `name`;
	userEmailLbl: string = `email`;
	userPasswordLbl: string = `password`;
	userResetPasswordLbl: string = `new password`;
	loginActionBtnLbl: string = `submit`;
	resetPasswordFormLbl: string = `reset password`;
	resetPasswordBtnLbl: string = `reset password`;
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
		private router: Router,
		private userService: UserService,
		private validationService: ValidationService,
		private storageService: StorageService,
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

		this.setCurrentAction();
		this.isLoginForm = this.currentAction === `reset` ? false : true;
		this.isNewUser = this.currentAction === `singin` ? true : false;
		this.loginFormLbl = this.isNewUser ? `sing in` : `sing up`;
	}

	ngOnDestroy() {
		if (this.selfRegistredUserSubscription) {
			this.selfRegistredUserSubscription.unsubscribe();
		}
	}

	setCurrentAction() {
		const curentUrl = this.router.url;
		const curentUrlSplited = curentUrl.split(`/`);
		const lastParamIndex = curentUrlSplited.length - 1;
		this.currentAction = curentUrlSplited[lastParamIndex];
	}

	showResetPasswordForm() {
		this.isLoginForm = false;
		this.currentAction = `reset`;
	}

	submitForm() {
		this.isSpinner = true;

		let userToHandle: ApplicationUser | LoginUser;

		if (this.isNewUser) {
			userToHandle = this.getNewUserData();
		} else {
			userToHandle = this.getExistedUserData();
		}

		if (Object.keys(userToHandle).length) {
			switch (this.currentAction) {
				case `singin`:
					this.userService.createSelfRegistredUser(<ApplicationUser>userToHandle);
					break;
				case `singup`:
					this.userService.loginSelfRegistredUser(<LoginUser>userToHandle);
					break;
				case `reset`:
					this.userService.resetPassword(<LoginUser>userToHandle)
						.then(
							response => { // Success
								console.log('---> res ', response);
								this.isSpinner = false;
								this.storageService.cleanStorage();
								const resetPasswordMessage: string = `Your password was successfully updated.
								Please, check your emeil to continue.`;
								this.openConfirmationDialog(resetPasswordMessage);
							},
							error => {
								console.log('---> err ', error);
								this.isSpinner = false;
								const resetPasswordMessage: string = `Oops! ${error.message}.`;
								this.openConfirmationDialog(resetPasswordMessage);
							}
						);
					break;
			}
		} else {
			this.isSpinner = false;
		}
	}

	getNewUserData(): ApplicationUser {
		let userToSave: ApplicationUser;

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
			userToSave = newUser;
		}

		return userToSave;
	}

	getExistedUserData(): LoginUser {
		let existedUser: LoginUser;

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
			existedUser = loginUser;
		}

		return existedUser;
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
				if (isActionConfirmed  && this.currentAction !== `reset`) {
					this.router.navigate(['/home']);
				}
			});
	}
}
