import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CategoryService } from '../category.service';
import { Subscription } from 'rxjs';
import { ApplicationUser, Category } from '../interfaces';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	currentUser: ApplicationUser;
	// isSpinner: boolean;
	incomesLbl: string = `incomes`;
	reportsLbl: string = `reports`;
	categoryName: string = `Income`;
	homeMessage: string = `Hello and welcome to Monney - a simple app to track and keep your expences in order.
	If You still dont have an account here - You may start from singing in. Otherwise - sing up and enjoy.`
	private userSubscription: Subscription;
	private categorySubscription: Subscription;

	constructor(
		private userService: UserService,
		private categoryService: CategoryService,
		private router: Router,
	) {
		this.userService.getUserByToken();
	}

	ngOnInit() {
		// this.isSpinner = true;
		this.userSubscription = this.userService._user.subscribe(response => {
			// this.isSpinner = true;
			console.log('---> HOME _user ', response);
			if (response) {
				this.currentUser = response;
				this.categoryService.checkIncomeCategory(this.currentUser);
			}
			// this.isSpinner = false;
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

	addIncome(event) {

		this.router.navigate([`/${this.categoryName}/add`]);
	}

	viewIncomesList(event) {

		this.router.navigate([`/${this.categoryName}/transactions`]);
	}

	buildChart(event) {

	}

}
