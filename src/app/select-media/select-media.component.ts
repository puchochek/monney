import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
//import { MediaService } from '../media.service';
//import { Location } from '@angular/common';



@Component({
	selector: 'app-select-media',
	templateUrl: './select-media.component.html',
	styleUrls: ['./select-media.component.scss']
})
export class SelectMediaComponent implements OnInit {

	icons: string[] = [`accessibility`, `accessibility_new`, `accessible`, `accessible_forward`, `account_balance`,
		`account_balance_wallet`, `account_box`, `account_circle`, `add_shopping_cart`, `alarm`, `alarm_add`, `alarm_off`, `alarm_on`,
		`all_out`, `android`, `book`, `bookmark`, `bookmark_border`, `bug_report`, `build`, `calendar_today`, `camera_enhance`, `card_giftcard`,
		`card_travel`, `change_history`, `code`, `commute`, `contact_support`, `copyright`, `credit_card`, `date_range`, `delete`, `delete_forever`,
		`done`, `donut_small`, `eject`, `euro_symbol`, `event`, `event_seat`, `explore`, `extension`, `face`, `favorite`, `favorite_border`, `feedback`,
		`find_in_page`, `fingerprint`, `flight_land`, `flight_takeoff`, `g_translate`, `gavel`, `get_app`, `grade`, `group_work`, `help`, `highlight_off`,
		`history`, `home`, `hourglass_empty`, `hourglass_full`, `https`, `important_devices`, `language`, `motorcycle`, `offline_bolt`, `pan_tool`, `perm_camera_mic`,
		`pets`, `polymer`, `power_settings_new`, `pregnant_woman`, `print`, `remove_shopping_cart`, `room`, `settings`, `settings_input_component`, `settings_input_hdmi`,
		`settings_phone`, `settings_voice`, `shop`, `shopping_basket`, `shopping_cart`, `stars`, `supervised_user_circle`, `theaters`, `thumb_down`, `thumb_up`, `thumbs_up_down`,
		`verified_user`, `visibility`, `visibility_off`, `work`, `work_off`, `contact_mail`, `email`, `import_contacts`, `phonelink_ring`, `sentiment_satisfied_alt`,
		`vpn_key`, `games`, `movie`, `music_video`, `new_releases`, `queue_music`, `video_call`, `volume_up`, `volume_off`, `add_box`, `archive`, `create`, `drafts`, `flag`,
		`gesture`, `save`, `send`, `weekend`, `waves`, `gps_fixed`, `nfc`, `wallpaper`, `wifi_tethering`, `attach_money`, `border_color`, `format_paint`, `functions`,
		`insert_emoticon`, `insert_photo`, `monetization_on`, `cloud_circle`, `cloud_off`, `computer`, `desktop_mac`, `desktop_windows`, `headset`, `keyboard`,
		`memory`, `mouse`, `security`, `sim_card`, `speaker`, `toys`, `tv`, `watch`, `add_a_photo`, `audiotrack`, `brightness_2`, `brightness_1`, `brightness_3`, `brush`,
		`camera`, `color_lens`, `filter_vintage`, `flash_on`, `flash_off`, `healing`, `landscape`, `looks`, `nature`, `nature_people`, `palette`, `style`, `wb_incandescent`,
		`wb_sunny`, `departure_board`, `directions_bike`, `directions_boat`, `directions_bus`, `directions_car`, `directions_railway`, `directions_run`, `directions_subway`,
		`directions_walk`, `fastfood`, `flight`, `hotel`, `local_atm`, `local_bar`, `local_cafe`, `local_dining`, `local_drink`, `local_florist`, `local_gas_station`, `local_grocery_store`,
		`local_hospital`, `local_hotel`, `local_library`, `local_offer`, `local_pizza`, `local_shipping`, `local_taxi`, `near_me`, `restaurant`, `traffic`, `wc`, `wifi`,
		`ac_unit`, `beach_access`, `business_center`, `casino`, `child_care`, `child_friendly`, `fitness_center`, `free_breakfast`, `golf_course`, `hot_tub`, `kitchen`,
		`meeting_room`, `pool`, `room_service`, `smoke_free`, `smoking_rooms`, `spa`, `star_half`, `star`, `cake`, `domain`, `group`, `location_city`, `mood_bad`, `notifications_active`,
		`notifications_paused`, `public`, `school`, `share`, `whatshot`];
		//mediaIconDialogRef: MatDialogRef<SelectMediaComponent>;
	constructor(
		private mediaIconDialogRef: MatDialogRef<SelectMediaComponent>

		// public mediaService: MediaService,
		// private location: Location

	) { }

	ngOnInit() {
	}

	selectIcon(event) {
		console.log('---> select icon ', event.currentTarget.firstChild.innerHTML);
		const iconName = event.currentTarget.firstChild.innerHTML;
		if (iconName) {
			this.mediaIconDialogRef.close(`${iconName}`);
			//this.mediaService.categoryIcon = iconName;
			//this.goBack();
		}
	}
	// goBack() {
	// 	this.location.back();
	// }
}
