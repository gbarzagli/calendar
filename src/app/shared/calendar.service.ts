import { Injectable } from '@angular/core';

@Injectable()
export class CalendarService {

    private static readonly MONTH_DESCRIPTIONS = [  'Janeiro',  'Fevereiro', 'Março',    'Abril',
                                                    'Maio',     'Junho',     'Julho',    'Agosto',
                                                    'Setembro', 'Outubro',   'Novembro', 'Dezembro' ];

    constructor() {}

    /**
     * getDaysOfAMonthYear
     */
    public getDaysOfAMonthYear(month: number, year: number) {
        const days = [ new Array(7), new Array(7), new Array(7), new Array(7), new Array(7), new Array(7) ];
        const previousDay = new Date(year, month, 0);

        let firstDay = new Date(year, month, 1);
        let previousDate = previousDay.getDate();
        let column = firstDay.getDay();
        let line = 0;

        // Get last days from the previous month
        for (let i = 1; i <= column; i++) {
            days[line][column - i] = { date: previousDate--, active: false };
        }

        // get the length of days in the month by getting its last day
        const length = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= length; i++) {
            if (column === 7) {
                column = 0;
                line++;
            }

            days[line][column++] = { date: i, active: true };
        }


        firstDay = new Date(year, month + 1, 1);
        let day = firstDay.getDate();
        for (let i = line; i < 6; i++) {
            for (let j = column; j < 7; j++) {
                days[i][j] =  { date: day++, active: false };
            }
            column = 0;
        }

        return days;
    }

    get date() {
        return new Date().getDate();
    }

    get month() {
        return new Date().getMonth();
    }

    get year() {
        return new Date().getFullYear();
    }

    public getMonthDesc(month) {
        return CalendarService.MONTH_DESCRIPTIONS[month];
    }

}
