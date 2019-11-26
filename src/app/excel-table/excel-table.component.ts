import { Component, OnInit, Input } from '@angular/core';
import { ChartData } from '../interfaces';
import { ExcelService } from '../excel.service';

@Component({
	selector: 'app-excel-table',
	templateUrl: './excel-table.component.html',
	styleUrls: ['./excel-table.component.scss']
})
export class ExcelTableComponent implements OnInit {
	@Input() chartData: ChartData;

	tableData: any = [];

	constructor(
		private excelService: ExcelService,
	) { }

	ngOnInit() {
		if (this.chartData) {
			console.log('---> EXcEL ', this.chartData);
			this.buildTable();
		}
	}

	buildTable() {
		const transactionsForSelectedPeroid = [...this.chartData.transactionsForPeriod];
		console.log('---> transactionsForSelectedPeroid exel  ', transactionsForSelectedPeroid );
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

		this.tableData = tableDataOjects.reduce((tableDataList, tableDataItem) => {
			tableDataList = [...tableDataList, ...tableDataItem];
			return tableDataList;
		}, []);
		console.log('---> this.tableData ', this.tableData );

		this.exportAsXLSX()
	}

	exportAsXLSX() {
		this.excelService.exportAsExcelFile(this.tableData, 'sample');
	}

}
