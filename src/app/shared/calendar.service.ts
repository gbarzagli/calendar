import { Injectable } from '@angular/core';

@Injectable()
export class CalendarService {

    private static readonly MONTH_DESCRIPTIONS = [  'Janeiro',  'Fevereiro', 'Março',    'Abril',
                                                    'Maio',     'Junho',     'Julho',    'Agosto',
                                                    'Setembro', 'Outubro',   'Novembro', 'Dezembro' ];
    private currentDate: number;
    private currentMonth: number;
    private currentYear: number;


    constructor() {
        this.currentDate = new Date().getDate();
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
    }

    /**
     * getDaysOfAMonthYear
     */
    public getDaysOfAMonthYear(month: number, year: number) {
        const days = [ new Array(7), new Array(7), new Array(7), new Array(7), new Array(7), new Array(7) ];
        const firstDay = new Date(year, month, 1);
        let column = firstDay.getDay();
        let line = 0;

        // get the length of days in the month by getting its last day
        const length = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= length; i++) {
            if (column === 7) {
                column = 0;
                line++;
            }

            days[line][column] = i;
            column++;
        }

        return days;
    }

    get date() {
        return this.currentDate;
    }

    set date(date) {
        this.currentDate = date;
    }

    get month() {
        return this.currentMonth;
    }

    set month(month) {
        this.currentMonth = month;
    }

    public getMonthDesc(month) {
        return CalendarService.MONTH_DESCRIPTIONS[month];
    }

    get year() {
        return this.currentYear;
    }

    set year(year) {
        this.currentYear = year;
    }
}
