import { Event } from '@/types/chat/Event';
import Message from '@/types/chat/Message';
import { Observable } from 'rxjs';

import socketIo, { Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';

export class SocketService {
    private socket: Socket;

    constructor() {
        this.socket = socketIo(SERVER_URL);
    }

    public send(message: Message): void {
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}