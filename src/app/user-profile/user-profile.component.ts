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
	menuOptions = [
		'profile settings',
		'manage categories',
		'create report'
	];

	constructor() { }

	ngOnInit() {
		this.menuClosedIcon = `arrow_forward_ios`;
		this.menuIconToDisplay = this.menuClosedIcon;
	}

	@HostListener('click') onClick() {		
		if (this.menuClosedIcon) {
			this.menuClosedIcon = undefined;
			this.menuOpenedIcon = `arrow_back_ios`;
			this.menuIconToDisplay = this.menuOpenedIcon;

		} else {
			this.menuOpenedIcon = undefined;
			this.menuClosedIcon = `arrow_forward_ios`;
			this.menuIconToDisplay = this.menuClosedIcon;
		}

	}



}
