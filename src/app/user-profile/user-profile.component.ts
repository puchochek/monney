import { Component, OnInit, Input, HostListener } from '@angular/core';
import { UserService } from '../user.service';
import { StorageService } from '../storage.service';
import { ValidationService } from '../validation.service';
import { ApplicationUser, StorageUser } from '../interfaces';
import { environment } from '../../environments/environment';
import { FileUploadModule } from "ng2-file-upload";
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	@Input() name: string;
	@Input() email: string;
	@Input() balanceLimit: number;
	key: any;
	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		this.key = event.key;
	}

	currentUser: ApplicationUser;
	avatarSrc: string;
	avatarInitials: string;
	isEmailInvalid: boolean;
	isBalanceLimitInvalid: boolean;
	isNameInvalid: boolean;
	invalidInputMessage: string;
	changeAvatarLbl: string = `change avatar`;
	userInfoLbl: string = `user info`;
	userAvatarLbl: string = `avatar`;
	userNameLbl: string = `name`;
	userEmailLbl: string = `email`;
	balanceLimitLbl: string = `balance limit`;
	balanceHelperText: string = `*You may set a balance edge to warn You if a balance is too low. By default it is set to 0.`;
	userInfoSubmitBtnLbl: string = `apply changes`;
	emailRegexp = '^([a-zA-Z0-9_\\-.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9-]+\\.)+))([a-zA-Z]{2,4}|[0-9' +
		']{1,3})(\\]?)$';
	usernameRegexp = '[0-9a-zA-Z]{3,30}';
	invalidNameMessage: string = `name has to contain at least 3 symbols`;
	invalidEmailMessage: string = `email has to contain @ symbol`;
	invalidBalanceLimitMessage: string = `balance limit may only contains a numeric values`;


	private userSubscription: Subscription;
	public uploader: FileUploader;

	constructor(
		private userService: UserService,
		private storageService: StorageService,
		private validationService: ValidationService,
		private router: Router,

	) { }

	ngOnInit() {
		this.manageUploader();
		this.userSubscription = this.userService._user.subscribe(response => {
			if (response) {
				this.currentUser = <ApplicationUser>response;
				console.log('---> user profile USER ', this.currentUser);
				this.setFormInitialValues();
			} else if (!this.currentUser && localStorage.getItem('token')) {
				this.userService.getUserByToken();
			}
		});
		if (!this.currentUser && !localStorage.getItem('storageUser') && localStorage.getItem('token')) {
			this.userService.getUserByToken();
		}
		if (!this.currentUser && !localStorage.getItem('storageUser') && !localStorage.getItem('token')) {
			this.router.navigate([`/home`]);
		}
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	manageUploader() {
		const token = localStorage.getItem('token');
		const UPL_URL = `${environment.apiBaseUrl}/user/avatar`;
		this.uploader = new FileUploader({ url: UPL_URL, itemAlias: 'avatar', headers: [{ name: 'Authorization', value: `${token}` }] });
		this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			const imageInfo = JSON.parse(response);
			if (imageInfo.secure_url) {
				this.avatarSrc = imageInfo.secure_url;
			};
		}
	}

	setFormInitialValues() {
		if (this.currentUser.avatar) {
			this.avatarSrc = this.currentUser.avatar;
		} else {
			this.avatarInitials = this.currentUser.name.substring(0, 2);
		}
		this.name = this.currentUser.name;
		this.email = this.currentUser.email;
		this.balanceLimit = this.currentUser.balanceEdge || 0;
	}

	onFileSelected() {
		this.uploader.uploadAll();
	}

	hideInvalidInputMessage(event) {
		console.log('hideInvalidInputMessage')
		this.isEmailInvalid = false;
		this.isBalanceLimitInvalid = false;
		this.isNameInvalid = false;
	}

	submitForm() {
		const isNameValid = this.validationService.validateStringInput(this.usernameRegexp, this.name);
		if (!isNameValid) {
			this.isNameInvalid = true;
		}
		const isEmailValid = this.validationService.validateStringInput(this.emailRegexp, this.email);
		if (!isEmailValid) {
			this.isEmailInvalid = true;
		}
		const isBalanceLimitValid = this.validationService.validateNumberInput(String(this.balanceLimit));
		if (!isBalanceLimitValid) {
			this.isBalanceLimitInvalid = true;
		}
		if (isNameValid && isEmailValid && isBalanceLimitValid) {
			const isUserInfoChanged = this.compareUserInfo();
			if (isUserInfoChanged) {
				const userToUpdate: ApplicationUser = { ...this.currentUser };
				userToUpdate.avatar = this.avatarSrc;
				userToUpdate.name = this.name;
				userToUpdate.email = this.email;
				userToUpdate.balanceEdge = this.balanceLimit;
				this.userService.updateUser(userToUpdate);
			}
		}
	}

	compareUserInfo(): boolean {
		const existedAvatar = this.currentUser.avatar;
		const existedUserName = this.currentUser.name;
		const existedUserEmail = this.currentUser.email;
		const existedUserBalanceLimit = this.currentUser.balanceEdge;

		return existedAvatar !== this.avatarSrc ||
			existedUserName !== this.name ||
			existedUserEmail !== this.email ||
			existedUserBalanceLimit !== this.balanceLimit ?
			true
			: false;
	}
}

