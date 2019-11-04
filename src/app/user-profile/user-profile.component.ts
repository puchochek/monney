import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { DataService } from '../data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProfileManageCategoriesComponent } from '../profile-manage-categories/profile-manage-categories.component';
import { environment } from '../../environments/environment'


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

	currentUser: LoggedUser;
	settingsToolTip: string;
	categoriesToolTip: string;
	settingsTabLabel: string;
	categoriesTabLabel: string;

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
	) {
		// this.dataService.loggedUser.subscribe((data) => {
		// 	console.log('--->  USER FROM SERVICE loggedUser ', data);

		// }
		// );

	}

	ngOnInit() {
		this.settingsTabLabel = `Settings`;
		this.categoriesTabLabel = `Categories`;
		this.settingsToolTip = `Define your Profile settings here`;
		this.categoriesToolTip = `Set end manage your transactions categories here`;
		this.dataService.loggedUser.subscribe((response) => {
			console.log('--->  USER FROM SERVICE loggedUser INIT', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
			} else {
				this.router.navigate(['/hello-monney']);
			}

		});

		// const userId = localStorage.getItem('userId');
		// const url = `${environment.apiBaseUrl}/user/user-by-id/${userId}`;

		// this.http.get(url, { observe: 'response' })
		// 	.subscribe(
		// 		response => {
		// 			this.currentUser = <LoggedUser>response.body;
		// 			console.log('---> UserProfileComponent response ', response);
		// 			console.log('---> UserProfileComponent resp.headers.authorization ', response.headers.get('Authorization'));
		// 			this.dataService.updateToken(response.headers.get('Authorization'));
		// 		},
		// 		error => {
		// 			console.log('---> UserProfileComponent error ', error);
		// 			//this.dataService.cleanLocalstorage();
		// 			this.router.navigate(['/hello-monney']);

		// 			//   this.errors = error;
		// 		},
		// 		() => {
		// 			// 'onCompleted' callback.
		// 			// No errors, route to new page here
		// 		}
		// 	);

	}

	logout() {
		this.router.navigate(['/hello-monney']);
		this.dataService.cleanLocalstorage();
	}

}
