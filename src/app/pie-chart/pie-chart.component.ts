import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartData } from '../interfaces';
import { DataService } from '../data.service';
import { BalanceService } from '../balance.service';


@Component({
	selector: 'app-pie-chart',
	templateUrl: './pie-chart.component.html',
	styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
	@Input() chartData: ChartData;
	@Output()
	onEmptyDashboardData: EventEmitter<any> = new EventEmitter<any>();
	chart: any;

	constructor(
		private dataService: DataService,
		private balanceService: BalanceService,

	) { }

	ngOnInit() {
		if (this.chartData) {
			this.buildChart();
		}
	}

	buildChart() {
		const transactionsForSelectedPeroid = [...this.chartData.transactionsForPeriod];
		const labels = transactionsForSelectedPeroid.reduce((transactionList, transaction) => {
			transactionList.push(transaction.category);
			return transactionList;
		}, []);
		const data = transactionsForSelectedPeroid.reduce((transactionList, transaction) => {
			const transactionsSum = this.balanceService.countCategoryTransactionsSum(transaction.transactions, `sum`);
			transactionList.push(transactionsSum);
			return transactionList;
		}, []);
		if (data.reduce(function (acc, exp) { return exp + acc }, 0) === 0) {
			this.onEmptyDashboardData.emit(true);
			return;
		}
		const chartColors = transactionsForSelectedPeroid.reduce((transactionList, transaction) => {
			transactionList.push(this.dataService.getRandomColor());
			return transactionList;
		}, []);

		this.chart = new Chart('canvas', {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					data: data,
					backgroundColor: chartColors,
					borderWidth: 1
				}]
			},
			options: {
				legend: {
					display: true,
					// labels: {
					// 	fontColor: 'white'
					// }
				},
				responsive: true,
				maintainAspectRatio: true
			}
		});
	}
}
