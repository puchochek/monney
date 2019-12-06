import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { LoggedUser } from '../interfaces';
import { DataService } from '../data.service';
import { environment } from '../../environments/environment';
import { UserService } from '../user.service';


@Component({
	selector: 'app-activate-user',
	templateUrl: './activate-user.component.html',
	styleUrls: ['./activate-user.component.scss']
})
export class ActivateUserComponent implements OnInit {
	constructor(
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
		private dataService: DataService,
		private userService: UserService
	) { }

	ngOnInit() {
		const token = this.route.snapshot.paramMap.get('token');
		this.activateUser(token);
	}

	activateUser(token: string) {
		this.http.post(`${environment.apiBaseUrl}/user/token`, {
			token: token,
		}).subscribe((response: LoggedUser) => {
			console.log('---> activateUser result ', response);
			if (response) {
				this.userService.appUser = response[0];
				this.dataService.updateToken(token);
				this.dataService.updateUserId(response.id);
				this.router.navigate(['/home']);
			} else {
				// TODO add error modal
			}
		});
	}
}
