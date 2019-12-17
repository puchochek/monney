import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	private readonly theme = new BehaviorSubject<string>(null);
	readonly _theme = this.theme.asObservable();

	public DEFAULT_THEME = `https://res.cloudinary.com/dsiwkaugw/image/upload/v1576561300/wooden-theme_slzmx2.jpg`;
	public ASSETS_LIST: string[] = [
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576564427/purple-wall_ferxf4.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576564288/green-wall_d3o2ya.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576563871/red-black-theme_i1acig.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576563687/blue-water-theme_kwyjqe.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576563248/color-blob-theme_rrgtlp.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576563080/wave-theme_guvwpg.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576562761/space-theme_x8ryrv.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576562228/reg-wall-theme_jlwbe0.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576562090/dark-blue-blob-theme_lprpkz.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576561779/leaf-theme_j3wlsb.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576561414/dark-theme_izpgl6.jpg`,
		`https://res.cloudinary.com/dsiwkaugw/image/upload/v1576561300/wooden-theme_slzmx2.jpg`
	];

	constructor() { }

	get appTheme(): string {
		return this.theme.getValue();
	}

	set appTheme(userTheme: string) {
		this.theme.next(userTheme);
	}

	checkIfThemeExist(theme: string): boolean {
		let isThemeValid = false;
		this.ASSETS_LIST.forEach(asset => {
			if (asset.includes(theme)) {
				isThemeValid = true;
			}
		});
		return isThemeValid;
	}

}
