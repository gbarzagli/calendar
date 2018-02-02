import { Component, OnInit } from '@angular/core';
import { Time } from '@angular/common';
import { CalendarService } from '../shared/calendar.service';
import { MessageBusService } from '../shared/message-bus.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit, OnDestroy {

    public static readonly PANEL_HOURS_KEY = 'PANEL_HOURS_KEY';
    public static readonly PANEL_MONTH_KEY = 'PANEL_MONTH_KEY';

    protected closingPeriod: string;
    protected hours: string = '10:00';
    protected month: string;
    private subscription: Subscription;

    constructor(private service: CalendarService, private messageBus: MessageBusService) {
        this.subscription = this.messageBus.subscribe(next => {
            if (next === PanelComponent.PANEL_MONTH_KEY) {
                this.changeMonth(next);
            }
        });
    }

    ngOnInit() {
    }

    private changeMonth(key) {
        const monthYear: any = this.messageBus.consume(key);
        this.month = this.service.getMonthDesc(monthYear.month);
        const period = this.service.getMonthClosingPeriod(monthYear.month, monthYear.year);
        this.closingPeriod = `(${period.start.getDate() + '/' + (period.start.getMonth() + 1)} -
                               ${period.end.getDate()   + '/' + (period.end.getMonth() + 1)  })`;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
