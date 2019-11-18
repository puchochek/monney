import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LoggedUser } from '../interfaces';
import { DataService } from '../data.service';
import { environment } from '../../environments/environment'

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
		console.log('---> activate user token', token);
		this.http.post(`${environment.apiBaseUrl}/user/token`, {
			token: token,
		}).subscribe((response: LoggedUser) => {
			console.log('---> activateUser result ', response);
			if (response) {
				this.dataService.updateToken(token);
				this.dataService.updateUserId(response.id);
				this.router.navigate(['/home']);
			} else {
				// TODO add error modal
			}
		});
	}
}
