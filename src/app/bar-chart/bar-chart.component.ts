import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartData } from '../interfaces';
import { DataService } from '../data.service';

@Component({
	selector: 'app-bar-chart',
	templateUrl: './bar-chart.component.html',
	styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
	@Input() chartData: ChartData;
	chart: any;

	constructor(
		private dataService: DataService,
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
			const transactionsSum = this.dataService.countCategoryTransactionsTotal(transaction.transactions, `sum`);
			transactionList.push(transactionsSum);
			return transactionList;
		}, []);

		const chartColors = data.reduce((dataList, dataItem) => {
			dataList.push(this.dataService.getRandomColor());
			return dataList;
		}, []);

		this.chart = new Chart('canvas', {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						backgroundColor: chartColors,
						data: data
					}
				]
			},
			options: {
				legend: {
					display: false
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
