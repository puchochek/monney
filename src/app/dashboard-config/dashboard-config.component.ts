import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { FormControl } from '@angular/forms';
import { LoggedUser } from '../interfaces';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserService } from '../user.service';
import { MatDatepickerModule, MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
	selector: 'app-dashboard-config',
	templateUrl: './dashboard-config.component.html',
	styleUrls: ['./dashboard-config.component.scss']
})
export class DashboardConfigComponent implements OnInit {
	@Output()
	dateInput: EventEmitter<MatDatepickerInputEvent<any>>;

	defineDashboardMessage: string;
	currentUser: LoggedUser;
	isLoading: boolean = true;
	categories: string[] = [];
	selectDashboardTypeLbl: string = `Dashboard type`;
	selectDashboardDateLbl: string = `Period`;
	selectDashboardCategoryLbl: string = `Categories`;
	allExpensesLbl: string = `All expenses`;
	allExpensesWithIncomesLbl: string = `All expenses with incomes`;
	customCategoriesLbl: string = `Choose categories`;
	areaChartLbl: string = `Area chart`;
	barChartLbl: string = `Bar chart`;
	pieChartLbl: string = `Pie chart`;
	isCustomCategorySet: boolean = false;
	isValidFromDate: boolean = true;
	isValidToDate: boolean = true;
	maxFromDate: Date;
	maxToDate: Date;
	minToDate: Date;
	minFromDate: Date;
	toDateValue: FormControl;
	fromDateValue: FormControl;

	private sbscr: Subscription;

	constructor(
		private dataService: DataService,
		private router: Router,
		private http: HttpClient,
		public userServise: UserService
	) { }

	ngOnInit() {
		this.sbscr = this.userServise._user.subscribe((response) => {
			console.log('---> DASHBOARD userServise INIT', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.setInitialData();
			} else {
				this.doUserControllerCall();
			}
		});
	}
	ngOnDestroy() {
		this.sbscr.unsubscribe();
	}

	doUserControllerCall() {
		const userId = localStorage.getItem("userId");
		const url = `${environment.apiBaseUrl}/user/user-by-id/${userId}`;
		if (userId) {
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						this.setInitialData();
					},
					error => {
						console.log('---> DASHBOARD error ', error);
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}
	}

	setInitialData() {
		const user = { ...this.currentUser };
		this.defineDashboardMessage = `Hi, ${user.name}! Configure your dashboard options here.`;
		//this.selectDashboardTypeLbl = 
		const today = new Date();
		this.toDateValue = new FormControl(today);
		this.fromDateValue = new FormControl(new Date(today.getFullYear(), today.getMonth(), 1));
		this.isLoading = false;
	}

	onDateInputFrom(event) {
		this.isValidFromDate = true;
		const newDate = event.target.value;
		this.minToDate = newDate;
		const isValidDate = this.validateInputDate(newDate);
		if (isValidDate) {
			//this.transactionToDisplay = this.setSelectedPeriodTransactions(newDate, new Date(this.toDateValue.value));
		} else {
			this.isValidFromDate = false;
		}
	}

	onDateInputTo(event) {
		this.isValidToDate = true;
		const newDate = event.target.value;
		this.maxFromDate = newDate;
		const isValidDate = this.validateInputDate(newDate);
		if (isValidDate) {
			//this.transactionToDisplay = this.setSelectedPeriodTransactions(new Date(this.fromDateValue.value), newDate);
		} else {
			this.isValidToDate = false;
		}

	}

	validateInputDate(newDate: Date): boolean {
		if (newDate instanceof Date && !(newDate > new Date())) {
			return true;
		} else {
			return false;
		}
	}

	showCustomCategories(event) {
		this.isCustomCategorySet = !this.isCustomCategorySet;
		console.log('---> this.currentUser ', this.currentUser);
		if (this.isCustomCategorySet && this.currentUser.categories) {
			this.categories = [...this.currentUser.categories].reduce((categoriesList, category) => {
				const nameToDisplay = category.name.length > 10 ? `${category.name.substring(0, 10)}...` : category.name
				categoriesList.push(nameToDisplay);
				return categoriesList;
			}, []);
		}
	}

	setChartType(event, chartType: string) {
		// const configTypeItemsList = document.getElementsByClassName('dashboard-config-type-item');
		// for (var i = 0; i < configTypeItemsList.length; i++) {
		// 	configTypeItemsList[i].classList.remove('dashboard-config-type-item-selected');

		// }
		
		//document.getElementById(chartType).classList.add('dashboard-config-type-item-selected');
	}

}
