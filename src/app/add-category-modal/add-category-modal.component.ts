import { Component, OnInit, Input, Inject } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Category } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectMediaComponent } from '../select-media/select-media.component';
import { environment } from '../../environments/environment';
import { UserService } from '../user.service';



@Component({
	selector: 'app-add-category-modal',
	templateUrl: './add-category-modal.component.html',
	styleUrls: ['./add-category-modal.component.scss']
})
export class AddCategoryModalComponent implements OnInit {
	@Input() name: string;
	@Input() description: string;

	mediaIconDialogRef: MatDialogRef<SelectMediaComponent>;

	title: string;
	icon: string;
	noIconMessage: string = `No icon selected`;
	categoryToUpdate: Category;
	categoryIconName: string;

	constructor(
		private dataService: DataService,
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
		private snackBar: MatSnackBar,
		private dialog: MatDialog,
		private userService: UserService,
	) { }

	ngOnInit() {
		const isEdit = this.route.snapshot.paramMap.get('action') === `edit` ? true : false;
		if (isEdit) {
			const categoryToEdit = this.route.snapshot.paramMap.get('category');
			this.http.get(`${environment.apiBaseUrl}/category/` + categoryToEdit).subscribe((response: Category) => {
				this.categoryToUpdate = <Category>response;
				this.title = `Edit category`;
				this.setInitialCategoryValues();
			});
		} else {
			this.title = `Add an expense category`;
		}
	}

	setInitialCategoryValues() {
		if (this.categoryToUpdate.name) {
			this.name = this.categoryToUpdate.name;
		}
		if (this.categoryToUpdate.description) {
			this.description = this.categoryToUpdate.description;
		}
		if (this.categoryToUpdate.icon) {
			this.icon = this.categoryToUpdate.icon;
		}
	}

	onSubmit() {
		if (this.categoryToUpdate) {
			const categoryToUpsert = {
				user: this.categoryToUpdate.user,
				description: this.description,
				id: this.categoryToUpdate.id,
				name: this.name,
				categoryIndex: this.categoryToUpdate.categoryIndex,
				isActive: this.categoryToUpdate.isActive,
				isIncome: this.categoryToUpdate.isIncome,
				icon: this.categoryIconName
			}
			this.upsertCategory(categoryToUpsert);
		} else {
			const categoryToUpsert = {
				user: localStorage.getItem(`userId`),
				description: this.description,
				name: this.name,
				isActive: true,
				isIncome: false,
				icon: this.categoryIconName
			}
			this.upsertCategory(categoryToUpsert);
		}
	}

	openSelectIconComponent() {
		this.mediaIconDialogRef = this.dialog.open(SelectMediaComponent);
		this.mediaIconDialogRef
			.afterClosed()
			.subscribe(name => {
				if (name) {
					this.categoryIconName = name;
					this.icon = name;
				}
			});
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
					this.userService.updateUserCategories(<Category[]>response.body);
					this.dataService.updateToken(response.headers.get('Authorization'));
					this.router.navigate(['/home']);
				},
				error => {
					console.log('---> ADD CATEGORY error ', error);
					snackMessage = 'Oops!';
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
