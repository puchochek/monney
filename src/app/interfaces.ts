export interface ApplicationUser {
	id?: string;
	password?: string;
	name: string;
	email: string;
	isConfirmed: boolean;
	provider: string;
	avatar?: string;
	categories: Category[];
}

export interface LoginUser {
	email: string;
	password: string;
}

export interface Transaction {

}

export interface Category {
	id?: string;
	name: string;
	description: string;
	user: string;
	isDeleted: boolean;
	isIncome: boolean;
	transactions: Transaction[];

}