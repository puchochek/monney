import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { MatCardModule, MatButtonModule } from '@angular/material';
import { HttpClient } from '@angular/common/http';
// import { HttpService } from '../http.service';
import { environment } from '../../environments/environment'
import { LoggedUser } from '../interfaces';
import { ScreenService } from '../screen.service';


@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	providers: []
})
export class HeaderComponent implements OnInit {

	public bgColor = "#8e8e8e";
	public color = "white";


	navLinks = [];
	// todo set user id to localstorage
	isMobile: boolean;
	userId: string;
	currentUser: LoggedUser;
	isAvatar: boolean;
	avatarSrc: string;
	avatarInitials: string;
	avatarSize: string;


	//depricated
	// date: string;
	// dateShiftLeft = 0;
	// dateShiftRight = 0;
	// isToggled = false;

	constructor(
		private dataService: DataService,
		private router: Router,
		private http: HttpClient,
		private screenService: ScreenService,
	) {
		this.userId = localStorage.getItem('userId');
		const href = this.router.url;
		const headerLinks = [
			{ label: 'add expense', path: '/categories', isActive: false },
			{ label: 'balance', path: '/balance', isActive: false },
			{ label: 'profile', path: '/myprofile/' + this.userId, isActive: false },
		];
		this.navLinks = headerLinks;
		this.onHeaderItemClicked(href);
	}

	ngOnInit() {
		this.getLoggedUser();
		//TODO define mobile view dynamically
		this.isMobile = false;
		this.avatarSize = `small`;
		this.onResize();
		this.screenService.checkWidth();
	}

	onResize() {
		this.screenService.getMobileStatus().subscribe(isMobile => {
			this.isMobile = isMobile;
		});
		console.log('---> this.isMobile ', this.isMobile);
	}

	async getLoggedUser() {
		const userId = localStorage.getItem("userId");
		//const userId = `895ebe20-44a6-4302-a1c0-86d23bea5947`;
		const url = `${environment.apiBaseUrl}/user/user-by-id/${userId}`;
		if (userId) {
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						console.log('---> HEADER response ', response);
						this.setUserProfileParameters();
						this.dataService.setLoggedUser(this.currentUser);
						this.dataService.updateToken(response.headers.get('Authorization'));
					},
					error => {
						console.log('---> HEADER error ', error);
						//this.dataService.cleanLocalstorage();
						//this.router.navigate(['/hello-monney']);
						//   this.errors = error;
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	setUserProfileParameters() {
		console.log('---> HEADER CU IF', this.currentUser);
		console.log('---> HEADER ISMOB IF', this.isMobile);
		if (this.currentUser.avatar) {
			this.isAvatar = true;
			this.avatarSrc = this.currentUser.avatar;
		} else {
			this.avatarInitials = this.currentUser.name.split(` `).length > 1 ?
				this.currentUser.name.split(` `)[0].slice(0, 1) + this.currentUser.name.split(` `)[1].slice(0, 1)
				: this.currentUser.name.slice(0, 1);
		}
		console.log('---> this.avatarInitials ', this.avatarInitials);

	}

	onHeaderItemClicked(url: String) {
		const switchedHeaderOptions = this.navLinks.reduce((switchedHeaderOptions, headerOption, currentIndex, array) => {
			const isActive = headerOption.path.includes(url) ?
				true
				: false;
			switchedHeaderOptions.push({ label: headerOption.label, path: headerOption.path, isActive: isActive });
			return switchedHeaderOptions;
		}, []);
		this.navLinks = switchedHeaderOptions;
	}

}
