import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartData } from '../interfaces';
import { DataService } from '../data.service';

@Component({
	selector: 'app-area-chart',
	templateUrl: './area-chart.component.html',
	styleUrls: ['./area-chart.component.scss']
})
export class AreaChartComponent implements OnInit {
	@Input() chartData: ChartData;
	@Output()
	onEmptyDashboardData: EventEmitter<any> = new EventEmitter<any>();
	chart: any;
	moreDatesRequired: boolean;
	minimumDatesMessage: string;

	constructor(
		private dataService: DataService,
	) { }

	ngOnInit() {
		if (this.chartData) {
			this.buildChart();
		}
	}

	buildChartLabels(): string[] {
		const fromDate = this.chartData.dashboardPeriod.from;
		const toDate = this.chartData.dashboardPeriod.to;
		const daysInSelectedPeriod = Math.ceil((new Date(toDate).getTime() - new Date(fromDate).getTime()) / 1000 / 60 / 60 / 24);
		let threeDaysSubperiodsinPeriod = daysInSelectedPeriod / 3;
		if (threeDaysSubperiodsinPeriod <= 1) {
			this.moreDatesRequired = true;
			this.minimumDatesMessage = `*This chart type requires at least 3-days period to be selected.
			We just added a few days to your dashboard request, so that now you may see the data in a correct way.`;
			threeDaysSubperiodsinPeriod = 2;
		}
		const datesLabels = [];
		for (var i = 0; i < threeDaysSubperiodsinPeriod; i++) {
			const dateStep = i * 3;
			const nextDate = new Date(fromDate).setDate(fromDate.getDate() + dateStep);
			datesLabels.push(new Date(nextDate));
		}

		return datesLabels;
	}

	buildChart() {
		const transactionsForSelectedPeroid = [...this.chartData.transactionsForPeriod];
		if (transactionsForSelectedPeroid.length === 0) {
			this.onEmptyDashboardData.emit(true);
		}
		const selectedPeriodEdgeDates = [...this.buildChartLabels()];
		const labels = selectedPeriodEdgeDates.reduce((dateList, date) => {
			dateList.push(new Date(date).toLocaleString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
			return dateList;
		}, []);
		const subPeriods = [...selectedPeriodEdgeDates].reduce((datesList, date, index) => {
			datesList.push({ from: date, to: selectedPeriodEdgeDates[index + 1] || new Date(this.chartData.dashboardPeriod.to) })
			return datesList;
		}, []);
		const transactionsBySubperiods = [...transactionsForSelectedPeroid].reduce((transactionsList, transactionObj) => {
			const transactions = [];
			subPeriods.forEach(period => {
				transactions.push(transactionObj.transactions.filter(transaction => (new Date(transaction.date) >= period.from) && (new Date(transaction.date) < period.to)));
			});
			transactionsList.push({ category: transactionObj.category, transactions: transactions });

			return transactionsList;
		}, []);
		const transactionsWithSumBySubperiods = transactionsBySubperiods.reduce((transactionsList, transaction) => {
			const transactionsSums = transaction.transactions.reduce((transactionsList, transaction) => {
				transactionsList.push(this.dataService.countCategoryTransactionsTotal(transaction, `sum`));
				return transactionsList;
			}, []);

			transactionsList.push({ category: transaction.category, transactions: transactionsSums });
			return transactionsList;
		}, []);

		const datasets = transactionsWithSumBySubperiods.reduce((dataList, transaction) => {
			dataList.push({
				label: transaction.category.toUpperCase(),
				data: transaction.transactions,
				fill: false,
				borderColor: this.dataService.getRandomColor(),
				backgroundColor: this.dataService.getRandomColor(),
			});
			return dataList;
		}, []);

		const dataToCheckEmptySum = datasets.reduce((tableDataList, tableDataItem) => {
			tableDataList = [...tableDataList, ...tableDataItem.data];
			return tableDataList;
		}, []);

		if (dataToCheckEmptySum.reduce(function (acc, exp) { return exp + acc }, 0) === 0) {
			this.onEmptyDashboardData.emit(true);
			return;
		}

		this.chart = new Chart('canvas', {
			type: 'line',
			data: {
				labels: labels,
				datasets: datasets
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
				},
				responsive: true,
				maintainAspectRatio: true,
			}
		});
	}
}
