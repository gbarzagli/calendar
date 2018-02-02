import { Component, OnDestroy } from '@angular/core';
import { MessageBusService } from './shared/message-bus.service';
import { CalendarService } from './shared/calendar.service';
import { Subscription } from 'rxjs/Subscription';
import { PanelComponent } from './panel/panel.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(private messageBus: MessageBusService, private calendarService: CalendarService) {}

    ngOnInit() {
        const date = new Date();
        this.messageBus.publish(PanelComponent.PANEL_MONTH_KEY, {month: date.getMonth(), year: date.getFullYear()});
    }
}
