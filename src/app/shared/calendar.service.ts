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

    private month: number = new Date().getMonth();
    private year: number = new Date().getFullYear();

    public user;
    private hourControl: any[] = [];

    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
        if (isUndefined(this.user)) {
            this.user = JSON.parse(localStorage.getItem('user'));
            if (!this.user) {
                this.user = {};

                this.user.email = prompt('Email: ');
                this.user.password = prompt('Password: ');

                if (this.user.email == null || this.user.password == null) {
                    alert('Please type your e-mail or/and password.');
                    window.location.reload();
                }
            }

            afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
                .then(auth => {
                    this.user['uid'] = auth.user.uid;
                    localStorage.setItem('user', JSON.stringify(this.user));

                    this.getDaysOfAMonthYear(this.month, this.year);
                })
                .catch(authErr => {
                    if (authErr.code === 'auth/user-not-found') {
                        afAuth.auth.createUserWithEmailAndPassword(this.user['email'], this.user['password'])
                            .then(auth => {
                                this.user['uid'] = auth.user.uid;
                                localStorage.setItem('user', JSON.stringify(this.user));

                                this.getDaysOfAMonthYear(this.month, this.year);
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

    public getHourBalance(): Observable<number> {
        const observable = Observable.create(observer => {
            let balance = 0;
            this.db.list(`hourControl/${this.user.uid}/years`, ref => {
                return ref.orderByChild('year').equalTo(this.year);
            }).valueChanges(['child_changed']).subscribe(next => {
                if (next.length !== 0) {
                    const year = next[0];
                    const month = year['months'].filter(m => m.month === this.month)[0];
                    if (month) {
                        balance = month['days'].reduce((value, d) => {
                            if (d.date <= 20) {
                                return value + this.calcBalance(d);
                            } else {
                                return value + 0;
                            }
                        }, 0);
                    }

                    const prevMonth = year['months'].filter(m => m.month === (this.month - 1))[0];
                    if (prevMonth) {
                        balance = prevMonth['days'].reduce((value, d) => {
                            if (d.date >= 21) {
                                return value + this.calcBalance(d);
                            } else {
                                return value + 0;
                            }
                        }, balance);
                    }

                    observer.next(balance);
                    return;
                }
                observer.next(0);
            });
        });

        return observable;
    }

    private calcBalance(d: any): number {
        if (d.start === '' || d.end === '') {
            return 0;
        }
        const start = d.start.split(':');
        const end = d.end.split(':');
        const startDate = new Date(this.year, this.month, d.date, start[0], start[1]);
        const endDate = new Date(this.year, this.month, d.date, end[0], end[1]);

        return ((endDate.getTime() - startDate.getTime()) / 1000 / 60) - 480;
    }

}
