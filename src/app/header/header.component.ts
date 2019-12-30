import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { StorageService } from '../storage.service';
import { Subscription } from 'rxjs';
import { ApplicationUser } from '../interfaces';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	private userSubscription: Subscription;
	private DEFAULT_AVATAR_SRC = `https://res.cloudinary.com/dsiwkaugw/image/upload/v1577453294/iconfinder_Unicorn_y15fli.png`;

	monneyLogoLbl: string = `monney`;
	singInLbl: string = `sing in`;
	singUpLbl: string = `sing up`;
	isUserAuthorised: boolean;
	headerMenuItems = [
		{ name: `User info`, action: this.goToProfile.bind(this) },
		{ name: `Log out`, action: this.logOut.bind(this) }
	];
	avatarSrc: string;
	avatarInitials: string;
	currentUser: ApplicationUser;

	constructor(
		private userService: UserService,
		private storageService: StorageService
	) { }

	ngOnInit() {
		this.userSubscription = this.userService._user.subscribe(response => {
			console.log('---> HEADER _user ', response);
			if (response) {
				this.currentUser = response;
				this.isUserAuthorised = true;
				if (this.currentUser.avatar) {
					this.avatarSrc = this.currentUser.avatar;
				} else {
					this.avatarSrc = this.DEFAULT_AVATAR_SRC;
				}
			}
		});
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	goToProfile() {
		//this.router.navigate([`/myprofile/${this.userId}`]);
	}

	logOut() {
		this.storageService.cleanStorage();
		this.isUserAuthorised = false;
		this.userService.appUser = null;
	}
}
