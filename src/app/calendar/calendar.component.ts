import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarService } from '../shared/calendar.service';
import { FormComponent } from '../form/form.component';
import { PanelComponent } from '../panel/panel.component';
import { MessageBusService } from '../shared/message-bus.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    protected days: Array<object>;
    private month: number;
    protected monthDesc: string;
    protected year: number;
    @ViewChild(FormComponent) form: FormComponent;

    constructor(
        private service: CalendarService,
        private messageBus: MessageBusService
    ) {}

    ngOnInit() {
        this.month = this.service.currentMonth;
        this.year = this.service.currentYear;
        setInterval(this.changeMonth(), 500);
    }

    isCurrentDate(day): boolean {
        return (
            this.service.currentDate === day.date &&
            this.service.currentMonth === day.month &&
            this.service.currentYear === this.year
        );
    }

    changeMonth() {
        this.monthDesc = this.service.getMonthDesc(this.month);
        this.days = this.service.getDaysOfAMonthYear(this.month, this.year);
        this.messageBus.publish(PanelComponent.PANEL_MONTH_KEY, {month: this.month, year: this.year});
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
            this.form.setDate(date);
            this.form.showModal();
        }
    }
}
