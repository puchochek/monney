export interface FinanceData {
	comment: string;
	date: string;
	id: string;
	sum: string;
	category: string;
	userId: string;
	isDeleted: boolean;
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
	isIncome: boolean;
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
	expences: FinanceData[];
}