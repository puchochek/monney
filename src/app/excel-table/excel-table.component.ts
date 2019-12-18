import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartData } from '../interfaces';
import { ExcelService } from '../excel.service';
import { DataService } from '../data.service';
import { BalanceService } from '../balance.service';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-excel-table',
	templateUrl: './excel-table.component.html',
	styleUrls: ['./excel-table.component.scss']
})
export class ExcelTableComponent implements OnInit {
	@Input() chartData: ChartData;
	@Output()
	onEmptyDashboardData: EventEmitter<any> = new EventEmitter<any>();

	tableData: any = [];
	headers: string[] = [`CATEGORY`, `DATE`, `SUM`, `TOTAL`];
	helloMessage: string;
	noTransactionMessage = `You do not have
	transactions for the selected period. You might choose another dates to check.`;
	private sbscr: Subscription;

	constructor(
		private excelService: ExcelService,
		private dataService: DataService,
		private balanceService: BalanceService,


	) { }

	ngOnInit() {
		if (this.chartData) {
			console.log('---> EXcEL chartData ', this.chartData);
			this.helloMessage = `Hi, ${this.chartData.user.name}!`;
			this.buildTable();
		}
		this.sbscr = this.excelService._saveAsExcelEvent.subscribe((response) => {
			console.log('---> EXCEL _saveAsExcelEvent ', response);
			if (response) {
				this.exportAsXLSX();
			}
		});
	}

	ngOnDestroy() {
		if (this.sbscr) {
			this.sbscr.unsubscribe();
		}
	}

	buildTable() {
		const transactionsForSelectedPeroid = [...this.chartData.transactionsForPeriod];
		const tableDataOjects = transactionsForSelectedPeroid.reduce((dataList, dataItem) => {
			const tableDataItem = dataItem.transactions.reduce((dataItemsList, dataItemVal) => {
				dataItemsList.push({
					CATEGORY: dataItem.category.toUpperCase(),
					DATE: new Date(dataItemVal.date).toLocaleString('en', { year: 'numeric', month: 'short', day: 'numeric' }),
					SUM: dataItemVal.sum
				});
				return dataItemsList;
			}, []);
			dataList.push(tableDataItem);
			return dataList;
		}, []);

		const tableDataOjectsWithTotal = tableDataOjects.reduce((tableDataList, tableDataItems) => {
			const transactionsSum = this.balanceService.countCategoryTransactionsSum(tableDataItems, 'SUM');
			const transactionsWithTotal = tableDataItems.reduce((tableDataItemsList, tableDataItemValue, index) => {
				const lastTableDataItemIndex = tableDataItems.length - 1;
				if (index === lastTableDataItemIndex) {
					tableDataItemValue.TOTAL = transactionsSum;
				} else {
					tableDataItemValue.TOTAL = ' ';
				}
				tableDataItemsList.push(tableDataItemValue);
				return tableDataItemsList;
			}, []);
			tableDataList.push(transactionsWithTotal);
			return tableDataList;
		}, []);
		this.tableData = tableDataOjectsWithTotal.reduce((tableDataList, tableDataItem) => {
			tableDataList = [...tableDataList, ...tableDataItem];
			return tableDataList;
		}, []);
		console.log('---> this.tableData ', this.tableData);
		if (this.tableData.length === 0) {
			this.onEmptyDashboardData.emit(true);
		}
	}

	exportAsXLSX() {
		const fromDate = new Date(this.chartData.dashboardPeriod.from).toLocaleString('en', { year: 'numeric', month: 'short', day: 'numeric' });
		const toDate = new Date(this.chartData.dashboardPeriod.to).toLocaleString('en', { year: 'numeric', month: 'short', day: 'numeric' });
		const fileName = `Transactions for a period from ${fromDate} to ${toDate}`;

		this.excelService.exportAsExcelFile(this.tableData, fileName);
	}

}
