import { Component, OnInit, Input, Inject } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { FormControl } from '@angular/forms';
import { FinanceData } from '../interfaces';
import { Category } from '../interfaces';
import { LoggedUser } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment'

@Component({
	selector: 'app-add-category-modal',
	templateUrl: './add-category-modal.component.html',
	styleUrls: ['./add-category-modal.component.scss']
})
export class AddCategoryModalComponent implements OnInit {
	@Input() name: string;
	@Input() description: string;

	title: string = `Add a new expense category`;
	categoryToUpdate: Category;
	//currentUser: LoggedUser;

	constructor(
		private dataService: DataService,
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
		private snackBar: MatSnackBar,
	) { }

	ngOnInit() {
		this.dataService.categoryToUpsert.subscribe((response) => {
			console.log('---> response ', response );
			if (response) {
				this.categoryToUpdate = <Category>response;
			}
		});
	}

	onSubmit() {
		console.log('---> this.categoryToUpsert ', this.categoryToUpdate);
		if (this.categoryToUpdate) {
			console.log('---> this.categoryToUpsert ', this.categoryToUpdate);
			const categoryToUpsert = {
				user : this.categoryToUpdate.user,
				description : this.description,
				id : this.categoryToUpdate.id,
				name : this.name,
				categoryIndex : this.categoryToUpdate.categoryIndex,
				isActive : this.categoryToUpdate.isActive,
				isIncome : this.categoryToUpdate.isIncome
			}
			this.upsertCategory(categoryToUpsert);
		} else {
			console.log('---> else' );
			const categoryToUpsert = {
				user : localStorage.getItem(`userId`),
				description : this.description,
				name : this.name,
				isActive : true,
				isIncome : false
			}
			this.upsertCategory(categoryToUpsert);
		}
	}

	upsertCategory(categoryToUpsert: any) {
		let snackMessage: string;
		let action: string;
		const url = `${environment.apiBaseUrl}/category/upsert`;
		const categoryToUpsertBulk = [categoryToUpsert];
		this.http.post(url, {
			categoriesToUpsert: categoryToUpsertBulk
		}, { observe: 'response' })
			.subscribe(
				response => {
					snackMessage = 'Done';
					action = `OK`;
					this.snackBar.open(snackMessage, action, {
						duration: 5000,
					});
					const upsertedCategory = <Category>response.body;
					this.dataService.updateToken(response.headers.get('Authorization'));
					this.router.navigate(['/home']);
				},
				error => {
					console.log('---> ADD CATEGORY error ', error);
					snackMessage = 'Oops!';
					action = `Try again`;
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}
}
