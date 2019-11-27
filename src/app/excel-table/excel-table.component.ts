import { Component, OnInit, Input } from '@angular/core';
import { ChartData } from '../interfaces';
import { ExcelService } from '../excel.service';
import { DataService } from '../data.service';

import { Subscription } from 'rxjs';


@Component({
	selector: 'app-excel-table',
	templateUrl: './excel-table.component.html',
	styleUrls: ['./excel-table.component.scss']
})
export class ExcelTableComponent implements OnInit {
	@Input() chartData: ChartData;

	tableData: any = [];
	private sbscr: Subscription;

	constructor(
		private excelService: ExcelService,
		private dataService: DataService,

	) { }

	ngOnInit() {
		if (this.chartData) {
			console.log('---> EXcEL chartData ', this.chartData);
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
			const transactionsSum = this.dataService.countCategoryTransactionsTotal(tableDataItems, 'SUM');
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
	}

	exportAsXLSX() {
		const fromDate = new Date(this.chartData.dashboardPeriod.from).toLocaleString('en', { year: 'numeric', month: 'short', day: 'numeric' });
		const toDate = new Date(this.chartData.dashboardPeriod.to).toLocaleString('en', { year: 'numeric', month: 'short', day: 'numeric' });
		const fileName = `Transactions for a period from ${fromDate} to ${toDate}`;

		this.excelService.exportAsExcelFile(this.tableData, fileName);
	}

}
