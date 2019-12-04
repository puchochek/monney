import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { DataService } from '../data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../environments/environment';
import { FileUploadModule } from "ng2-file-upload";
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../user.service';
import { ThemeService } from '../theme.service';


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
	@Input() name: string;
	@Input() email: string;
	@Input() balanceEdge: string;

	isLoading: boolean = true;
	isInvalidInput: boolean;
	currentUser: LoggedUser;
	invaildEdgeMessage: string;
	avatarLabel: string = `Avatar`;
	themeLabel: string = `App theme`;
	userInfoLabel: string = `User Info`;
	currencyLabel: string = `Currency`;
	balanceLimitLabel: string = `Balance limit`;
	userNameLabel: string = `Name`;
	userEmailLabel: string = `Email`;
	limitLabel: string = `Low balance limit`;
	balanceEdgeLbl: string = `Balance limit`;
	lowBalanceDescription: string = `Here you can specify an
	edge value to warn you if a balance is too low. By default it is set to zero.`;
	bgColor: string = "#8e8e8e";
	color: string = "white";
	avatarSrc: string;
	avatarInitials: string;
	// assetsList: string[] = [
	// 	`../assets/images/dark-theme.jpg`,
	// 	`../assets/images/blue-theme.jpg`,
	// 	`../assets/images/castle-theme.jpg`,
	// 	`../assets/images/grey-theme.jpg`,
	// 	`../assets/images/leaf-theme.jpg`,
	// 	`../assets/images/paper-theme.jpg`,
	// 	`../assets/images/swing-theme.jpg`,
	// 	`../assets/images/red-theme.jpg`,
	// 	`../assets/images/blue-pattern.jpg`,
	// 	`../assets/images/purple-theme.jpg`,
	// 	`../assets/images/wooden-theme.jpg`,
	// 	`../assets/images/space-theme.jpg`
	// ];
	assetsList: string[];

	public uploader: FileUploader;

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private snackBar: MatSnackBar,
		private userService: UserService,
		private themeService: ThemeService,
	) { }

	ngOnInit() {
		this.assetsList = [...this.themeService.ASSETS_LIST];
		const token = localStorage.getItem("token");
		if (token) {
			const tokenisedId = localStorage.getItem("token").split(" ")[1];
			const url = `${environment.apiBaseUrl}/user/user-by-token/${tokenisedId}`;
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						this.manageUploader(this.currentUser.id);
						if (!this.userService._user.hasOwnProperty('id')) {
							this.userService.appUser = { ...this.currentUser };
						}
						console.log('---> USER PROFILE response ', response);
						this.setCurrentAvatar();
						this.setUserDataToEdit();
						this.dataService.updateToken(response.headers.get('Authorization'));
						this.isLoading = false;
					},
					error => {
						console.log('---> USER PROFILE error ', error);
						this.router.navigate(['/hello-monney']);
					},
					() => {
						// 'onCompleted' callback.
						// No errors, route to new page here
					}
				);
		}

	}

	manageUploader(userId: string) {
		const UPL_URL = `${environment.apiBaseUrl}/user/avatar/${userId}`;
		this.uploader = new FileUploader({ url: UPL_URL, itemAlias: 'avatar' });
		this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; this.uploader.uploadAll() };
		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			const imageInfo = JSON.parse(response);
			if (imageInfo.secure_url) {
				const userToUpdate: LoggedUser = { ...this.currentUser };
				userToUpdate.avatar = imageInfo.secure_url;
				this.isLoading = true;
				this.doUpdateUserCall([userToUpdate]);
			}
		};
	}

	setUserDataToEdit() {
		this.name = this.currentUser.name;
		this.email = this.currentUser.email;
		this.balanceEdge = String(this.currentUser.balanceEdge) || `0`;
	}

	setCurrentAvatar() {
		if (this.currentUser.avatar) {
			this.avatarSrc = this.currentUser.avatar;
		} else {
			if (this.currentUser.name.split(` `)) {
				this.avatarInitials = this.currentUser.name.split(` `).length > 1 ?
					this.currentUser.name.split(` `)[0].slice(0, 1) + this.currentUser.name.split(` `)[1].slice(0, 1)
					: this.currentUser.name.slice(0, 1);
			}
		}
	}

	doUpdateUserCall(user: LoggedUser[]) {
		const requestUrl = `${environment.apiBaseUrl}/user/update`;
		this.http.post(requestUrl, {
			user: user
		}, { observe: 'response' }
		).subscribe(
			response => {
				const snackMessage = 'Done';
				const action = `OK`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
				this.currentUser = <LoggedUser>response.body[0];
				this.userService.appUser = this.currentUser;
				this.dataService.updateToken(response.headers.get('Authorization'));
				this.updateUserView();
				this.isLoading = false;
			},
			error => {
				console.log('---> UPSERT USER ERROR ', error);
				const snackMessage = 'Oops!';
				const action = `Try again`;
				this.snackBar.open(snackMessage, action, {
					duration: 5000,
				});
			},
			() => {
				// 'onCompleted' callback.
				// No errors, route to new page here
			}
		);
	}

	updateUserView() {
		//TODO update another view settings here
		this.avatarSrc = this.currentUser.avatar;
	}

	updateUserInfo() {
		const editedUser = { ...this.currentUser };
		editedUser.email = this.email;
		editedUser.name = this.name;
		this.isLoading = true;
		this.doUpdateUserCall([editedUser]);
	}

	updateBalanceEdge() {
		const isbalanceEdgeValid = this.validateBalanceEdge(this.balanceEdge);
		if (isbalanceEdgeValid) {
			this.isInvalidInput = false;
			const editedUser = { ...this.currentUser };
			editedUser.balanceEdge = Number(this.balanceEdge);
			this.isLoading = true;
			this.doUpdateUserCall([editedUser]);
		} else {
			this.isInvalidInput = true;
			this.invaildEdgeMessage = `The Sum field may keep a positive number value only.`;
		}
	}

	hideErrorMessage() {
		this.isInvalidInput = false;
	}

	validateBalanceEdge(balanceEdge: string): boolean {
		const balanceEdgeToNum = Number(balanceEdge);
		if (isNaN(balanceEdgeToNum) || (!balanceEdgeToNum) || (Number(balanceEdgeToNum) < 0)) {
			return false;
		} else {
			return true;
		}
	}

	selectBackground(event) {
		const selectedImgSrc = event.explicitOriginalTarget.currentSrc;
		console.log('--selectedImgSrc ', selectedImgSrc);
		if (selectedImgSrc) {
			const lastSlashIndex = selectedImgSrc.lastIndexOf(`/`);
			const pointIndex = selectedImgSrc.indexOf(`.`);
			const selectedAssetName = selectedImgSrc.substring((lastSlashIndex + 1), pointIndex);
			console.log('---> selectedAssetName ', selectedAssetName);
			if (this.themeService.checkIfThemeExist(selectedAssetName)) {
				const userToUpdate: LoggedUser = { ...this.currentUser };
				userToUpdate.theme = selectedAssetName;
				this.isLoading = true;
				this.doUpdateUserCall([userToUpdate]);
				this.userService.appUser = this.currentUser;
			}
		}
	}

}
