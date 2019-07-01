import { Component, OnInit, HostListener } from '@angular/core';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from '@angular/material';
import { MatDividerModule } from '@angular/material/divider';


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
	menuOpenedIcon: string;
	menuClosedIcon: string;
	menuIconToDisplay: string;
	menuOptions = [];

	constructor() { }

	ngOnInit() {
		const initialMenuOptions = [
			{ value: 'profile settings', isActive: true },
			{ value: 'manage categories', isActive: false },
			{ value: 'create report', isActive: false }
		];
		this.menuOptions = initialMenuOptions;
		this.menuClosedIcon = `arrow_back_ios`;
		this.menuIconToDisplay = this.menuClosedIcon;
	}

	onOpenedChange(e: boolean) {
		if (this.menuClosedIcon) {
			this.menuClosedIcon = undefined;
			this.menuOpenedIcon = `arrow_forward_ios`;
			this.menuIconToDisplay = this.menuOpenedIcon;

		} else {
			this.menuOpenedIcon = undefined;
			this.menuClosedIcon = `arrow_back_ios`;
			this.menuIconToDisplay = this.menuClosedIcon;
		}
	}

	onMenuItemClicked(event) {
		const target = event.target || event.srcElement || event.currentTarget;
		const idAttr = target.attributes.id;
		const selectedOptionId = idAttr.nodeValue;		
		const switchedMenuOptions = this.menuOptions.reduce((switchedMenuOptions, menuOption, currentIndex, array) => {			
			const isActive = currentIndex === Number(selectedOptionId) ?
				true
				: false;
			switchedMenuOptions.push({value: menuOption.value, isActive: isActive});
			return switchedMenuOptions;
		}, []);		
		this.menuOptions = switchedMenuOptions;
	}


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
