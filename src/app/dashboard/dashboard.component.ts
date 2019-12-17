import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { DataService } from '../data.service';
import { DashboardConfig } from '../interfaces';
import { ChartData } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcelService } from '../excel.service';



@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	private sbscr: Subscription;
	dashboardConfig: DashboardConfig;
	chart: any;
	isPieChart: boolean;
	isAreaChart: boolean;
	isBarChart: boolean;
	isExelTable: boolean;
	chartData: ChartData;
	noTransactionsForSelectedPeriod: boolean;
	noTransactionsMessage: string;
	backBtnLbl: string = `Back`;
	saveAsBtnLbl: string;
	emptyDahboardMessage: string = `You do not have
	transactions for the selected period. You might choose another dates to check.`;

	constructor(
		private router: Router,
		private dashboardServise: DashboardService,
		private dataService: DataService,
		private snackBar: MatSnackBar,
		private excelService: ExcelService,
	) { }

	ngOnInit() {
		document.getElementById(`empty-dashboard-message`).style.display = `none`;
		this.sbscr = this.dashboardServise._dashboardSettings.subscribe((response) => {
			console.log('---> DASHBOARD  _dashboardSettings ', response);
			if (response) {
				this.dashboardConfig = response;
				const transactionsForSelectedCategories = this.defineSelectedCategoriesTransactions();
				const selectedPeriodTransactions = this.defineSelectedPeriodTransactions(transactionsForSelectedCategories);
				this.chartData = { ...this.dashboardConfig, transactionsForPeriod: selectedPeriodTransactions };
				if (this.dashboardConfig.dashboardType === `pie_chart`) {
					this.isPieChart = true;
					this.saveAsBtnLbl = `Save as PDF`;
				}
				if (this.dashboardConfig.dashboardType === `multiline_chart`) {
					this.isAreaChart = true;
					this.saveAsBtnLbl = `Save as PDF`;
				}
				if (this.dashboardConfig.dashboardType === `bar_chart`) {
					this.isBarChart = true;
					this.saveAsBtnLbl = `Save as PDF`;
				}
				if (this.dashboardConfig.dashboardType === `table_chart`) {
					this.isExelTable = true;
					this.saveAsBtnLbl = `Save as Excel`;
				}
			} else {
				this.router.navigate(['/dashboard-config']);
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
		const fromDate = this.dashboardConfig.dashboardPeriod.from;
		const toDate = this.dashboardConfig.dashboardPeriod.to;
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

	handleSaveAsBtnClick(event) {
		if (event.target.innerHTML === `Save as Excel`) {
			this.excelService.isSaveAsExcelClicked = true;
		} else {
			this.saveDashboardSaPDF();
		}
	}

	saveDashboardSaPDF() {
		const canvas = document.getElementById('canvas');
		html2canvas(canvas).then(canvas => {
			const imgWidth = 600;
			const pageHeight = 300;
			const imgHeight = canvas.height * imgWidth / canvas.width;
			const heightLeft = imgHeight;
			const contentDataURL = canvas.toDataURL('image/png');

			const pdf = new jspdf('l', 'px', 'a4'); // A4 size page of PDF
			const position = 20;
			const fromDate = new Date(this.dashboardConfig.dashboardPeriod.from).toLocaleString('en', { year: 'numeric', month: 'short', day: 'numeric' });
			const toDate = new Date(this.dashboardConfig.dashboardPeriod.to).toLocaleString('en', { year: 'numeric', month: 'short', day: 'numeric' });
			pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
			pdf.text(10, 10, `Transactions for a period from ${fromDate} to ${toDate}.pdf`);

			pdf.save(`Transactions for a period from ${fromDate} to ${toDate}.pdf`, { returnPromise: true }).then(() => {
				const snackMessage = 'Done';
				const action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
			}
			);
		});
	}

	handleEmptyDashboardData(isEmptyDashboardData) {
		if (isEmptyDashboardData) {
			document.getElementById(`empty-dashboard-message`).style.display = `inline`;
			document.getElementById(`save-as-btn`).classList.add('save-as-btn-disabled');
		}
	}
}
