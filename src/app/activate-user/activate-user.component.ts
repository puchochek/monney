import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LoggedUser } from '../interfaces';
import { DataService } from '../data.service';

@Component({
	selector: 'app-activate-user',
	templateUrl: './activate-user.component.html',
	styleUrls: ['./activate-user.component.scss']
})
export class ActivateUserComponent implements OnInit {
	token = this.route.snapshot.paramMap.get('token');

	constructor(
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
		private dataService: DataService,
	) { }

	ngOnInit() {
		this.activateUser(this.token);
	}

	activateUser(token: string) {
		console.log('---> ActivateUserComponent activateUser token', token);
		//TODO catch error here

		this.http.post('http://localhost:3000/user/token', {
			token: token,
		}).subscribe((response: LoggedUser) => {
			console.log('---> activateUser result ', response);
			if (response) {
				this.dataService.updateToken(token);
				this.router.navigate(['/myprofile/' + response.id]);
				//this.updateActivatedUserToken(response);
			} else {
				// TODO add error modal
			}
		});
	}

	// updateActivatedUserToken(activatedUser: LoggedUser) {
	// 	this.http.get('http://localhost:3000/user/user-token/' + activatedUser.id, {responseType: 'text'}).subscribe((response: string) => {
	// 		console.log('---> updateActivatedUserToken result ', response);
	// 		if (response) {
	// 			const userData = {userId: activatedUser.id,  token: response}
	// 			this.saveDataToLocalStorage(userData);
	// 			this.router.navigate(['/myprofile/' + activatedUser.id]);
	// 		} else {
	// 			// TODO add error modal
	// 		}
	// 	});
	// }

	saveDataToLocalStorage(userData: any) {
		localStorage.setItem('token', userData.token);
		localStorage.setItem('userId', userData.userId);
	}

}
