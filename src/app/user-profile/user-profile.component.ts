import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from '../interfaces';
import { DataService } from '../data.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../environments/environment';
import { FileUploadModule } from "ng2-file-upload";
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../user.service';


@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

	isLoading: boolean = true;
	currentUser: LoggedUser;
	avatarLabel = `Avatar`;
	themeLabel = `App theme`;
	userInfoLabel = `User Info`;
	currencyLabel = `Currency`;
	balanceLimitLabel = `Balance limit`;
	bgColor = "#8e8e8e";
	color = "white";
	avatarSrc: string;
	avatarInitials: string;

	public uploader: FileUploader;

	constructor(
		private http: HttpClient,
		private dataService: DataService,
		private router: Router,
		private snackBar: MatSnackBar,
		public userServise: UserService
	) { }

	ngOnInit() {
		const userId = localStorage.getItem("userId");
		this.manageUploader(userId);

		const url = `${environment.apiBaseUrl}/user/user-by-id/${userId}`;
		if (userId) {
			this.http.get(url, { observe: 'response' })
				.subscribe(
					response => {
						this.currentUser = <LoggedUser>response.body;
						console.log('---> USER PROFILE response ', response);
						this.setCurrentAvatar();
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
				this.userServise.appUser = this.currentUser;
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
}
