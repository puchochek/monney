import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
//import {MatExpansionModule,MatIconModule} from '@angular/material';
// import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from '@angular/material';
// import { MatDividerModule } from '@angular/material/divider';
import { ProfileManageCategoriesComponent } from '../profile-manage-categories/profile-manage-categories.component';


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

	currentUser: LoggedUser[];
	settingsToolTip: string;
	categoriesToolTip: string;
	reportsToolTip: string;
	settingsTabLabel: string;
	categoriesTabLabel: string;
	reportsTabLabel: string;

	// menuOpenedIcon: string;
	// menuClosedIcon: string;
	// menuIconToDisplay: string;
	// profileSettings: boolean;
	// manageCategories: boolean;
	// createReport: boolean;
	// menuOptions = [];
	// inputFields = [];

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
		console.log('---> userId PROF ', userId);
		this.http.get('http://localhost:3000/user/' + userId).subscribe((response: LoggedUser[]) => {
			console.log('---> response ', response);
			this.currentUser = response;
			//this.setExpensesByCategory(response);
		});

	}

}
