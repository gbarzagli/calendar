import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import { firebase } from '@firebase/app';
import { isUndefined } from 'util';

@Injectable()
export class CalendarService {

    private static readonly MONTH_DESCRIPTIONS = ['Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    private month: number;
    private year: number;

    public user;

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        if (isUndefined(this.user)) {
            const email = 'gabriel.barzagli@hotmail.com'; // prompt('Email: ', 'example@email.com');
            const password = 'j9dc5fdr'; // prompt('Password: ', 'password');
            afAuth.auth.signInWithEmailAndPassword(email, password)
                .then(auth => {
                    this.user = auth.user;
                    console.log(this.user);
                })
                .catch(authErr => {
                    if (authErr.code === 'auth/user-not-found') {
                        afAuth.auth.createUserWithEmailAndPassword(email, password)
                            .then(auth => {
                                this.user = auth.user;
                            })
                            .catch(createErr => {
                                alert(createErr);
                                window.location.reload();
                            });
                    } else {
                        alert(authErr);
                        window.location.reload();
                    }
                });
        }

        // db.list('items').snapshotChanges(['child_changed', 'child_removed', 'child_moved']).subscribe(change => {
        //     console.log('Data changed: ', change);
        // });
        // db.list('items').snapshotChanges(['child_added']).subscribe(actions => {
        //     actions.forEach(action => {
        //         console.log(action.type);
        //         console.log(action.key);
        //         console.log(action.payload.val());
        //     });
        // });
    }

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

        const hourControl = this.getHourControl(month, year);

        // get the length of days in the month by getting its last day
        const length = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= length; i++) {
            if (column === 7) {
                column = 0;
                line++;
            }

            const hours = hourControl.filter(d => d.date === i)[0];
            const start = hours ? hours.start : null;
            const end = hours ? hours.end : null;
            days[line][column++] = { date: i, month: month, year: year, active: true, start: start, end: end };
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

    public getHourControl(month, year): Array<any> {
        let result = [];
        if (this.user) {
            this.db.list(`hourControl/${this.user.uid}/years`, ref => ref.orderByChild('year').equalTo(year))
                .valueChanges().subscribe(years => {
                    if (years.length > 0) {
                        console.log('a')
                        const filtered = years[0]['months'].filter(m => m.month === month);
                        console.log('ab', filtered);
                        if (filtered.length > 0) {
                            console.log('ab', filtered[0].days);
                            result = filtered[0].days;
                        }
                    }
                });
        }

        return result;
        // const hourControl = JSON.parse(localStorage.getItem('HOUR_CONTROL'));
        // const years = hourControl.data.filter(y => y.year === year)[0];
        // const months = years.months.filter(m => m.month === month)[0];
        // return months ? months.days : [];
    }

    public save(day) {
        const hourControl: any = {
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
        };

        const dbRef = this.db.list(`hourControl/${this.user.uid}/years`);
        this.db.list(`hourControl/${this.user.uid}/years`, ref => {
            return ref.orderByChild('year').equalTo(day.year);
        }).snapshotChanges(['child_changed']).subscribe(years => {
            if (years.length === 0) {
                dbRef.push(hourControl);
            } else {
                const year = years[0].payload.val();
                console.log('a', year);

                let months = year['months'].filter(m => m.month === day.month);
                if (months.length === 0) {
                    year['months'].push({ month: day.month, days: [] });
                    months = year['months'].filter(y => y.month === day.month);
                }
                const month = months[0];

                const days = month['days'].filter(d => d.date === day.date);
                const date = days[0];
                if (date) {
                    date.start = day.start;
                    date.end = day.end;
                } else {
                    month['days'].push({ date: day.date, start: day.start, end: day.end });
                }

                dbRef.update(years[0].key, year);
            }
        });


    }

}
