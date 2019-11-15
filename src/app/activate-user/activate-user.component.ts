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
		this.http.post(`${environment.apiBaseUrl}/user/token`, {
			token: token,
		}).subscribe((response: LoggedUser) => {
			console.log('---> activateUser result ', response);
			if (response) {
				this.dataService.updateToken(token);
				this.createIncomeCategoryForNewUser(response.id);
				this.router.navigate(['/home']);
			} else {
				// TODO add error modal
			}
		});
	}

	createIncomeCategoryForNewUser(userId: string) {
		const requestUrl = `${environment.apiBaseUrl}/category/upsert`;
		const categoriesToUpsert = [{
			name: `income`,
			description: `Keeps your incomes data.`,
			user: userId,
			isActive: true,
			isIncome: true
		}];
		this.http.post(requestUrl, {
			categoriesToUpsert: categoriesToUpsert
		}, { observe: 'response' }
		).subscribe(
			response => {
				console.log('---> createIncomeCategoryForNewUser  response ', response);
			},
			error => {
				console.log('---> createIncomeCategoryForNewUser ', error);
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);


	}
}
