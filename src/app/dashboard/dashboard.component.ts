import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { DataService } from '../data.service';




@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	private sbscr: Subscription;
	dashboardConfig: any;
	chart: any;

	constructor(
		private router: Router,
		private dashboardServise: DashboardService,
		private dataService: DataService,

	) { }

	ngOnInit() {
		this.sbscr = this.dashboardServise._dashboardSettings.subscribe((response) => {
			console.log('---> DASHBOARD  dashboardServise INIT', response);
			if (response) {
				this.dashboardConfig = response;
				const chartLabels = this.buildChartLabels();
				const transactionsForSelectedCategories = this.defineSelectedCategoriesTransactions();
				const selectedPeriodTransactions = this.defineSelectedPeriodTransactions(transactionsForSelectedCategories);
				console.log('---> transactionsForSelectedCategories ', transactionsForSelectedCategories);
				console.log('---> selectedPeriodTransactions ', selectedPeriodTransactions);
				//console.log('---> chartLabels ', chartLabels);
				this.buildChart();
			} else {
				this.router.navigate(['/dashboard/config']);
			}
		});
	}

	ngOnDestroy() {
		this.sbscr.unsubscribe();
	}

	defineSelectedCategoriesTransactions(): any {
		const categoriesIdsByName = [...this.dashboardConfig.dashboardCategories].reduce((categoriesByIdList, thisCategory) => {
			const categoryId = [...this.dashboardConfig.user.categories].filter(category => category.name === thisCategory)[0].id;
			categoriesByIdList.push({
				name: thisCategory,
				id: categoryId
			})
			return categoriesByIdList;
		}, []);
		const transactionsByCategoryId = [...categoriesIdsByName].reduce((transactionsList, thisCategory) => {
			const transactionsByCategoryName = {
				category: thisCategory.name,
				transactions: this.dataService.sortTransactionsByCategoryId(thisCategory.id, [...this.dashboardConfig.user.transactions])
			}
			transactionsList.push(transactionsByCategoryName);
			return transactionsList;
		}, []);

		return transactionsByCategoryId;
	}

	defineSelectedPeriodTransactions(transactionsForSelectedCategories: any): any {
		const fromDate = this.dashboardConfig.dashboardPeriod.from.value;
		const toDate = this.dashboardConfig.dashboardPeriod.to.value;
		const thisPeriodTransactions = [...transactionsForSelectedCategories].reduce((transactionsList, thisTransaction) => {
			const transactionsForThisPeriod = [...thisTransaction.transactions].filter(transaction => {
				return (new Date(transaction.date) >= fromDate) && (new Date(transaction.date) <= toDate);
			});
			transactionsList.push({
				category: thisTransaction.category,
				transactions: transactionsForThisPeriod
			})
			return transactionsList;
		}, []);

		return thisPeriodTransactions;
	}

	buildChartLabels(): string[] {
		const fromDate = this.dashboardConfig.dashboardPeriod.from.value;
		const toDate = this.dashboardConfig.dashboardPeriod.to.value;
		const weeksInDashboardPeriod = Math.floor((new Date(toDate).getTime() - new Date(fromDate).getTime()) / 1000 / 60 / 60 / 24 / 7);

		const datesLabels = [];
		for (var i = 0; i < weeksInDashboardPeriod; i++) {
			const lableDate = i * 7;
			datesLabels.push(new Date(fromDate).setDate(fromDate.getDate() + lableDate))
		}
		return [...datesLabels].reduce((datelist, currentDate) => {
			datelist.push({
				msDate: currentDate,
				formattedDate: new Date(currentDate).toLocaleString('en', { year: 'numeric', month: 'short', day: 'numeric' })
			})
			return datelist;
		}, []);
	}

	buildChart() {
		let temp_max = [25, 748, 29];
		let temp_min = [144, 0, 58];
		this.chart = new Chart('canvas', {
			type: 'line',
			data: {
				labels: [`test 1`, `test2`, `test3`],
				datasets: [
					{
						data: temp_max,
						borderColor: "#3cba9f",
						fill: true
					},
					{
						data: temp_min,
						borderColor: "#ffcc00",
						fill: true
					},
				]
			},
			options: {
				legend: {
					display: true
				},
				scales: {
					xAxes: [{
						display: true
					}],
					yAxes: [{
						display: true
					}],
				}
			}
		});
	}



}
