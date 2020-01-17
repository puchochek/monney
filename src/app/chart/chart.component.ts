import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChartState } from '../store/state/chart.state';
import { ChartItem, DatePickerSetup, Category, ApplicationUser, CheckboxItem, ChartSetup, Transaction, ChartDataObject } from '../interfaces';
import * as ChartActions from '../store/actions/chart.actions';
import { Observable } from 'rxjs/Observable';
import { TransactionService } from '../transaction.service';
import { BalanceService } from '../balance.service';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';


@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

	chartSetup: ChartSetup;
	chartLbl: string;
	isBarChart: boolean;
	isPieChart: boolean;
	isLinearChart: boolean;
	isCardChart: boolean;
	categoriesWithTransactionsByDates: ChartDataObject[];
	chartData: any[];
	showXAxis: boolean;
	showYAxis: boolean;
	gradient: boolean;
	showLegend: boolean;
	showXAxisLabel: boolean;
	xAxisLabel: string;
	showYAxisLabel: boolean;
	yAxisLabel: string;
	timeline: boolean;
	colorScheme: string;
	legendPosition: string;
	showLabels: boolean;
	isDoughnut: boolean;
	xAxis: boolean;
	yAxis: boolean;
	animations: boolean;

	backBtnLbl: string = `back`;
	saveAsPdfLbl: string = `save as pdf`;

	exportAsConfig: ExportAsConfig = {
		type: 'pdf',
		elementId: 'chart',
		options: {
			jsPDF: {
				orientation: 'landscape'
			},
			margins: {
				top: '50',
				left: '20',
				bottom: '20',
				right: '20',
			}
		}
	};

	constructor(
		private router: Router,
		private store: Store<ChartState>,
		private transactionService: TransactionService,
		private balanceService: BalanceService,
		private exportAsService: ExportAsService
	) {
		console.log('---> getCurrentNavigation.state.data ', router.getCurrentNavigation().extras.state);
		this.chartSetup = <ChartSetup>router.getCurrentNavigation().extras.state;
		if (!this.chartSetup) {
			this.router.navigate([`/chart`]);
		}
		this.store.dispatch(new ChartActions.AddChartSetup(this.chartSetup));
	}

	ngOnInit() {
		this.chartLbl = `transactions from ${this.chartSetup.chartFromDate.toLocaleDateString()} to ${this.chartSetup.chartToDate.toLocaleDateString()} `;
		this.prepareChartData();
		switch (this.chartSetup.chartType) {
			case `bar_chart`:
				this.isBarChart = true;
				this.xAxisLabel = `category`;
				this.yAxisLabel = `sum`;
				this.buildCommonChartData();
				break;
			case `pie_chart`:
				this.isPieChart = true;
				this.buildCommonChartData();
				break;
			case `multiline_chart`:
				this.isLinearChart = true;
				this.xAxisLabel = `date`;
				this.yAxisLabel = `sum`;
				this.buildLinearChartData();
				break;
			case `dashboard`:
				this.isCardChart = true;
				this.buildCommonChartData();
				break;
		}
		this.setChartVisualEffects();

	}

	buildCommonChartData() {
		const barChartData = this.categoriesWithTransactionsByDates.reduce((chartDataList, chartDataItem) => {
			let barChartDataItem = {
				name: chartDataItem.category,
				value: chartDataItem.transactions.length ? this.balanceService.countTransactionsSum(chartDataItem.transactions) : 0
			}
			chartDataList.push(barChartDataItem);
			return chartDataList;
		}, []);

		this.chartData = barChartData;
	}

	buildLinearChartData() {
		const linearChartData = this.categoriesWithTransactionsByDates.reduce((chartDataList, chartDataItem) => {
			let linearChartDataItem = {
				name: chartDataItem.category,
				series: []
			};
			if (chartDataItem.transactions.length) {
				chartDataItem.transactions.forEach(transaction => {
					const linearSeriesItem = {
						name: new Date(transaction.date).toLocaleDateString(),
						value: transaction.sum,
					}
					linearChartDataItem.series.push(linearSeriesItem);
				});
			}
			chartDataList.push(linearChartDataItem);
			return chartDataList;
		}, []);

		this.chartData = linearChartData;
	}

	setChartVisualEffects() {
		this.showLegend = window.innerWidth > 700 ? true : false;
		this.showYAxisLabel = window.innerWidth > 700 ? true : false;
		this.showXAxis = true;
		this.showYAxis = true;
		this.gradient = false;
		this.showXAxisLabel = true;
		this.timeline = true;
		this.xAxis = true;
		this.yAxis = true;
		this.colorScheme = this.setRandomColorScheme();
		this.showLabels = this.isPieChart ? true : false;
		this.isDoughnut = false;
		this.legendPosition = `right`;
		this.animations = true;
	}

	setRandomColorScheme(): string {
		const availableColorSchemas: string[] = [
			`vivid`, `natural`, `cool`, `fire`, `solar`, `air`, `aqua`, `flame`, `ocean`, `forest`, `horizon`, `neons`, `picnic`, `night`, `nightLights`
		];

		return availableColorSchemas[Math.floor(Math.random() * availableColorSchemas.length)];
	}

	prepareChartData() {
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

		const categoriesWithTransactions: ChartDataObject[] = categoriesToBuildChart.reduce((categoriesWithTransactionsList, category) => {
			const categoryWithTransactions = {
				category: category.name,
				transactions: this.transactionService.getTransactionsByCategoryId(user, category.id)
			};
			categoriesWithTransactionsList.push(categoryWithTransactions);
			return categoriesWithTransactionsList;
		}, []);

		this.categoriesWithTransactionsByDates = categoriesWithTransactions.reduce((categoriesWithTransactionsList, category) => {
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
	}

	saveChartAsPdf() {
		this.exportAsService.save(this.exportAsConfig, this.chartLbl).subscribe(() => {});
	}
}
