import { Component } from '@angular/core';
import { NotificationHost } from 'src/app/notification/model/notification-host';
import { NotificationForHostService } from 'src/app/notification/services/notification-for-host.service';
import { SharedService } from 'src/app/services/shared.service';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/env/env';
import { AuthService } from 'src/app/infrastructure/auth/services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateSslPopupComponent } from 'src/app/accommodation/create-ssl-popup/create-ssl-popup.component';
import {SslRequestService} from "../../../accommodation/services/ssl-request.service";

@Component({
	selector: 'app-host-nav-bar',
	templateUrl: './host-nav-bar.component.html',
	styleUrls: ['./host-nav-bar.component.css'],
})
export class HostNavBarComponent {
	dialogRef!: MatDialogRef<CreateSslPopupComponent>;
	numberOfNotifications: number = 0;
	haveNotifications: boolean = false;
	private serverUrl = environment.socket + 'socket';
	private stompClient: any;

	isLoaded: boolean = false;
	isCustomSocketOpened = false;
	showCreateSSLLink: Boolean = true;
	constructor(
		private service: NotificationForHostService,
		private sharedService: SharedService,
		private authService: AuthService,
		private matDialog: MatDialog,
		private sslRequestService: SslRequestService,
	) {
		this.sharedService.numberOfNotifications$.subscribe((data) => {
			this.numberOfNotifications = data;
			if (this.numberOfNotifications == 0) {
				this.haveNotifications = false;
			}
		});
	}

	ngOnInit(): void {
		this.initializeWebSocketConnection();
		this.getData();
		this.checkRequest();
	}
	getData(): void {
		this.service.getNotificationsHost().subscribe({
			next: (notifications: NotificationHost[]) => {
				this.numberOfNotifications = 0;

				notifications.forEach((notification: NotificationHost) => {
					if (!notification.read) {
						this.numberOfNotifications += 1;
					}
				});
				if (this.numberOfNotifications != 0) {
					this.haveNotifications = true;
				}
			},
		});
	}

	initializeWebSocketConnection() {
		let ws = new SockJS(this.serverUrl);
		this.stompClient = Stomp.over(ws);
		let that = this;

		this.stompClient.connect({}, function () {
			that.isLoaded = true;
			that.openSocket();
		});
	}
	openSocket() {
		if (this.isLoaded) {
			this.isCustomSocketOpened = true;
			this.stompClient.subscribe(
				'/socket-publisher/' + this.authService.getId(),
				(message: { body: string }) => {
					this.handleResult(message);
				}
			);
		}
	}
	handleResult(message: { body: string }) {
		if (message.body) {
			if (this.numberOfNotifications == 0) {
				this.haveNotifications = true;
			}
			this.numberOfNotifications += 1;
		}
	}

	openDialog(): void {
		this.dialogRef = this.matDialog.open(CreateSslPopupComponent, {});
	}

	checkRequest(): void {
		console.log("asdfasdfasdf");
		this.sslRequestService.checkRequest(this.authService.getEmail()).subscribe(result => {
			console.log("OOVO JE REZZZZ", result);
			console.log("OVO je email",this.authService.getEmail() );
			this.showCreateSSLLink = result;
		});
	}
}
