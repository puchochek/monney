import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';

@Component({
	selector: 'app-profile-manage-categories',
	templateUrl: './profile-manage-categories.component.html',
	styleUrls: ['./profile-manage-categories.component.scss']
})
export class ProfileManageCategoriesComponent implements OnInit {
	@Input() appUser: LoggedUser;
	constructor(
		private http: HttpClient
	) {}

	ngOnInit() {
		console.log('---> appUser ', this.appUser );
	// 	const userId = localStorage.getItem('userId');
	// 	console.log('---> userId ', userId);
	// 	this.http.get('http://localhost:3000/user/' + userId).subscribe((response: LoggedUser[]) => {
	// 		console.log('---> response ', response);
    //   //this.setExpensesByCategory(response);
    // });
	}

}
