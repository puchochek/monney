import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { MatCardModule, MatButtonModule, throwToolbarMixedModesError } from '@angular/material';
import { HttpClient } from '@angular/common/http';
// import { HttpService } from '../http.service';
import { environment } from '../../environments/environment'
import { LoggedUser } from '../interfaces';
import { ScreenService } from '../screen.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	currentUser: LoggedUser;
	incomeId: string;

	constructor(
		private dataService: DataService,
		private router: Router,
		private http: HttpClient,
		private screenService: ScreenService,
	) { }

	ngOnInit() {
		const userId = localStorage.getItem("userId");
		const url = `${environment.apiBaseUrl}/user/user-by-id/${userId}`;
		if (userId) {
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						console.log('---> HOME response ', response);
						this.setIncomeId();
						this.dataService.setLoggedUser(this.currentUser);
						this.dataService.updateToken(response.headers.get('Authorization'));
					},
					error => {
						console.log('---> HOME error ', error);
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	setIncomeId() {
		this.incomeId = [...this.currentUser.categories].filter(category => category.isIncome)[0].id;
		console.log('---> this.incomeId ', this.incomeId);
	}

}
