import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';
import { FinanceData } from '../interfaces';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';
// import { CdkTableModule } from '@angular/cdk';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-profile-manage-categories',
	templateUrl: './profile-manage-categories.component.html',
	styleUrls: ['./profile-manage-categories.component.scss']
})
export class ProfileManageCategoriesComponent implements OnInit {

	displayedColumns: string[] = ['name', 'description'];
	@Input() appUser: LoggedUser;

	greetingMessage: string;
	noCategoriesMessage: string;
	newCategoryBtnLbl: string;
	status: string;
	categories: Category[];
	dialogRef: MatDialogRef<AddCategoryModalComponent>;

	@ViewChild(MatSort, {static: true}) sort: MatSort;
	dataSource = new MatTableDataSource(this.categories);

	constructor(
		private http: HttpClient,
		private dialog: MatDialog,
		private snackBar: MatSnackBar
	) { }



	ngOnInit() {
		this.greetingMessage = `Hello, ${this.appUser.name}!`;
		this.noCategoriesMessage = `It looks like you don't have any expense categories yet.
		It would be gread to add some to keep your expenses in order.`;
		this.newCategoryBtnLbl = `Add category`;

		this.categories = this.appUser.categories;
		this.dataSource.sort = this.sort;
	}

	openAddCategoryModal() {
		this.dialogRef = this.dialog.open(AddCategoryModalComponent);
		this.dialogRef
			.afterClosed()
			.subscribe(categoryForm => {
				const categoryToSave = {
					name: categoryForm.name,
					description: categoryForm.description,
					user: this.appUser.id
				};
				this.saveNewCategory(categoryToSave);
			});
	}

	saveNewCategory(categoryToSave: any) {
		let snackMessage: string;
		let action: string;
		this.http.post('http://localhost:3000/category', {
			name: categoryToSave.name,
			description: categoryToSave.description,
			user: categoryToSave.user,
		}).subscribe((result) => {
			console.log('---> SAVED CATEGORY ', result);
			if (result) {
				this.status = 'saved';
				snackMessage = this.status;
				action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
			} else {
				this.status = 'error';
				snackMessage = this.status;
				action = `Try again`;
			}
		});

		// this.http.get('http://localhost:3000/category/' + userId).subscribe((response: LoggedUser[]) => {
		// 	console.log('---> response ', response);
		// 	this.currentUser = response;
		// 	//this.setExpensesByCategory(response);
		// });
	}

}
