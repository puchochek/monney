import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { Category } from '../interfaces';

@Component({
	selector: 'app-category-list',
	templateUrl: './category-list.component.html',
	styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
	categoryList = true;
	selectedCategory: Category;
	// categories = [
	// 	{ id: 1, name: 'Dinners' },
	// 	{ id: 2, name: 'Household' },
	// 	{ id: 3, name: 'Fare' },
	// 	{ id: 4, name: 'Sport' },
	// 	{ id: 5, name: 'Hobbies' },
	// 	{ id: 6, name: 'Clothes' },
	// 	{ id: 7, name: 'Rest' },
	// 	{ id: 8, name: 'Other' }
	// ];

	columns: number;
	categories: Category[];

	constructor(
		private http: HttpClient
	) { }

	ngOnInit() {
		this.defineScreenWeight();
		//this.columns = 3;
		const userId = localStorage.getItem('userId');
		console.log('local storage token', localStorage.getItem('token'));
		console.log('local storage userId', localStorage.getItem('userId'));
		this.http.get('http://localhost:3000/category/' + userId).subscribe((response: Category[]) => {
			console.log('---> response ', response);
			this.defineColumnsNumber(response);
			this.categories = response;
		});
	}

	defineScreenWeight() {
		let headerHeight = document.getElementById('header').offsetHeight;
		let viewHeight = window.innerHeight;
		document.getElementById('categories-list').style.height = viewHeight - headerHeight + 'px';
	}

	defineColumnsNumber(categories: Category[]) {
		const categoriesNumber = categories.length;
		console.log('---> categoriesNumber ', categoriesNumber);

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

	onSelect(category: Category): void {
		this.categoryList = false;
		this.selectedCategory = category;
	}

}
