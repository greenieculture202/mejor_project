import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;
    private readonly URL = 'http://localhost:4000'; // Adjust if backend runs on different port/host

    constructor() {
        this.socket = io(this.URL);
    }

    // Listen for an event
    listen(eventName: string): Observable<any> {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            });
        });
    }

    // Emit an event (if needed later)
    emit(eventName: string, data: any) {
        this.socket.emit(eventName, data);
    }
}
