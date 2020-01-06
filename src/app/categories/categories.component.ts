import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUser, Category } from '../interfaces';
import { CategoryService } from '../category.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
	@Input() currentUser: ApplicationUser;

	categories: Category[];
	noCategoriesMessage: string;
	lastExpenceValue: number;
	expenceTotalValue: number;

	addCategoryBtn: string = `add category`;
	lastExpenceLbl: string = `last:`;
	expenceTotalLbl: string = `total: `;
	categoriesHeaderLbl: string = `categories`;
	categoryMenuItems = [
		{ name: `Add category`, action: this.addCategory.bind(this) },
		// { name: `Log out`, action: this.logOut.bind(this) }
	];

	constructor(
		private categoryService: CategoryService,
		private router: Router,
	) { }

	ngOnInit() {
		console.log('---> currentUser ', this.currentUser);
		this.categories = this.categoryService.getExpencesCategories(this.currentUser.categories);
		this.noCategoriesMessage = `Hello, ${this.currentUser.name}. You don't have an expences categories yet. It would be great to add some to keep your expences in order.`;
	}

	addCategory(event) {
		this.router.navigate(['/category/add']);
	}

	addExpence(event) {
		const categoryName = event.srcElement.id;
		this.router.navigate([`/${categoryName}/add`]);
	}

}