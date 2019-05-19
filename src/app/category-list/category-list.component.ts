import { Component, OnInit } from '@angular/core';
import { Category } from '../category';

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

  constructor() { }

  ngOnInit() {
    console.log('local storage ', localStorage.getItem('token'));
  }

  onSelect(category: Category): void {
    this.categoryList = false;
    this.selectedCategory = category;
  }

}
