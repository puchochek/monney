import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
	providedIn: 'root'
})
export class ExcelService {
	private readonly saveAsExcelEvent = new BehaviorSubject<any>(null);
	readonly _saveAsExcelEvent = this.saveAsExcelEvent.asObservable();

	constructor() { }

	get isSaveAsExcelClicked(): any {
		return this.saveAsExcelEvent.getValue();
	}

	set isSaveAsExcelClicked(isSaveAsExcelClicked: any) {
		this.saveAsExcelEvent.next(isSaveAsExcelClicked);
	}

	public exportAsExcelFile(json: any[], excelFileName: string) {
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		this.saveAsExcelFile(excelBuffer, excelFileName);

	}
	private saveAsExcelFile(buffer: any, fileName: string) {
		const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
		FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
	}

}
