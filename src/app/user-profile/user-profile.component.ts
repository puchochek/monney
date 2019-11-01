import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { DataService } from '../data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProfileManageCategoriesComponent } from '../profile-manage-categories/profile-manage-categories.component';


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
	) { }

	ngOnInit() {
		this.settingsTabLabel = `Settings`;
		this.categoriesTabLabel = `Categories`;
		this.settingsToolTip = `Define your Profile settings here`;
		this.categoriesToolTip = `Set end manage your transactions categories here`;

		const userId = localStorage.getItem('userId');
		const url = `http://localhost:3000/user/user-by-id/${userId}`;

		this.http.get(url, { observe: 'response' })
			.subscribe(
				response => {
					this.currentUser = <LoggedUser>response.body;
					console.log('---> UserProfileComponent response ', response);
					console.log('---> UserProfileComponent resp.headers.authorization ', response.headers.get('Authorization'));
					this.dataService.updateToken(response.headers.get('Authorization'));
				},
				error => {
					console.log('---> UserProfileComponent error ', error);
					//this.dataService.cleanLocalstorage();
					this.router.navigate(['/hello-monney']);

					//   this.errors = error;
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);




		// .subscribe(response => {
		// 	this.currentUser = <LoggedUser>response.body;
		// 	console.log('---> resp ', response);
		// 	console.log('---> resp.headers.authorization ', response.headers.get('Authorization'));
		// });

	}

	logout() {
		this.router.navigate(['/hello-monney']);
		this.dataService.cleanLocalstorage();
	}

}
