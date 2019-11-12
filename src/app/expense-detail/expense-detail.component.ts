import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { LoggedUser } from '../interfaces';
import { ScreenService } from '../screen.service';
import { FinanceData } from '../interfaces';
import { Category } from '../interfaces';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-expense-detail',
	templateUrl: './expense-detail.component.html',
	styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit {
	currentUser: LoggedUser;
	categoryName: string;
	categoryDescription: string;
	categoryId: string;
	private subscription: Subscription;

	expenses: FinanceData[];
	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.categoryId = this.route.snapshot.paramMap.get('category');
		this.subscription = this.dataService.loggedUser.subscribe((response) => {
			console.log('---> DETAIL call subscription' );
			if (response) {
				console.log('--->  DETAIL FROM SERVICE loggedUser INIT', response);
				this.currentUser = response;
				this.setInitialData();
			} else {
				this.router.navigate(['/hello-monney']);
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	setInitialData() {
		const currentCategory = [...this.currentUser.categories].filter(category => category.id === this.categoryId)[0];
		this.categoryName = currentCategory.name;
		this.categoryDescription = currentCategory.description;
	}

	connectDataBase() {
		// // use for get-request
		// this.http.get(`${environment.apiBaseUrl}/expence/` + this.selectedCategory).subscribe((response: FinanceData[]) => {
		// 	this.setExpensesByCategory(response);
		// });
	}

	setExpensesByCategory(response: FinanceData[]) {
		// const formattedResponse = this.formatResponseDate(response);
		// const thisMonthExpenses = this.getThisMonthExpences(formattedResponse);
		// const sortedResponse = this.sortDataByDate(thisMonthExpenses);

		// this.isEmptyExpencesList = !sortedResponse.length;
		// this.isExpencesList = !this.isEmptyExpencesList;

		// this.expensesByCategory = sortedResponse;
	}

	//formatResponseDate(response: FinanceData[]): FinanceData[] {
	// const formattedResponse = response.reduce(function (resultArray, currentExpense) { //do I need replace this method to servis?
	//   currentExpense.date = currentExpense.date.substring(0, 10);
	//   resultArray.push(currentExpense);
	//   return resultArray;
	// }, []);

	// return formattedResponse;

	// 	return this.data.formatResponseDate(response);
	// }

	// getThisMonthExpences(formattedResponse: FinanceData[]): FinanceData[] {  // TODO this logic is also used in balance component. 
	// 	const currentMonth = this.getCurrentMonth();
	// 	const thisMonthExpences = formattedResponse.filter(expense => expense.date.substring(5, 7) === currentMonth);

	// 	return thisMonthExpences;
	// }

	// getCurrentMonth(): string {
	// 	let currentMonth = (new Date().getMonth() + 1).toString();
	// 	currentMonth.length === 1 ?
	// 		currentMonth = '0' + currentMonth
	// 		: currentMonth = currentMonth;

	// 	return currentMonth;
	// }

	// sortDataByDate(thisMonthExpenses: FinanceData[]): FinanceData[] {
	// 	const sortedResponse = thisMonthExpenses.slice(0);
	// 	sortedResponse.sort(function (a, b) {
	// 		return +b.date.substring(5, 7) - +a.date.substring(5, 7);
	// 	});

	// 	return sortedResponse;
	// }

}
