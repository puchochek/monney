import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

@Component({
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
	@Input() appUser: LoggedUser;


	// categoryList = true;
	// selectedCategory: Category;
	// columns: number;
	categories: Category[];
	columns: string =  `3`;
	// test: string = `fit`;

	constructor(
		private http: HttpClient,
		private router: Router,
		private dataService: DataService,
	) { }

	ngOnInit() {
		console.log('---> appUser CatList ', this.appUser);
		this.buildCategoriesList();
		//this.defineScreenHeight();
		// 	const userId = localStorage.getItem('userId');
		// 	const url = `${environment.apiBaseUrl}/category/${userId}`;
		// 	this.http.get(url, { observe: 'response' })
		// 		.subscribe(
		// 			response => {
		// 				console.log('---> category list response ', response.body);
		// 				this.defineColumnsNumber(<Category[]>response.body);
		// 				this.categories = this.setInitialCategoriesOrder(<Category[]>response.body);
		// 				this.dataService.updateToken(response.headers.get('Authorization'));
		// 			},
		// 			error => {
		// 				console.log('---> CATEGORY_LIST error ', error);
		// 				this.router.navigate(['/hello-monney']);
		// 				this.dataService.cleanLocalstorage();
		// 			},
		// 			() => {
		// 				// 'onCompleted' callback.
		// 				// No errors, route to new page here
		// 			}
		// 		);
	}

	buildCategoriesList() {
		const addNewCategoryItem = { name: `add new category`, initials: `NC`, routerLink: ``, id: ``, color: `white`, bgColor: `#8e8e8e` };
		if (this.appUser.categories) {
			const userExpenses = this.appUser.categories.filter(category => !category.isIncome);
			const userCategories = [...userExpenses, ...[addNewCategoryItem]];
			const categoriesWithInitials = this.setCategoriesInitials(userCategories);
			this.categories = categoriesWithInitials;
		} else {
			const userCategories = [addNewCategoryItem];
		}
		console.log('---> this.categories ',this.categories );
	}

	setCategoriesInitials(categories: any[]) {
		const categoriesWithInitials = categories.reduce((categoriesList, currentCategory) => {
			if (!currentCategory.initials) {
				currentCategory.initials = currentCategory.name.substring(0, 2);
			}
			if (!currentCategory.bgColor) {
				currentCategory.bgColor = `#8e8e8e`;
			}
			if (!currentCategory.color) {
				currentCategory.color = `white`;
			}
			categoriesList.push(currentCategory);
			return categoriesList;
		}, []);
		console.log('---> categoriesWithInitials ', categoriesWithInitials);
		return categoriesWithInitials;

	}

	// setInitialCategoriesOrder(currentUserCategories: Category[]): Category[] {
	// 	const sortedCategories = currentUserCategories.sort((a, b) => {
	// 		if (a.categoryIndex > b.categoryIndex)
	// 			return 1
	// 		else
	// 			return -1
	// 	})
	// 	return sortedCategories;
	// }

	// defineScreenHeight() {
	// 	let headerHeight = document.getElementById('header').offsetHeight;
	// 	let viewHeight = window.innerHeight;
	// 	document.getElementById('categories-list').style.height = viewHeight - headerHeight + 'px';
	// }

	// defineColumnsNumber(categories: Category[]) {
	// 	const categoriesNumber = categories.length;

	// 	switch (true) {
	// 		case (categoriesNumber <= 5):
	// 			this.columns = 1;
	// 			break;
	// 		case (categoriesNumber <= 10):
	// 			this.columns = 2;
	// 			break;
	// 		case (categoriesNumber <= 15):
	// 			this.columns = 3;
	// 			break;
	// 		case (categoriesNumber <= 20):
	// 			this.columns = 4;
	// 			break;
	// 		case (categoriesNumber <= 25):
	// 			this.columns = 5;
	// 			break;
	// 		case (categoriesNumber <= 30):
	// 			this.columns = 6;
	// 			break;
	// 		case (categoriesNumber <= 35):
	// 			this.columns = 7;
	// 		case (categoriesNumber <= 40):
	// 			this.columns = 8;
	// 			break;
	// 		default:
	// 			this.columns = 1;
	// 			break;
	// 	}
	// }

	// onDragOver(event) {
	// 	if (event.preventDefault) { event.preventDefault(); }
	// 	if (event.stopPropagation) { event.stopPropagation(); }
	// }

	// onDragStart(event) {
	// 	event
	// 		.dataTransfer
	// 		.setData('text', event.target.id);

	// 	event
	// 		.currentTarget
	// 		.style
	// 		.opacity = '0.5';
	// }

	// onDrop(event) {
	// 	if (event.preventDefault) { event.preventDefault(); }
	// 	if (event.stopPropagation) { event.stopPropagation(); }

	// 	const id = event
	// 		.dataTransfer
	// 		.getData('text');

	// 	const draggableElement = document.getElementById(id);
	// 	if (!draggableElement) {
	// 		event
	// 			.currentTarget
	// 			.style
	// 			.opacity = '1';
	// 		return;
	// 	}
	// 	const dropzone = event.target;
	// 	const categoriesBeforeDrag = [...this.categories];
	// 	const categoriesAfterDrag = [...this.categories];
	// 	const draggedItemIndex = this.categories.findIndex(category => category.name === id);
	// 	const targetItemIndex = this.categories.findIndex(category => category.name === dropzone.id);

	// 	categoriesAfterDrag[draggedItemIndex] = categoriesBeforeDrag[targetItemIndex];
	// 	categoriesAfterDrag[targetItemIndex] = categoriesBeforeDrag[draggedItemIndex];

	// 	this.categories = [...categoriesAfterDrag];
	// 	this.reorderCategories(draggedItemIndex, targetItemIndex);

	// 	event
	// 		.currentTarget
	// 		.style
	// 		.opacity = '1';

	// 	draggableElement
	// 		.style
	// 		.opacity = '1';

	// 	event
	// 		.dataTransfer
	// 		.clearData();
	// }

	// reorderCategories(draggedItemIndex: number, targetItemIndex: number) {
	// 	const url = `${environment.apiBaseUrl}/category/reorder`;
	// 	const userId = localStorage.getItem('userId');
	// 	this.http.post(url, {
	// 		userId: userId,
	// 		draggedItemIndex: draggedItemIndex,
	// 		targetItemIndex: targetItemIndex,
	// 	}, { observe: 'response' })
	// 		.subscribe(
	// 			response => {
	// 				const upsertedCategories = <Category[]>response.body;
	// 				console.log('---> upsertedCategories ', upsertedCategories);
	// 				this.dataService.updateToken(response.headers.get('Authorization'));
	// 			},
	// 			error => {
	// 				console.log('---> CATEGORIES LIST error ', error);
	// 			},
	// 			() => {
	// 				// 'onCompleted' callback.
	// 				// No errors, route to new page here
	// 			}
	// 		);

	// }

	// onSelect(category: Category): void {
	// 	this.categoryList = false;
	// 	this.selectedCategory = category;
	// }

}
