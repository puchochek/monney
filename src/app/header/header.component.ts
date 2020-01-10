import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { StorageService } from '../storage.service';
import { Subscription } from 'rxjs';
import { ApplicationUser, StorageUser } from '../interfaces';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	DEFAULT_AVATAR_SRC = `https://res.cloudinary.com/dsiwkaugw/image/upload/v1578037420/no-avatar-user-transparent_ynbo0u.png`;
	monneyLogoLbl: string = `monney`;
	singInLbl: string = `sing in`;
	singUpLbl: string = `sing up`;
	headerMenuItems = [
		{ name: `User info`, action: this.goToProfile.bind(this) },
		{ name: `Log out`, action: this.logOut.bind(this) }
	];

	avatarSrc: string;
	avatarInitials: string;
	currentUser: ApplicationUser;
	isUserAuthorised: boolean;

	private userSubscription: Subscription;

	constructor(
		private userService: UserService,
		private storageService: StorageService,
		private router: Router,
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
		if (!this.currentUser && localStorage.getItem('storageUser')) {
			const currentStorageUser = JSON.parse(localStorage.getItem('storageUser'));
			this.isUserAuthorised = true;
			if (currentStorageUser.avatar) {
				this.avatarSrc = this.currentUser.avatar;
			} else {
				this.avatarSrc = this.DEFAULT_AVATAR_SRC;
			}
		}
		if (!this.currentUser && !localStorage.getItem('storageUser') && localStorage.getItem('token')) {
			this.userService.getUserByToken();
		}
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	goToProfile() {
		this.router.navigate([`/user`]);
	}

	logOut() {
		this.storageService.cleanStorage();
		this.isUserAuthorised = false;
		this.userService.appUser = null;
	}
}
