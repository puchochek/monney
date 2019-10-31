import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { FinanceData } from '../interfaces';
import { DataService } from '../data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
	selector: 'app-balance-manage-incomes',
	templateUrl: './balance-manage-incomes.component.html',
	styleUrls: ['./balance-manage-incomes.component.scss']
})
export class BalanceManageIncomesComponent implements OnInit {
	@Input() appUser: LoggedUser;

	incomes: FinanceData[];
	addExpenseBtnLabel: string;
	greetingMessage: string;
	incomeCategoryId: string;
	headers: string[];

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
	) { }

	ngOnInit() {
		console.log('---> appUser ', this.appUser);
		this.greetingMessage = `Hello, ${this.appUser.name}. Add an income here to track your balance.`
		this.addExpenseBtnLabel = `Add income`;
		this.headers = ['Income', 'Date', 'Actions'];

		if (this.appUser.categories) {
			const incomeCategory = this.appUser.categories.filter(category => category.name === `income`);
			if (incomeCategory.length !== 0) {
				this.incomeCategoryId = incomeCategory[0].id;
			}
		}
		console.log('---> this.incomeCategoryId ', this.incomeCategoryId);
		if (this.incomeCategoryId && this.appUser.expences.length !== 0) {
			this.incomes = this.appUser.expences.filter(expense => expense.category === this.incomeCategoryId);
		}
		console.log('---> this.incomes ', this.incomes );
	}


	openAddIncomeModal() {
		//http://localhost:4200/categories/Income/undefined
		//this.incomeCategoryId = undefined;
		this.router.navigate([`/categories//Income/${this.incomeCategoryId}`]);
	}

	deleteIncome() {

	}

}
