import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MessageBusService {
    private messages: Map<string, Object> = new Map();
    private subject: Subject<string> = new Subject<string>();

    constructor() {}

    public subscribe(next, error?, complete?) {
        return this.subject.subscribe(next, error, complete);
    }

    public publish(key, value) {
        this.messages.set(key, value);
        this.subject.next(key);
    }

    public consume(key) {
        const object = this.messages.get(key);
        delete this.messages[key];
        return object;
    }
}
