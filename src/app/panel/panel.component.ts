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

    public closingPeriod: any;
    public hours: string = '10:00';
    public month: string;
    private messageBus$: Subscription;
    private hourBalance$: Subscription;

    constructor(private service: CalendarService, private messageBus: MessageBusService) {
        this.messageBus$ = this.messageBus.subscribe(next => {
            if (next === PanelComponent.PANEL_MONTH_KEY) {
                this.changeMonth(next);
            }
        });
    }

    ngOnInit() {
    }

    private changeMonth(key) {
        if (this.hourBalance$) {
            this.hourBalance$.unsubscribe();
        }

        const monthYear: any = this.messageBus.consume(key);
        this.month = this.service.getMonthDesc(monthYear.month);
        this.closingPeriod = this.service.getMonthClosingPeriod(monthYear.month, monthYear.year);

        this.hourBalance$ = this.service.getHourBalance().subscribe(next => {
            console.log(next)
            const hour = next / 60;
            const minute = (next % 60) * 60;

            this.hours = `${hour}:${minute}`;
        });
    }

    ngOnDestroy() {
        this.messageBus$.unsubscribe();
    }
}
