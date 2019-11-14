import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { LoggedUser } from '../interfaces';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	providers: []
})
export class HeaderComponent implements OnInit {

	public bgColor = "#8e8e8e";
	public color = "white";
	private sbscr: Subscription;

	userId: string;
	currentUser: LoggedUser;
	isAvatar: boolean;
	avatarSrc: string;
	avatarInitials: string = `AV`;
	avatarSize: string;
	currentDate: Date;

	headerMenuItems = [
		{ name: `View Profile`, action: this.goToProfile.bind(this) },
		{ name: `Log out`, action: this.logOut.bind(this) }
	];

	constructor(
		private dataService: DataService,
		private router: Router,
	) {}

	ngOnInit() {
		this.currentDate = new Date();
		this.userId = localStorage.getItem('userId');
		this.sbscr = this.dataService.loggedUser.subscribe((response) => {
			console.log('--->  HEADER FROM SERVICE loggedUser INIT', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.setAvatar();
			} else {
				this.router.navigate(['/hello-monney']);
			}
		});
	}

	ngOnDestroy() {
		this.sbscr.unsubscribe();
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
		this.router.navigate([`/myprofile/${this.userId}`]);
	}

	logOut() {
		this.router.navigate([`/hello-monney`]);
		this.dataService.cleanLocalstorage();
	}
}
