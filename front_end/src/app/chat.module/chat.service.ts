/**
 * Created by dispensable on 2016/10/26.
 */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import {WebSocketService } from './websocket.service';

const CHAT_URL = 'ws://localhost:8888/api/websocket';

export interface Message {
	author: string,
	message: string,
	date: string,
  sendto: string[],

}

@Injectable()
export class ChatService {
	public messages: Subject<Message>;

	constructor(wsService: WebSocketService) {
		this.messages = <Subject<Message>>wsService
			.connect(CHAT_URL)
			.map((response: MessageEvent): Message => {
				let data = JSON.parse(response.data);
				return {
					author: data.author,
					message: data.message,
					newDate : data.newDate
				}
			});
	}
} // end class ChatService
