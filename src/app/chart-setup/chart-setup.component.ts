import { Component, OnInit } from '@angular/core';
import { ChartItem, DatePickerSetup, Category, ApplicationUser, CategoryChartItem, ChartSetup } from '../interfaces';
import { UserService } from '../user.service';
import { StorageService } from '../storage.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChartState } from '../store/state/chart.state';

@Component({
	selector: 'app-chart-setup',
	templateUrl: './chart-setup.component.html',
	styleUrls: ['./chart-setup.component.scss']
})
export class ChartSetupComponent implements OnInit {

	chartSetupLbl: string = `set up your report`;
	chartTypeLbl: string = `report type`;
	chartDatesLbl: string = `period`;
	chartCategoriesLbl: string = `categories`;
	buildChartLbl: string = `build report`;
	selectedChartClass: string = `chart-type-icon-selected`;
	unSelectedChartClass: string = `chart-type-icon`;
	unselectedChartTypeMessage: string = `Please, select a chart type.`;
	unselectedCategoryTypeMessage: string = `Please, select a category.`;
	fromDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);;
	toDate: Date = new Date();
	chartItems: ChartItem[] = [
		{ icon: `bar_chart`, class: this.unSelectedChartClass, tooltip: `bar chart` },
		{ icon: `pie_chart`, class: this.unSelectedChartClass, tooltip: `pie chart` },
		{ icon: `multiline_chart`, class: this.unSelectedChartClass, tooltip: `line chart` },
		{ icon: `dashboard`, class: this.unSelectedChartClass, tooltip: `card chart` },
		{ icon: `table_chart`, class: this.unSelectedChartClass, tooltip: `table` }
	];
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

	selectadChartType: string;
	CategoryChartItems: CategoryChartItem[];
	currentUser: ApplicationUser;
	selectedChartSetup: ChartSetup;
	isChartTypeUnselected: boolean;
	isCategoryUnselected: boolean;
	previouseChartSetup: ChartSetup;
	private userSubscription: Subscription;

	constructor(
		private userService: UserService,
		private router: Router,
		private storageService: StorageService,
		private store: Store<ChartState>
	) {
		this.store.select(state => state).subscribe(data => {
			console.log('data ', data)
			const localChartSetup: any = data;
			if (localChartSetup.chartSetup.length) {
				localChartSetup.chartSetup.forEach(chartDataObj => {
					if (chartDataObj && chartDataObj.hasOwnProperty(`chartType`)) {
						this.previouseChartSetup = chartDataObj;
					}
				});

			}
		});
	}

	ngOnInit() {
		this.userSubscription = this.userService._user.subscribe(response => {
			console.log('---> CHART_SETUP _user ', response);
			if (response) {
				this.currentUser = response;
				this.CategoryChartItems = this.buildCategoryChartItemsList(this.currentUser.categories);
			} else if (!this.currentUser && localStorage.getItem('token')) {
				this.userService.getUserByToken();
			}
		});
		if (this.previouseChartSetup) {
			this.autofillInputsFromPreviouseForm()
		}
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	autofillInputsFromPreviouseForm() {
		this.selectadChartType = this.previouseChartSetup.chartType;
		this.fromDate = this.previouseChartSetup.chartFromDate;
		this.toDate = this.previouseChartSetup.chartToDate;
		this.fromDatePickerSetup.dateValue = this.previouseChartSetup.chartFromDate;
		this.toDatePickerSetup.dateValue = this.previouseChartSetup.chartToDate;
		this.CategoryChartItems = this.previouseChartSetup.categories;
		this.changeSelectedChartTypeClass();
	}

	selectChartType(event) {
		this.isChartTypeUnselected = false;
		this.selectadChartType = event.srcElement.id;
		this.changeSelectedChartTypeClass();
	}

	changeSelectedChartTypeClass() {
		this.chartItems.forEach(chartItem => {
			if (chartItem.icon === this.selectadChartType) {
				chartItem.class = this.selectedChartClass;
			} else {
				chartItem.class = this.unSelectedChartClass;
			}
		});
	}

	buildCategoryChartItemsList(categories: Category[]): CategoryChartItem[] {
		const initCategoryChartItem: CategoryChartItem = { label: `all`, class: `chart-category` };
		const CategoryChartItemsList = categories.reduce((checkboxList, category) => {
			const CategoryChartItem = { label: category.name.toLowerCase(), class: `chart-category` };
			checkboxList.push(CategoryChartItem);
			return checkboxList;
		}, [initCategoryChartItem]);

		return CategoryChartItemsList;
	}

	handleFromDateChange(fromDateChanged: Date) {
		this.fromDate = fromDateChanged;
	}

	handleToDateChange(toDateChanged: Date) {
		this.toDate = toDateChanged;
	}

	checkChartCategories(event) {
		this.isCategoryUnselected = false;
		if (event.srcElement.id === `all`) {
			const allCategoriesClass: CategoryChartItem = this.CategoryChartItems.find(category => category.class);
			if (allCategoriesClass.class === `chart-category`) {
				this.CategoryChartItems.forEach(CategoryChartItem => {
					CategoryChartItem.class = `chart-category-selected`;
				});
			} else {
				this.CategoryChartItems.forEach(CategoryChartItem => {
					CategoryChartItem.class = `chart-category`;
				});
			}
		}
		if (event.srcElement.id !== `all`) {
			this.CategoryChartItems.forEach(CategoryChartItem => {
				if (CategoryChartItem.label === `all`) {
					CategoryChartItem.class = `chart-category`;
				}
				if (CategoryChartItem.label === event.srcElement.id) {
					CategoryChartItem.class = CategoryChartItem.class === `chart-category-selected` ? `chart-category` : `chart-category-selected`;
				}
			});
		}
	}

	buildChart() {
		const isChartSetupValid: boolean = this.validateChartSetup();
		if (isChartSetupValid) {
			this.selectedChartSetup = {
				user: this.currentUser,
				chartType: this.selectadChartType,
				chartFromDate: new Date(this.fromDate),
				chartToDate: new Date(this.toDate),
				categories: this.CategoryChartItems
			}
			this.router.navigate([`/report/${this.selectedChartSetup.chartType}`], { state: this.selectedChartSetup });
		}
	}

	validateChartSetup(): boolean {
		const selectedCategories = this.CategoryChartItems.filter(CategoryChartItem => CategoryChartItem.class === `chart-category-selected`);
		if (!selectedCategories.length) {
			this.isCategoryUnselected = true;
		}
		if (!this.selectadChartType) {
			this.isChartTypeUnselected = true;
		}

		return !this.isCategoryUnselected && !this.isChartTypeUnselected ? true : false;
	}
}
