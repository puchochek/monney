import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { LoggedUser } from '../interfaces';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../user.service';

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
	isMenuAvailable: boolean;

	headerMenuItems = [
		{ name: `User info`, action: this.goToProfile.bind(this) },
		{ name: `Log out`, action: this.logOut.bind(this) }
	];

	constructor(
		private dataService: DataService,
		private router: Router,
		private http: HttpClient,
		public userServise: UserService
	) { }

	ngOnInit() {
		this.currentDate = new Date();
		this.userId = localStorage.getItem('userId');
		this.sbscr = this.userServise._user.subscribe((response) => {
			console.log('--->  HEADER userServise INIT', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.isMenuAvailable = true;
				this.setAvatar();
			} else {
				this.doUserControllerCall();
			}
		});
	}

	ngOnDestroy() {
		this.sbscr.unsubscribe();
	}

	doUserControllerCall() {
		const token = localStorage.getItem("token");
		if (token) {
			const tokenisedId = localStorage.getItem("token").split(" ")[1];
			const url = `${environment.apiBaseUrl}/user/user-by-token/${tokenisedId}`;
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						this.isMenuAvailable = true;
						this.setAvatar();
					},
					error => {
						console.log('---> HEADER error ', error);
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
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
		this.router.navigate([`/myprofile/${this.currentUser.name}`]);
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
	}
}
