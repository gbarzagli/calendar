import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../shared/calendar.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    date;
    days;
    month;
    monthDesc;
    year;

    constructor(private service: CalendarService) {}

    ngOnInit() {
        this.date = this.service.date;
        this.month = this.service.month;
        this.year = this.service.year;
        this.changeMonth();
    }

    isCurrentDate(day): boolean {
        return  this.service.date     === day
                && this.service.month === this.month
                && this.service.year  === this.year;
    }

    changeMonth() {
        this.monthDesc = this.service.getMonthDesc(this.month);
        this.days = this.service.getDaysOfAMonthYear(this.month, this.year);
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

}
