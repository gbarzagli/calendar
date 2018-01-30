import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
    events = [{name: 'Nome', date: new Date(), location: 'Endereço'}];

    constructor() {}

    ngOnInit() {}
}
