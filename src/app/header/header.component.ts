import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { MatCardModule, MatButtonModule, throwToolbarMixedModesError } from '@angular/material';
import { HttpClient } from '@angular/common/http';
// import { HttpService } from '../http.service';
import { environment } from '../../environments/environment'
import { LoggedUser } from '../interfaces';
import { ScreenService } from '../screen.service';

import { Subscription } from 'rxjs';
import { Subject } from "rxjs"
// import { takeUntil } from "rxjs/operators"


@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	providers: []
})
export class HeaderComponent implements OnInit {

	public bgColor = "#8e8e8e";
	public color = "white";
	//public avatarSize = "large";

	private sbscr: Subscription;
	// componentDestroyed: Subject<boolean> = new Subject()


	navLinks = [];

	isMobile: boolean;
	userId: string;
	currentUser: LoggedUser;
	isAvatar: boolean;
	avatarSrc: string;
	avatarInitials: string = `AV`;
	avatarSize: string;


	thisMonthExpensesLabel: string = `Expenses: `;
	thisMonthExpensesSum: number;
	thisMonthIncomesLabel: string = `Incomes: `;
	thisMonthIncomesSum: number;
	thisMonthBalanceLabel: string = `Balance`;
	thisMonthBalanceSum: number;

	constructor(
		private dataService: DataService,
		private router: Router,
		private http: HttpClient,
		private screenService: ScreenService,
	) {
		this.userId = localStorage.getItem('userId');
		const href = this.router.url;
		//TODO remove navigation from header
		const headerLinks = [
			{ label: 'add expense', path: '/categories', isActive: true },
			{ label: 'balance', path: '/balance', isActive: false },
			{ label: 'profile', path: '/myprofile/' + this.userId, isActive: false },
		];
		this.navLinks = headerLinks;
	}

	ngOnInit() {
		this.sbscr = this.dataService.loggedUser.subscribe((response) => {
			console.log('--->  HEADER FROM SERVICE loggedUser INIT', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.setAvatar();
				//this.countUserBalance();
			} else {
				this.router.navigate(['/hello-monney']);
			}
		});
	}

	ngOnDestroy() {
		this.sbscr.unsubscribe();
	}

	// countUserBalance() {
	// 	const incomeCategory = this.currentUser.categories.filter(category => category.isIncome);
	// 	const incomeCategoryId = incomeCategory[0].id;
	// 	if (incomeCategoryId && this.currentUser.expences.length !== 0) {
	// 		const expenses = this.dataService.orderTransactionsByDate(this.currentUser.expences.filter(expense => expense.category !== incomeCategoryId));
	// 		const thisMonthExpences = this.dataService.getThisMonthTransactions(expenses);
	// 		const thisMonthExpensesSum = this.dataService.countCategoryTransactionsTotal(thisMonthExpences);
	// 		this.thisMonthExpensesSum = thisMonthExpensesSum;

	// 		const incomes = this.dataService.orderTransactionsByDate(this.currentUser.expences.filter(expense => expense.category == incomeCategoryId));
	// 		const thisMonthIncomes = this.dataService.getThisMonthTransactions(incomes);
	// 		const thisMonthIncomesSum = this.dataService.countCategoryTransactionsTotal(thisMonthIncomes);
	// 		this.thisMonthIncomesSum = thisMonthIncomesSum;

	// 		this.thisMonthBalanceSum = this.thisMonthIncomesSum - this.thisMonthExpensesSum;
	// 	}
	// }

	setAvatar() {
		if (this.currentUser.avatar) {
			this.isAvatar = true;
			this.avatarSrc = this.currentUser.avatar;
		} else {
			if (this.currentUser.name.split(` `)) {
				this.avatarInitials = this.currentUser.name.split(` `).length > 1 ?
					this.currentUser.name.split(` `)[0].slice(0, 1) + this.currentUser.name.split(` `)[1].slice(0, 1)
					: this.currentUser.name.slice(0, 1);
			}
		}
	}

	setActiveHeaderItem(selectedLinkLabel: string) {
		const navLinks = [...this.navLinks].reduce((headerLinks, currentLink) => {
			currentLink.isActive = currentLink.label == selectedLinkLabel ?
				true
				: false;
			headerLinks.push(currentLink);
			return headerLinks;
		}, []);

		this.navLinks = navLinks;
	}


}
