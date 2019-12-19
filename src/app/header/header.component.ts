import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { LoggedUser } from '../interfaces';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ThemeService } from '../theme.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	providers: []
})
export class HeaderComponent implements OnInit {

	public bgColor = "#8e8e8e";
	public color = "white";
	private subscription: Subscription;

	currentUser: LoggedUser;
	isAvatar: boolean;
	avatarSrc: string;
	avatarInitials: string = `AV`;
	avatarSize: string;
	currentDate: Date;
	isMenuAvailable: boolean;

	headerMenuItems = [
		{ name: `User info`, action: this.goToProfile.bind(this) },
		{ name: `Log out`, action: this.logOut.bind(this) }
	];

	constructor(
		private dataService: DataService,
		private router: Router,
		private userService: UserService,
		private themeService: ThemeService,
	) { }

	ngOnInit() {
		this.currentDate = new Date();
		this.subscription = this.userService._user.subscribe((response) => {
			console.log('--->  HEADER _user ', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.isMenuAvailable = true;
				this.setAvatar();
			 }
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	setAvatar() {
		if (this.currentUser.avatar) {
			this.isAvatar = true;
			this.avatarSrc = this.currentUser.avatar;
		} else {
			if (this.currentUser.name.split(` `)) {
				this.avatarInitials = this.currentUser.name.split(` `).length > 1 ?
					this.currentUser.name.split(` `)[0].slice(0, 1) + this.currentUser.name.split(` `)[1].slice(0, 1)
					: this.currentUser.name.slice(0, 1);
			}
		}
	}

	goToProfile() {
		this.router.navigate([`/myprofile`]);
	}

	goHome() {
		this.router.navigate([`/home`]);
	}

	logOut() {
		this.router.navigate([`/hello-monney`]);
		this.dataService.cleanLocalstorage();
		this.isAvatar = false;
		this.avatarInitials = `AV`;
		this.isMenuAvailable = false;
		localStorage.setItem("userTheme", this.themeService.DEFAULT_THEME);
		this.themeService.appTheme = this.themeService.DEFAULT_THEME;

	}
}
