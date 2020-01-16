import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChartState } from '../store/state/chart.state';
import { ChartItem, DatePickerSetup, Category, ApplicationUser, CheckboxItem, ChartData, Transaction } from '../interfaces';
import * as ChartActions from '../store/actions/chart.actions';
import { Observable } from 'rxjs/Observable';
import { TransactionService } from '../transaction.service';


@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
	//const this
	// data  = [
	// 	{ "CountryName": "China", "Pop1995": 1216, "Pop2005": 1297, "Pop2015": 1361, "Pop2025": 1394 },
	// 	{ "CountryName": "India", "Pop1995": 920, "Pop2005": 1090, "Pop2015": 1251, "Pop2025": 1396 },
	// 	{ "CountryName": "United States", "Pop1995": 266, "Pop2005": 295, "Pop2015": 322, "Pop2025": 351 },
	// 	{ "CountryName": "Indonesia", "Pop1995": 197, "Pop2005": 229, "Pop2015": 256, "Pop2025": 277 },
	// 	{ "CountryName": "Brazil", "Pop1995": 161, "Pop2005": 186, "Pop2015": 204, "Pop2025": 218 }
	// ];
	data;
	chartSetup: ChartData;
	chartType: string;
	chartName: string = `chart`;
	columnChartType: string = `Column`;
	lineCharttype: string = `SplineArea`;
	dashboardChartType: string = `Waterfall`;
	constructor(
		private router: Router,
		private store: Store<ChartState>,
		private transactionService: TransactionService
	) {
		console.log('---> getCurrentNavigation.state.data ', router.getCurrentNavigation().extras.state);
		this.chartSetup = <ChartData>router.getCurrentNavigation().extras.state;
		if (!this.chartSetup) {
			this.router.navigate([`/chart`]);
		}
		this.store.dispatch(new ChartActions.AddChartData(this.chartSetup));
	}

	ngOnInit() {
		this.chartType = this.columnChartType;

		this.buildChartData();
		const usaMedals: any = [
			{ Year: "1964", UnitedStatesrr: 148, name: 're' },
			{ Year: "2000", UnitedStatesrr: 142, name: 're' },
			{ Year: "2001", UnitedStatesrr: 134, name: 're' },
			{ Year: "2008", UnitedStatesrr: 131, name: 're' },
			{ Year: "2012", UnitedStatesrr: 135, name: 're' },
			{ Year: "2020", UnitedStatesrr: 146, name: 're' }
		];
		const chinaMedals: any = [
			{ Year: "1976", China: 110, name: 'rsfe' },
			{ Year: "2002", China: 115, name: 'rsfe' },
			{ Year: "2004", China: 121, name: 'rsfe' },
			{ Year: "2010", China: 129, name: 'rsfe' },
			{ Year: "2015", China: 115, name: 'rsfe' },
			{ Year: "2016", China: 112, name: 'rsfe' }
		];
		const russiaMedals: any = [
			{ Year: "1998", Russia: 95, name: 'rfdfe' },
			{ Year: "2000", Russia: 91, name: 'rfdfe' },
			{ Year: "2005", Russia: 86, name: 'rfdfe' },
			{ Year: "2008", Russia: 65, name: 'rfdfe' },
			{ Year: "2012", Russia: 77, name: 'rfdfe' },
			{ Year: "2016", Russia: 88, name: 'rfdfe' }
		];
		this.data = [usaMedals, chinaMedals, russiaMedals];
	}

	buildChartData() {
		const user = <ApplicationUser>this.chartSetup.user;
		const selectedCategories: CheckboxItem[] = this.chartSetup.categories;

		const categoriesToBuildChart: Category[] = user.categories.reduce((categoriesList, category) => {
			selectedCategories.forEach(checkboxCategory => {
				if (category.name.toLowerCase() === checkboxCategory.label.toLowerCase() && checkboxCategory.isChecked) {
					categoriesList.push(category);
				}
			})
			return categoriesList;
		}, []);
		console.log('---> checkedCategories ', categoriesToBuildChart);

		const categoriesWithTransactions = categoriesToBuildChart.reduce((categoriesWithTransactionsList, category) => {
			const categoryWithTransactions = {
				category: category.name,
				transactions: this.transactionService.getTransactionsByCategoryId(user, category.id)
			};
			categoriesWithTransactionsList.push(categoryWithTransactions);
			return categoriesWithTransactionsList;
		}, []);

		console.log('---> categoriesWithTransactions ', categoriesWithTransactions);


		const categoriesWithTransactionsByDates = categoriesWithTransactions.reduce((categoriesWithTransactionsList, category) => {
			if (category.transactions.length) {
				const transactionsByDate = this.transactionService.getTransactionsByDates(this.chartSetup.chartFromDate, this.chartSetup.chartToDate, category.transactions);
				const categoryWithTransactionsByDates = {
					category: category.category,
					transactions: transactionsByDate
				};
				categoriesWithTransactionsList.push(categoryWithTransactionsByDates);
			} else {
				categoriesWithTransactionsList.push(category);
			}
			return categoriesWithTransactionsList;
		}, []);
		console.log('---> categoriesWithTransactionsByDates ', categoriesWithTransactionsByDates);

	}



}
