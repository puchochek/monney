export interface FinanceData {
	comment: string;
	date: string;
	id: string;
	sum: string;
	type: string;
}

export interface Category {
	user: string;
	description: string;
	id: string;
	name: string;
	categoryIndex: number;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
}

export interface ExpencesData {
	category: string;
	expences: FinanceData[];
	total: number;
}

export interface LoggedUser {
	id: string;
	password: string;
	name: string;
	email: string;
	isConfirmed: boolean;
	categories: Category[];
}