/**
 * Created by dispensable on 2016/10/27.
 */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketService } from '../shared/websocket.service';
import { Api } from '../shared/api';
import { Notification } from "../shared/notification-component/notification";

const CHAT_URL = Api.websocketAddr();

@Injectable()
export class NotificationCenterService {
	public notification: Subject<Notification>;

	constructor(wsService: WebSocketService) {
		this.notification = <Subject<Notification>>wsService
			.connect(CHAT_URL)
			.map((response: MessageEvent): Notification => {
        return JSON.parse(response.data);
			});
	}
}
