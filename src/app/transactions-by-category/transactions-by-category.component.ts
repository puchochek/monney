import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TransactionService } from '../transaction.service';
import { UserService } from '../user.service';
import { CategoryService } from '../category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Transaction, ApplicationUser, Category, DatePickerSetup } from '../interfaces';

@Component({
	selector: 'app-transactions-by-category',
	templateUrl: './transactions-by-category.component.html',
	styleUrls: ['./transactions-by-category.component.scss']
})
export class TransactionsByCategoryComponent implements OnInit {

	transactions: Transaction[];
	currentUser: ApplicationUser;
	categoryName: string;
	categoryDescription: string;
	currentCategory: Category;

	private userSubscription: Subscription;

	fromDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
	toDate: Date = new Date();
	transactionsHeaders : string[] = [`date`, `comment`, `sum`, `actions`];
	fromDatePickerSetup: DatePickerSetup = {
		placeholder: `from`,
		isFromDate: true,
		isToDate: false
	};

	toDatePickerSetup: DatePickerSetup = {
		placeholder: `to`,
		isFromDate: false,
		isToDate: true
	};

	constructor(
		private transactionService: TransactionService,
		private categoryService: CategoryService,
		private userService: UserService,
		private route: ActivatedRoute,

	) {
		this.userService.getUserByToken();
	}

	ngOnInit() {
		this.categoryName = this.route.snapshot.paramMap.get('category');

		this.userSubscription = this.userService._user.subscribe(response => {
			if (response) {
				console.log('---> transactions USER ', response);
				this.currentUser = <ApplicationUser>response;
				this.currentCategory = this.categoryService.getCategoryByName(this.currentUser, this.categoryName);
				if (this.currentCategory) {
					this.categoryDescription = this.currentCategory.description || '';
				}
				this.transactions = this.transactionService.getTransactionsByCategoryId(this.currentUser, this.currentCategory.id);
			}
		});
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	handleFromDateChange(fromDateChanged: Date) {
		console.log('---> fromDateChange ', fromDateChanged);
		this.fromDate = fromDateChanged;
	}

	handleToDateChange(toDateChanged: Date) {
		console.log('---> toDateChange ', toDateChanged);
		this.toDate = toDateChanged;
	}

}
