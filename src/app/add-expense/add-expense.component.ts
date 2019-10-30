import { Component, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { FormControl } from '@angular/forms';
import { FinanceData } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
	selector: 'app-add-expense',
	templateUrl: './add-expense.component.html',
	styleUrls: ['./add-expense.component.scss'],
	providers: []
})
export class AddExpenseComponent implements OnInit {

	@Input() sum: number;
	@Input() comment: string;

	category: string;
	status: string;
	isInvalidInput: boolean;
	invalidInputMessage: string;
	dateShiftRight: number;
	message: string;
	savedExpense: FinanceData;

	date = new FormControl(new Date());
	serializedDate = new FormControl((new Date()).toISOString());
	maxDate = new Date();
	// minDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);

	constructor(
		private dataService: DataService,
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
		private snackBar: MatSnackBar,
	) { }
	//TODO mobile view!!!
	ngOnInit() {
		const selectedCategory = this.route.snapshot.paramMap.get('category');
		this.category = selectedCategory;
	}

	onSubmit() {
		const newExpence = {
			sum: this.sum,
			comment: this.comment,
			type: this.category,
			date: this.date.value,
		};
		console.log('---> newExpence ', newExpence);
		if (this.validateSum(newExpence.sum)) {
			console.log('---> sum is valid ', this.sum);
			this.saveNewExpence(newExpence);
		}
	}

	closeModal(event) {
		// this.isNewExpenseFormShown = true;
		// this.isModalShown = false;
		if (event.value === 'saved') {
			this.router.navigate(['/categories']);
		}
	}

	hideErrorMessage() {
		this.isInvalidInput = false;
	}

	validateSum(sum: number): boolean {
		if (isNaN(sum) || (!sum)) {
			this.isInvalidInput = true;
			return false;
		} else {
			this.isInvalidInput = false;
			return true;
		}
	}

	saveNewExpence(newExpence: any) {
		// console.log('newExpence Obj in Post', newExpence);
		let snackMessage: string;
		let action: string;
		const userId = localStorage.getItem('userId');
		const categoryId = this.route.snapshot.paramMap.get('categoryId');
		const url = `http://localhost:3000/expence`;
		this.http.post(url, {
			type: newExpence.type,
			date: newExpence.date,
			sum: newExpence.sum,
			comment: newExpence.comment,
			userId: userId,
			categoryId: categoryId
		}, { observe: 'response' }
		).subscribe(
			response => {
				this.status = 'Done';
				snackMessage = this.status;
				action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				this.savedExpense = <FinanceData>response.body;
				console.log('---> SAVE EXP savedExpense ', this.savedExpense);
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.router.navigate(['/categories']);
			},
			error => {
				console.log('---> SAVE EXPENSE ERROR ', error);
				this.status = 'Oops!';
				snackMessage = this.status;
				action = `Try again`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

}
