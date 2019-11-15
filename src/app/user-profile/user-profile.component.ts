import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { DataService } from '../data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../environments/environment'


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

	currentUser: LoggedUser;
	avatarLabel = `Avatar`;
	themeLabel = `App theme`;
	userInfoLabel = `User Info`;
	currencyLabel = `Currency`;
	balanceLimitLabel = `Balance limit`;

	bgColor = "#8e8e8e";
	color = "white";

	avatarSrc: string;
	avatarInitials: string;

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
	) { }

	ngOnInit() {
		const userId = localStorage.getItem("userId");
		const url = `${environment.apiBaseUrl}/user/user-by-id/${userId}`;
		if (userId) {
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						console.log('---> USER PROFILE response ', response);
						this.setCurrentAvatar();
						this.dataService.updateToken(response.headers.get('Authorization'));
					},
					error => {
						console.log('---> USER PROFILE error ', error);
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	setCurrentAvatar() {
		if (this.currentUser.avatar) {
			this.avatarSrc = this.currentUser.avatar;
		} else {
			if (this.currentUser.name.split(` `)) {
				this.avatarInitials = this.currentUser.name.split(` `).length > 1 ?
					this.currentUser.name.split(` `)[0].slice(0, 1) + this.currentUser.name.split(` `)[1].slice(0, 1)
					: this.currentUser.name.slice(0, 1);
			}
		}
	}

	onFileChanged(event) {
		const file = event.target.files[0];
		console.log('---> file ', file );
	}


}
