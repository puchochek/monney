import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ApplicationUser } from '../interfaces';
import { environment } from '../../environments/environment';
import { FileUploadModule } from "ng2-file-upload";
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';

import { Subscription } from 'rxjs';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

	currentUser: ApplicationUser;

	userAvatarLbl: string = `avatar`;

	private userSubscription: Subscription;
	public uploader: FileUploader;

	constructor(
		private userService: UserService,

	) { }

	ngOnInit() {
		//this.manageUploader();
		this.userSubscription = this.userService._user.subscribe(response => {
			if (response) {
				this.currentUser = <ApplicationUser>response;

				console.log('---> user profile USER ', this.currentUser);

			}
		});
	}

	// manageUploader() {
	// 	const UPL_URL = `${environment.apiBaseUrl}/user/avatar`;
	// 	this.uploader = new FileUploader({ url: UPL_URL, itemAlias: 'avatar' });
	// 	this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
	// 	this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
	// 		const imageInfo = JSON.parse(response);
	// 		console.log('---> imageInfo.secure_url ', imageInfo.secure_url);
	// 		if (imageInfo.secure_url) {
	// 			const userToUpdate: ApplicationUser = { ...this.currentUser };
	// 			userToUpdate.avatar = imageInfo.secure_url;
	// 			this.userService.updateUser(userToUpdate);
	// 		}
	// 	};
	// }
}
