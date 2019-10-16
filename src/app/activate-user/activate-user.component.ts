import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LoggedUser } from '../interfaces';

@Component({
	selector: 'app-activate-user',
	templateUrl: './activate-user.component.html',
	styleUrls: ['./activate-user.component.scss']
})
export class ActivateUserComponent implements OnInit {
	token = this.route.snapshot.paramMap.get('token');
	status: string;

	constructor(
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
	) { }

	ngOnInit() {
		this.activateUser(this.token);
	}

	activateUser(token: string) {
		this.http.post('http://localhost:3000/user/token', {
			token: token,
		}).subscribe((response: LoggedUser) => {
			console.log('---> result ', response);
			if (response) {
				this.router.navigate(['/myprofile/' + response.id]);
				this.saveDataToLocalStorage(response);
				//this.status = 'success';
			} else {
				// TODO add error modal
			}
		});
	}

	saveDataToLocalStorage(response) {
		localStorage.setItem('token', this.token);
		localStorage.setItem('userId', response.id);
	}

}
