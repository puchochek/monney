import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { FinanceData } from '../interfaces';
import { DataService } from '../data.service';
import { Router, NavigationExtras, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
	selector: 'app-balance-manage-incomes',
	templateUrl: './balance-manage-incomes.component.html',
	styleUrls: ['./balance-manage-incomes.component.scss']
})
export class BalanceManageIncomesComponent implements OnInit {
	@Input() appUser: LoggedUser;

	incomes: FinanceData[];
	incomesToDisplay: FinanceData[];
	addExpenseBtnLabel: string;
	greetingMessage: string;
	incomeCategoryId: string;
	headers: string[];

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private snackBar: MatSnackBar,
	) { }

	ngOnInit() {
		this.greetingMessage = `Hello, ${this.appUser.name}. Add an income here to track your balance.`
		this.addExpenseBtnLabel = `Add income`;
		this.headers = ['Income', 'Sum', 'Date', 'Actions'];

		if (this.appUser.categories) {
			const incomeCategory = this.appUser.categories.filter(category => category.name === `income`);
			if (incomeCategory.length !== 0) {
				this.incomeCategoryId = incomeCategory[0].id;
			}
		}
		if (this.incomeCategoryId && this.appUser.expences.length !== 0) {
			this.incomes = this.orderIncomesByDate(this.appUser.expences.filter(expense => expense.category === this.incomeCategoryId));
			this.incomesToDisplay = this.incomes;
		}
	}

	orderIncomesByDate(incomes: FinanceData[]): FinanceData[] {
		const sortedIncomes = incomes.sort(function (a, b) {
			return (new Date(b.date) as any) - (new Date(a.date) as any);
		});
		return sortedIncomes;
	}

	openAddIncomeModal() {
		this.router.navigate([`/categories//Income/${this.incomeCategoryId}`]);
	}

	openEditIncomeModal(income: FinanceData) {
		let navigationExtras: NavigationExtras = {
			queryParams: {
				"category": income.category,
				"comment": income.comment,
				"date": income.date,
				"id": income.id,
				"isDeleted": income.isDeleted,
				"sum": income.sum,
				"user": income.userId
			}
		};
		this.router.navigate([`/categories//Income/${income.id}`], navigationExtras);
	}

	deleteIncome(income: FinanceData) {
		const transactionToDelete: FinanceData = {
			comment: income.comment,
			id: income.id,
			sum: income.sum,
			category: income.category,
			userId: income.userId,
			isDeleted: true,
			date: income.date
		};
		const requestUrl = `http://localhost:3000/expence/edit`;
		// const navigateUrl = `/balance`;
		this.doTransactionControllerCall(transactionToDelete, requestUrl);
	}

	doTransactionControllerCall(transaction: FinanceData, requestUrl: string) {
		let snackMessage: string;
		let action: string;

		this.http.post(requestUrl, {
			comment: transaction.comment,
			id: transaction.id,
			sum: transaction.sum,
			category: transaction.category,
			userId: transaction.userId,
			user: transaction.userId,
			isDeleted: transaction.isDeleted,
			date: transaction.date,
			categoryId: transaction.category
		}, { observe: 'response' }
		).subscribe(
			response => {
				snackMessage = 'Done';
				action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				// this.savedExpense = <FinanceData>response.body;
				this.dataService.updateToken(response.headers.get('Authorization'));
				const deletedIncome = <FinanceData>response.body;
				console.log('---> DELETED EXP savedExpense ', deletedIncome);
				//TODO DELETE FROM FRONT END
				const filteredIncomes = this.incomes.filter(income => income.id !== deletedIncome.id);
				this.incomesToDisplay = filteredIncomes;
				// this.router.navigate([navigateUrl]);
			},
			error => {
				console.log('---> DELETED EXPENSE ERROR ', error);
				snackMessage = 'Oops!';
				action = `Try again`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

}
