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
    public negative: boolean = false;
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
            let minute = next % 60;
            let hour = Math.floor((next / 60) - (minute / 60));

            if (hour < 0 || minute < 0) {
                this.negative = true;
            } else {
                this.negative = false;
            }

            hour = Math.abs(hour);
            minute = Math.abs(minute);
            const strHour = hour < 10 ? '0' + hour : hour;
            const strMinute = minute < 10 ? '0' + minute : minute;

            this.hours = `${strHour}:${strMinute}`;
        });
    }

    ngOnDestroy() {
        this.messageBus$.unsubscribe();
        if (this.hourBalance$) {
            this.hourBalance$.unsubscribe();
        }
    }
}
