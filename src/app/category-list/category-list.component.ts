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
	categories = [
		{ id: 1, name: 'Dinners' },
		{ id: 2, name: 'Household' },
		{ id: 3, name: 'Fare' },
		{ id: 4, name: 'Sport' },
		{ id: 5, name: 'Hobbies' },
		{ id: 6, name: 'Clothes' },
		{ id: 7, name: 'Rest' },
		{ id: 8, name: 'Other' }
	];

	columns: number;

	constructor(
		private http: HttpClient
	) { }

	ngOnInit() {
		this.defineScreenWeight();
		this.columns = 2;
		const userId = localStorage.getItem('userId');
		console.log('local storage token', localStorage.getItem('token'));
		console.log('local storage userId', localStorage.getItem('userId'));
		this.http.get('http://localhost:3000/category/' + userId).subscribe((response: Category[]) => {
			console.log('---> response ', response );
		});
	}

	defineScreenWeight() {
		let headerHeight = document.getElementById('header').offsetHeight;
		let viewHeight =  window.innerHeight;
		document.getElementById('categories-list').style.height = viewHeight - headerHeight + 'px';

	}

	onSelect(category: Category): void {
		this.categoryList = false;
		this.selectedCategory = category;
	}

}
