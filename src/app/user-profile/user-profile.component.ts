import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
//import {MatExpansionModule,MatIconModule} from '@angular/material';
// import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from '@angular/material';
// import { MatDividerModule } from '@angular/material/divider';
// import { ProfileManageCategoriesComponent } from '../profile-manage-categories/profile-manage-categories.component';


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
	) {}

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
			console.log('---> response[0] ', response[0]);
			console.log('---> this.currentUser ', this.currentUser);
      //this.setExpensesByCategory(response);
    });
		// const initialMenuOptions = [
		// 	{ value: 'profile settings', isActive: true },
		// 	{ value: 'manage categories', isActive: false },
		// 	{ value: 'create report', isActive: false }
		// ];
		// this.menuOptions = initialMenuOptions;
		// this.menuClosedIcon = `arrow_back_ios`;
		// this.menuIconToDisplay = this.menuClosedIcon;

		// this.profileSettings = true;
		// this.manageCategories = false;
		// this.createReport = false;
	}

	// onOpenedChange(e: boolean) {
	// 	if (this.menuClosedIcon) {
	// 		this.menuClosedIcon = undefined;
	// 		this.menuOpenedIcon = `arrow_forward_ios`;
	// 		this.menuIconToDisplay = this.menuOpenedIcon;

	// 	} else {
	// 		this.menuOpenedIcon = undefined;
	// 		this.menuClosedIcon = `arrow_back_ios`;
	// 		this.menuIconToDisplay = this.menuClosedIcon;
	// 	}
	// }

	// onMenuItemClicked(event) {
	// 	const target = event.target || event.srcElement || event.currentTarget;
	// 	const idAttr = target.attributes.id;
	// 	const selectedOptionId = idAttr.nodeValue;
	// 	const switchedMenuOptions = this.menuOptions.reduce((switchedMenuOptions, menuOption, currentIndex, array) => {
	// 		const isActive = currentIndex === Number(selectedOptionId) ?
	// 			true
	// 			: false;
	// 		switchedMenuOptions.push({ value: menuOption.value, isActive: isActive });
	// 		return switchedMenuOptions;
	// 	}, []);

	// 	switch (selectedOptionId) {
	// 		case `0`: {
	// 			this.profileSettings = true;
	// 			this.manageCategories = false;
	// 			this.createReport = false;
	// 			break;
	// 		}
	// 		case `1`: {
	// 			//this.setInputFields();
	// 			this.profileSettings = false;
	// 			this.manageCategories = true;
	// 			this.createReport = false;
	// 			break;
	// 		}
	// 		case `2`: {
	// 			this.profileSettings = false;
	// 			this.manageCategories = false;
	// 			this.createReport = true;
	// 			break;
	// 		}
	// 	}
	// 	this.menuOptions = switchedMenuOptions;
	// }

	// setInputFields() {
	// 	this.inputFields = [
	// 		{placeholder: 'Category', value: ''},
	// 		{placeholder: 'Another test field', value: ''},
	// 	];

	// }


	//TODO cant track exact target from here
	// @HostListener('click') onClick() {		

	// 	if (this.menuClosedIcon) {
	// 		this.menuClosedIcon = undefined;
	// 		this.menuOpenedIcon = `arrow_back_ios`;
	// 		this.menuIconToDisplay = this.menuOpenedIcon;

	// 	} else {
	// 		this.menuOpenedIcon = undefined;
	// 		this.menuClosedIcon = `arrow_forward_ios`;
	// 		this.menuIconToDisplay = this.menuClosedIcon;
	// 	}

	// }



}
