import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
	selector: 'app-hello-monney',
	templateUrl: './hello-monney.component.html',
	styleUrls: ['./hello-monney.component.scss']
})
export class HelloMonneyComponent implements OnInit {
	isPageLoad: boolean;
	welcomeMessage: string = `Welcome to the monney-app !`;
	haveAccountMessage: string = `already have an account here ?`;

	private dbUserSubscription: Subscription;

	constructor(
		private router: Router,
		private dataService: DataService,
		private userService: UserService,
	) { }

	ngOnInit() {
		const token = localStorage.getItem("token");
		if (token) {
			this.dbUserSubscription = this.userService.getUserFromDB().subscribe(response => {
				console.log('--->  HELLO-MONNEY DB user ', response);
				if (response) {
					this.userService.appUser = response;
					this.router.navigate(['/home']);
				} else {
					this.isPageLoad = true;
					this.dataService.cleanLocalstorage();
				}
			});
		} else {
			this.isPageLoad = true;
		}
	}

	ngOnDestroy() {
		if (this.dbUserSubscription) {
			this.dbUserSubscription.unsubscribe();
		}
	}
}
