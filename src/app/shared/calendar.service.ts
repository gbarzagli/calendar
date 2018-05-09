import { Injectable } from '@angular/core';

@Injectable()
export class CalendarService {

    private static readonly MONTH_DESCRIPTIONS = ['Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    private month: number;
    private year: number;

    constructor() { }

    /**
     * getDaysOfAMonthYear
     */
    public getDaysOfAMonthYear(month: number, year: number) {
        this.month = month;
        this.year = year;

        const days = [new Array(7), new Array(7), new Array(7), new Array(7), new Array(7), new Array(7)];
        const previousDay = new Date(year, month, 0);

        let firstDay = new Date(year, month, 1);
        let previousDate = previousDay.getDate();
        let column = firstDay.getDay();
        let line = 0;

        // Get last days from the previous month
        for (let i = 1; i <= column; i++) {
            days[line][column - i] = { date: previousDate--, month: previousDay.getMonth(), year: year, active: false };
        }

        // get the length of days in the month by getting its last day
        const length = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= length; i++) {
            if (column === 7) {
                column = 0;
                line++;
            }

            days[line][column++] = { date: i, month: month, year: year, active: true, start: null, end: null };
        }


        firstDay = new Date(year, month + 1, 1);
        let day = firstDay.getDate();
        for (let i = line; i < 6; i++) {
            for (let j = column; j < 7; j++) {
                days[i][j] = { date: day++, month: firstDay.getMonth(), year: year, active: false };
            }
            column = 0;
        }

        return days;
    }

    get selectedMonth() {
        return this.month;
    }

    get currentDate() {
        return new Date().getDate();
    }

    get currentMonth() {
        return new Date().getMonth();
    }

    get currentYear() {
        return new Date().getFullYear();
    }

    public getMonthDesc(month) {
        return CalendarService.MONTH_DESCRIPTIONS[month];
    }

    public getMonthClosingPeriod(month, year) {
        const start = new Date(year, month - 1, 21);
        const end = new Date(year, month, 20);
        return { start: start, end: end };
    }

    public save(day) {
        let hourControl = JSON.parse(localStorage.getItem('HOUR_CONTROL'));
        if (hourControl) {
            const data: any[] = hourControl['data'];
            let years = data.filter(y => y.year === day.year);
            if (years.length === 0) {
                data.push({ year: day.year, months: [] });
                years = data.filter(y => y.year === day.year);
            }

            const year = years[0];
            const months = year['months'].filter(m => m.month === day.month);
            const month = months[0];

            const days = month['days'].filter(d => d.date === day.date);
            const date = days[0];
            if (date) {
                date.start = day.start;
                date.end = day.end;
            } else {
                console.log(month['days']);
                month['days'].push({ date: day.date, start: day.start, end: day.end });
            }
        } else {
            hourControl = {
                data: [
                    {
                        year: day.year,
                        months: [
                            {
                                month: day.month,
                                days: [
                                    {
                                        date: day.date,
                                        start: day.start,
                                        end: day.end
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
        }
        localStorage.setItem('HOUR_CONTROL', JSON.stringify(hourControl));
    }

}
