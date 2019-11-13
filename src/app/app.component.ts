import { Component } from '@angular/core';
import { ScreenService } from './screen.service';
import { Subscription } from 'rxjs';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'monney';
	private sbscr: Subscription;
	constructor(private responsiveService: ScreenService) {
	}

	ngOnInit() {
		// this.responsiveService.getMobileStatus().subscribe(isMobile => {
		// 	if (isMobile) {
		// 		console.log('Mobile device detected')
		// 	}
		// 	else {
		// 		console.log('Desktop detected')
		// 	}
		// });
		//this.onResize();
	}

	// ngOnDestroy() {
	// 	this.sbscr.unsubscribe();
	// }

	onResize(event: any) {
		this.responsiveService.checkWidth();
	}
}
