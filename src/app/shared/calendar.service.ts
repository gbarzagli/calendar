import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';
import { firebase } from '@firebase/app';
import { isUndefined } from 'util';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CalendarService {

    private static readonly MONTH_DESCRIPTIONS = ['Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    private month: number;
    private year: number;

    public user;
    private hourControl: any[] = [];

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        if (isUndefined(this.user)) {
            let credentials = JSON.parse(localStorage.getItem('credentials'));
            if (!credentials) {
                credentials = {};

                credentials.email =  prompt('Email: ');
                credentials.password = prompt('Password: ');

                if (credentials.email == null || credentials.password == null) {
                    alert('Please type your e-mail or/and password.');
                    window.location.reload();
                }
            }

            afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
                .then(auth => {
                    this.user = auth.user;
                    localStorage.setItem('credentials', JSON.stringify({ email: credentials.email, password: credentials.password }));
                })
                .catch(authErr => {
                    if (authErr.code === 'auth/user-not-found') {
                        afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
                            .then(auth => {
                                this.user = auth.user;
                                localStorage.setItem('credentials',
                                    JSON.stringify({ email: credentials.email, password: credentials.password }));
                            })
                            .catch(createErr => {
                                alert(createErr);
                                window.location.reload();
                            });
                    }
                });
        }
    }

    /**
     * getDaysOfAMonthYear
     */
    public getDaysOfAMonthYear(month: number, year: number): Observable<any> {
        this.month = month;
        this.year = year;

        const result = Observable.create(observer => {
            const control$ = this.getHourControl(month, year).subscribe(hourControl => {
                observer.next(this.buildMonth(month, year, hourControl));
            });

            return () => control$.unsubscribe();
        });

        return result;
    }

    private buildMonth(month: number, year: number, hourControl?) {
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

            const hours = hourControl ? hourControl.filter(d => d.date === i)[0] : undefined;
            const start = hours ? hours.start : undefined;
            const end = hours ? hours.end : undefined;
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

    public getHourControl(month, year): Observable<any> {
        const observable = Observable.create(observer => {
            const id = setInterval(() => {
                if (this.user) {
                    this.db.list(`hourControl/${this.user.uid}/years`, ref => ref.orderByChild('year').equalTo(year))
                        .valueChanges().subscribe(years => {
                            if (years.length > 0) {
                                const filtered = years[0]['months'].filter(m => m.month === month);
                                if (filtered.length > 0) {
                                    observer.next(filtered[0].days);
                                    return;
                                }
                            }
                            observer.next();
                        });
                } else {
                    observer.next();
                }
            }, 100);
            return () => clearInterval(id);
        });

        return observable;
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
