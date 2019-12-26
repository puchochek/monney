export interface ApplicationUser {
	id?: string;
	password?: string;
	name: string;
	email: string;
	isConfirmed: boolean;
	provider: string;
}