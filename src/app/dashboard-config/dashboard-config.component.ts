import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUser } from '../interfaces';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { DashboardService } from '../dashboard.service';
import { DashboardConfig } from '../interfaces';
import { DashboardPeriod } from '../interfaces';

@Component({
	selector: 'app-dashboard-config',
	templateUrl: './dashboard-config.component.html',
	styleUrls: ['./dashboard-config.component.scss']
})
export class DashboardConfigComponent implements OnInit {
	defineDashboardMessage: string;
	currentUser: LoggedUser;
	categories: any = [];
	isAllCheckboxChecked: boolean;
	dashboardConfig: DashboardConfig;
	selectDashboardTypeLbl: string = `Dashboard type`;
	selectDashboardDateLbl: string = `Period`;
	selectDashboardCategoryLbl: string = `Categories`;
	areaChartLbl: string = `Area chart`;
	barChartLbl: string = `Bar chart`;
	pieChartLbl: string = `Pie chart`;
	tableChartLbl: string = `Exel table`;
	isWrongConfig: boolean = false;
	wrongConfigMessage: string;
	selectedChartType: string;
	selectedCategories: string[] = [];
	fromDate: Date;
	toDate: Date;

	private subscription: Subscription;

	constructor(
		private router: Router,
		public userServise: UserService,
		public dashboardServise: DashboardService

	) { }

	ngOnInit() {
		this.subscription = this.userServise._user.subscribe((response) => {
			console.log('---> DASHBOARD _user', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.setInitialData();
			}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	setInitialData() {
		const user = { ...this.currentUser };
		this.defineDashboardMessage = `Hi, ${user.name}! Configure your dashboard options here.`;
		const today = new Date();
		this.toDate = today;
		this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
		if (this.currentUser.categories) {
			this.categories = [...this.currentUser.categories].reduce((categoriesList, category) => {
				const nameToDisplay = category.name.length > 15 ? `${category.name.substring(0, 10)}...` : category.name;
				if (nameToDisplay !== `Income`) {
					categoriesList.push({ name: nameToDisplay, isChecked: false });
				}
				return categoriesList;
			}, []);
		}
		this.categories.unshift({ name: `Income`, isChecked: false });
	}

	handleFromDateChange(newDate: Date) {
		this.fromDate = newDate;
	}

	handleToDateChange(newDate: Date) {
		this.toDate = newDate;
	}

	setChartType(event) {
		if (this.selectedChartType) {
			document.getElementById(this.selectedChartType).classList.remove('dashboard-config-type-item-selected');
		}

		document.getElementById(event.currentTarget.id).classList.add('dashboard-config-type-item-selected');
		this.selectedChartType = event.currentTarget.id;
	}

	toggle(event) {
		if (event.checked) {
			this.selectedCategories.push(event.source.id);
		} else {
			this.isAllCheckboxChecked = false;
			this.selectedCategories = [...this.selectedCategories].filter(category => category !== event.source.id);
		}
	}

	toggleAll(event) {
		if (event.checked) {
			this.categories = [...this.categories].reduce((categoryList, category) => {
				category.isChecked = true;
				categoryList.push(category);
				return categoryList;
			}, []);
			this.selectedCategories = [...this.categories].reduce((categoryList, category) => {
				categoryList.push(category.name);
				return categoryList;
			}, []);
		} else {
			this.categories = [...this.categories].reduce((categoryList, category) => {
				category.isChecked = false;
				categoryList.push(category);
				return categoryList;
			}, []);
			this.selectedCategories = [];
		}
	}

	collectDashboardData() {
		if (!this.selectedChartType) {
			this.isWrongConfig = true;
			this.wrongConfigMessage = `Please, specify the chart type.`;
		} else if (this.selectedCategories.length === 0) {
			this.isWrongConfig = true;
			this.wrongConfigMessage = `Please, select a categories to analize.`;
		} else {
			const dashboardPeriod: DashboardPeriod = { from: this.fromDate, to: this.toDate };
			this.isWrongConfig = false;
			this.dashboardConfig = {
				dashboardType: this.selectedChartType,
				dashboardPeriod: dashboardPeriod,
				dashboardCategories: this.selectedCategories,
				user: this.currentUser
			}
			this.dashboardServise.dashboardConfig = this.dashboardConfig;
			this.router.navigate([`/dashboard`]);
		}
	}
}
