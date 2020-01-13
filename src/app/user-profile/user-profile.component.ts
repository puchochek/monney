import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { ApplicationUser, StorageUser } from '../interfaces';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
	form: FormGroup;
	avatarSrc: string;

	userAvatarLbl: string = `avatar`;

	private userSubscription: Subscription;
	// @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

	public uploader: FileUploader;

	constructor(
		private userService: UserService,
		private fb: FormBuilder

	) { }

	ngOnInit() {
		this.manageUploader();
		this.userSubscription = this.userService._user.subscribe(response => {
			if (response) {
				this.currentUser = <ApplicationUser>response;
				// this.manageUploader();
				//this.setFormValuses();
				console.log('---> user profile USER ', this.currentUser);
			} else if (!this.currentUser && localStorage.getItem('token')) {
				this.userService.getUserByToken();
			}
		});
		if (!this.currentUser && !localStorage.getItem('storageUser') && localStorage.getItem('token')) {
			this.userService.getUserByToken();
		}
	}

	ngOnDestroy() {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	manageUploader() {
		const UPL_URL = `${environment.apiBaseUrl}/user/avatar`;
		this.uploader = new FileUploader({ url: UPL_URL, itemAlias: 'avatar' });
		this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			const imageInfo = JSON.parse(response);
			if (imageInfo.secure_url) {
				console.log('---> imageInfo.secure_url ', imageInfo.secure_url);
				const userToUpdate: ApplicationUser = { ...this.currentUser };
				userToUpdate.avatar = imageInfo.secure_url;
				this.userService.updateUser(userToUpdate);
			};
		}
	};

	onFileSelected() {
		this.uploader.uploadAll();
	}
}

