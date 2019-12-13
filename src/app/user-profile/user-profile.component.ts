import { Component, OnInit, Input, HostListener } from '@angular/core';
import { LoggedUser } from '../interfaces';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../environments/environment';
import { FileUploadModule } from "ng2-file-upload";
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { UserService } from '../user.service';
import { ThemeService } from '../theme.service';
import { Subscription } from 'rxjs';



@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
	@Input() name: string;
	@Input() email: string;
	@Input() balanceEdge: string;
	key: any;
	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		this.key = event.key;
	}

	private appUserSubscription: Subscription;
	private dbUserSubscription: Subscription;

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
	limitLabel: string = `Balance limit`;
	balanceEdgeLbl: string = `Low balance limit`;
	lowBalanceDescription: string = `Here you can specify an
	edge value to warn you if a balance is too low.`;
	bgColor: string = "#8e8e8e";
	color: string = "white";
	avatarSrc: string;
	avatarInitials: string;
	assetsList: string[];

	public uploader: FileUploader;

	constructor(
		private router: Router,
		private userService: UserService,
		private themeService: ThemeService,
	) { }

	ngOnInit() {
		this.assetsList = this.themeService.ASSETS_LIST;
		this.appUserSubscription = this.userService._user.subscribe(response => {
			console.log('---> USER_PROFILE _user ', response);
			if (response) {
				this.currentUser = <LoggedUser>response;
				this.manageUploader(this.currentUser.id);
				this.setCurrentAvatar();
				this.setUserDataToEdit();
			} else {
				this.getUserFromDB();
			}
		});
	}

	getUserFromDB() {
		if (localStorage.getItem('token')) {
			this.dbUserSubscription = this.userService.getUserFromDB().subscribe(response => {
				console.log('---> USER_PROFILE DB user ', response);
				if (response) {
					this.currentUser = <LoggedUser>response;
					this.manageUploader(this.currentUser.id);
					this.setCurrentAvatar();
					this.setUserDataToEdit();
				} else {
					this.router.navigate([`/home`]);
				}
			});
		} else {
			this.router.navigate([`/hello-monney`]);
		}
	}

	ngOnDestroy() {
		if (this.appUserSubscription) {
			this.appUserSubscription.unsubscribe();
		}
		if (this.dbUserSubscription) {
			this.dbUserSubscription.unsubscribe();
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
				this.userService.patchUser([userToUpdate]);
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

	updateUserInfo() {
		const editedUser = { ...this.currentUser };
		editedUser.email = this.email;
		editedUser.name = this.name;
		this.userService.patchUser([editedUser]);
	}

	updateBalanceEdge() {
		const isbalanceEdgeValid = this.validateBalanceEdge(this.balanceEdge);
		if (isbalanceEdgeValid) {
			this.isInvalidInput = false;
			const editedUser = { ...this.currentUser };
			editedUser.balanceEdge = Number(this.balanceEdge);
			this.userService.patchUser([editedUser]);
		} else {
			this.isInvalidInput = true;
			this.invaildEdgeMessage = `The Sum field may keep a positive number value only.`;
		}
	}

	hideErrorMessage() {
		this.isInvalidInput = false;
	}

	validateBalanceEdge(balanceEdge: string): boolean {
		const balanceEdgeToNum = !balanceEdge ? 0 : Number(balanceEdge);
		if (isNaN(balanceEdgeToNum) || (Number(balanceEdgeToNum) < 0)) {
			return false;
		} else {
			return true;
		}
	}

	handleKeyPress(event) {
		if (event.key === `Enter`) {
			if ((this.name !== this.currentUser.name) || (this.email !== this.currentUser.email)) {
				this.updateUserInfo();
			}
			const isbalanceEdgeValid = this.validateBalanceEdge(this.balanceEdge);
			if (isbalanceEdgeValid) {
				if (Number(this.balanceEdge) !== Number(this.currentUser.balanceEdge)) {
					this.updateBalanceEdge();
				}
			}
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
				this.userService.patchUser([userToUpdate])
				//this.userService.appUser = this.currentUser;
			}
		}
	}

}
