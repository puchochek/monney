import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CategoryService } from '../category.service';
import { Subscription } from 'rxjs';
import { ApplicationUser, Category } from '../interfaces';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	currentUser: ApplicationUser;
	private userSubscription: Subscription;
	private categorySubscription: Subscription;

	constructor(
		private userService: UserService,
		private categoryService: CategoryService
	) {
		this.userService.getUser();
	}

	ngOnInit() {
		this.userSubscription = this.userService._user.subscribe(response => {
			console.log('---> HOME _user ', response);
			if (response) {
				this.currentUser = response;
				this.categoryService.checkIncomeCategory(this.currentUser);
			}
		});
		this.categorySubscription = this.categoryService._category.subscribe(response => {
			console.log('---> HOME _category ', response);
			if (response) {
				this.userService.updateUserCategories(<Category>response, this.currentUser);
			}
		});
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
		if (this.categorySubscription) {
			this.categorySubscription.unsubscribe();
		}
	}

}
