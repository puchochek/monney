import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
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
	reportsToolTip: string;
	settingsTabLabel: string;
	categoriesTabLabel: string;
	reportsTabLabel: string;

	constructor(
		private http: HttpClient
	) { }

	ngOnInit() {
		this.settingsTabLabel = `Settings`;
		this.categoriesTabLabel = `Categories`;
		this.reportsTabLabel = `Reports`;
		this.settingsToolTip = `Define your Profile settings here`;
		this.categoriesToolTip = `Set end manage your transactions categories here`;
		this.reportsToolTip = `Configure and view your transactions reports here`;

		const userId = localStorage.getItem('userId');

		console.log('---> UserProfileComponent userId ', userId);

		const url = `http://localhost:3000/user/user-by-id/${userId}`;

		this.http.get(url, { observe: 'response' })
			.subscribe(response => {
				this.currentUser = <LoggedUser>response.body;
				console.log('---> resp ', response);
				console.log('---> resp.body ', response.body);
				console.log('---> resp.headers ', response.headers);
				console.log('---> resp.headers.authorization ', response.headers.get('Authorization'));
			});

	}

}
