import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../shared/calendar.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    private date: number;
    protected days: Array<object>;
    private month: number;
    protected monthDesc: string;
    protected year: number;

    constructor(private service: CalendarService) {}

    ngOnInit() {
        this.date = this.service.currentDate;
        this.month = this.service.currentMonth;
        this.year = this.service.currentYear;
        setInterval(this.changeMonth(), 500);
    }

    isCurrentDate(day): boolean {
        return  this.service.currentDate     === day.date
                && this.service.currentMonth === day.month
                && this.service.currentYear  === this.year;
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
