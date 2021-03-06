import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarService } from '../shared/calendar.service';
import { FormComponent } from '../form/form.component';
import { PanelComponent } from '../panel/panel.component';
import { MessageBusService } from '../shared/message-bus.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    public year: number;
    public monthDesc: string;
    public days: Array<object>;
    private days$: Subscription;
    private month: number;
    @ViewChild(FormComponent) form: FormComponent;

    constructor(
        private service: CalendarService,
        private messageBus: MessageBusService
    ) { }

    ngOnInit() {
        this.month = this.service.currentMonth;
        this.year = this.service.currentYear;
        this.changeMonth();

        setTimeout(
            function () {
                window.location.reload();
            },
            300000
        );
        console.log('Browser loaded at: ' + new Date());
    }

    isCurrentDate(day): boolean {
        return (
            this.service.currentDate === day.date &&
            this.service.currentMonth === day.month &&
            this.service.currentYear === this.year
        );
    }

    changeMonth() {
        if (this.days$) {
             this.days$.unsubscribe();
        }
        this.monthDesc = this.service.getMonthDesc(this.month);
        this.days$ = this.service.getDaysOfAMonthYear(this.month, this.year).subscribe(next => {
            this.days = next;
        });
        this.messageBus.publish(PanelComponent.PANEL_MONTH_KEY, { month: this.month, year: this.year });
    }

    nextMonth() {
        if (this.month === 11) {
            this.month = 0;
            this.year++;
            this.changeMonth();
            return;
        }

        this.month++;
        this.changeMonth();
    }

    previousMonth() {
        if (this.month === 0) {
            this.month = 11;
            this.year--;
            this.changeMonth();
            return;
        }

        this.month--;
        this.changeMonth();
    }

    openModal(date) {
        if (date.active === true) {
            this.form.day = date;
            this.form.showModal();
        }
    }
}
