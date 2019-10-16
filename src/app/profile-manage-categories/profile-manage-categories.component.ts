import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { FinanceData } from '../interfaces';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';

@Component({
	selector: 'app-profile-manage-categories',
	templateUrl: './profile-manage-categories.component.html',
	styleUrls: ['./profile-manage-categories.component.scss']
})
export class ProfileManageCategoriesComponent implements OnInit {
	@Input() appUser: LoggedUser;

	greetingMessage: string;
	noCategoriesMessage: string;
	newCategoryBtnLbl: string;
	categories: FinanceData[];
	dialogRef: MatDialogRef<AddCategoryModalComponent>;

	constructor(
		private http: HttpClient,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.greetingMessage = `Hello, ${this.appUser.name}!`;
		this.noCategoriesMessage = `It looks like you don't have any expense categories yet.
		It would be gread to add some to keep your expenses in order.`;
		this.newCategoryBtnLbl = `Add category`;
		//console.log('---> appUser ', this.appUser );
		// 	const userId = localStorage.getItem('userId');
		// 	console.log('---> userId ', userId);
		// 	this.http.get('http://localhost:3000/user/' + userId).subscribe((response: LoggedUser[]) => {
		// 		console.log('---> response ', response);
		//   //this.setExpensesByCategory(response);
		// });
	}

	openAddCategoryModal() {
		this.dialogRef = this.dialog.open(AddCategoryModalComponent);
		this.dialogRef
			.afterClosed()
			//TODO save category by name
			.subscribe(name => console.log('---> name ', name ));
	}


}
