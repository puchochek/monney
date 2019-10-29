import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
	categoryList = true;
	selectedCategory: Category;
	columns: number;
	categories: Category[];

	constructor(
		private http: HttpClient,
		private router: Router,
		private dataService: DataService,
	) { }

	ngOnInit() {
		this.defineScreenWeight();
		const userId = localStorage.getItem('userId');
		const url = `http://localhost:3000/category/${userId}`;
		this.http.get(url, { observe: 'response' })
			.subscribe(
				response => {
					console.log('---> category list response ', response.body);
					this.defineColumnsNumber(<Category[]>response.body);
					this.categories = this.setInitialCategoriesOrder(<Category[]>response.body);
					this.dataService.updateToken(response.headers.get('Authorization'));
				},
				error => {
					console.log('---> CATEGORY_LIST error ', error);
					this.router.navigate(['/hello-monney']);
					this.dataService.cleanLocalstorage();
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);
	}

	setInitialCategoriesOrder(currentUserCategories: Category[]): Category[] {
		const sortedCategories = currentUserCategories.sort((a, b) => {
			if (a.categoryIndex > b.categoryIndex)
				return 1
			else
				return -1
		})
		return sortedCategories;
	}

	defineScreenWeight() {
		let headerHeight = document.getElementById('header').offsetHeight;
		let viewHeight = window.innerHeight;
		document.getElementById('categories-list').style.height = viewHeight - headerHeight + 'px';
	}

	defineColumnsNumber(categories: Category[]) {
		const categoriesNumber = categories.length;

		switch (true) {
			case (categoriesNumber <= 5):
				this.columns = 1;
				break;
			case (categoriesNumber <= 10):
				this.columns = 2;
				break;
			case (categoriesNumber <= 15):
				this.columns = 3;
				break;
			case (categoriesNumber <= 20):
				this.columns = 4;
				break;
			case (categoriesNumber <= 25):
				this.columns = 5;
				break;
			case (categoriesNumber <= 30):
				this.columns = 6;
				break;
			case (categoriesNumber <= 35):
				this.columns = 7;
			case (categoriesNumber <= 40):
				this.columns = 8;
				break;
			default:
				this.columns = 1;
				break;
		}
	}

	onDragOver(event) {
		if (event.preventDefault) { event.preventDefault(); }
		if (event.stopPropagation) { event.stopPropagation(); }
	}

	onDragStart(event) {
		event
			.dataTransfer
			.setData('text', event.target.id);

		event
			.currentTarget
			.style
			.opacity = '0.5';
	}

	onDrop(event) {
		if (event.preventDefault) { event.preventDefault(); }
		if (event.stopPropagation) { event.stopPropagation(); }

		const id = event
			.dataTransfer
			.getData('text');

		const draggableElement = document.getElementById(id);
		if (!draggableElement) {
			event
				.currentTarget
				.style
				.opacity = '1';
			return;
		}
		const dropzone = event.target;
		const categoriesBeforeDrag = [...this.categories];
		const categoriesAfterDrag = [...this.categories];
		const draggedItemIndex = this.categories.findIndex(category => category.name === id);
		const targetItemIndex = this.categories.findIndex(category => category.name === dropzone.id);

		categoriesAfterDrag[draggedItemIndex] = categoriesBeforeDrag[targetItemIndex];
		categoriesAfterDrag[targetItemIndex] = categoriesBeforeDrag[draggedItemIndex];

		this.categories = [...categoriesAfterDrag];
		this.reorderCategories(draggedItemIndex, targetItemIndex);

		event
			.currentTarget
			.style
			.opacity = '1';

		draggableElement
			.style
			.opacity = '1';

		event
			.dataTransfer
			.clearData();
	}

	reorderCategories(draggedItemIndex: number, targetItemIndex: number) {
		const url = `http://localhost:3000/category/reorder`;
		const userId = localStorage.getItem('userId');
		this.http.post(url, {
			userId: userId,
			draggedItemIndex: draggedItemIndex,
			targetItemIndex: targetItemIndex,
		}, { observe: 'response' })
			.subscribe(
				response => {
					const upsertedCategories = <Category[]>response.body;
					console.log('---> upsertedCategories ', upsertedCategories);
					this.dataService.updateToken(response.headers.get('Authorization'));
				},
				error => {
					console.log('---> CATEGORIES LIST error ', error);
				},
				() => {
					// 'onCompleted' callback.
					// No errors, route to new page here
				}
			);

	}

	onSelect(category: Category): void {
		this.categoryList = false;
		this.selectedCategory = category;
	}

}
