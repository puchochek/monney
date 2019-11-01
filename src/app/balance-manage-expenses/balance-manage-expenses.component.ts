import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { FinanceData } from '../interfaces';
import { DataService } from '../data.service';
import { Router, NavigationExtras, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-balance-manage-expenses',
	templateUrl: './balance-manage-expenses.component.html',
	styleUrls: ['./balance-manage-expenses.component.scss']
})
export class BalanceManageExpensesComponent implements OnInit {
	@Input() appUser: LoggedUser;

	expenses: FinanceData[];
	expensesToDisplay: FinanceData[];
	addExpenseBtnLabel: string;
	greetingMessage: string;
	incomeCategoryId: string;
	headers: string[];
	deleteExpenseTooltip: string;
	deleteIncomeTooltip: string;

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private snackBar: MatSnackBar,
	) { }

	ngOnInit() {
		this.greetingMessage = `Hello, ${this.appUser.name}. Add an income here to track your balance.`
		this.addExpenseBtnLabel = `Add income`;
		this.headers = ['Category', 'This month total', 'Actions'];
		// this.editIncomeTooltip = `Edti income`;
		this.deleteExpenseTooltip = `View expenses`;

		if (this.appUser.categories) {
			const incomeCategory = this.appUser.categories.filter(category => category.name === `income`);
			if (incomeCategory.length !== 0) {
				this.incomeCategoryId = incomeCategory[0].id;
			}
		}
		if (this.incomeCategoryId && this.appUser.expences.length !== 0) {
			this.expenses = this.dataService.orderTransactionsByDate(this.appUser.expences.filter(expense => expense.category !== this.incomeCategoryId));
			this.expensesToDisplay = [...this.expenses];
		}
	}

}
