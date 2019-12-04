import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public DEFAULT_THEME = `dark-theme`;
  public ASSETS_LIST: string[] = [
		`../assets/images/dark-theme.jpg`,
		`../assets/images/blue-theme.jpg`,
		`../assets/images/castle-theme.jpg`,
		`../assets/images/grey-theme.jpg`,
		`../assets/images/leaf-theme.jpg`,
		`../assets/images/paper-theme.jpg`,
		`../assets/images/swing-theme.jpg`,
		`../assets/images/red-theme.jpg`,
		`../assets/images/blue-pattern.jpg`,
		`../assets/images/purple-theme.jpg`,
		`../assets/images/wooden-theme.jpg`,
		`../assets/images/space-theme.jpg`
	];

  constructor() { }

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
