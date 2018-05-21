import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarService } from '../shared/calendar.service';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

    public static readonly FORM_DATE_KEY = 'FORM_DATE_KEY';

    @ViewChild('modal') modal: ElementRef;
    @ViewChild('overlay') overlay: ElementRef;
    day: any = {};

    constructor(private calendarService: CalendarService) { }

    ngOnInit() {
    }

    public onSubmit() {
        this.calendarService.save(this.day);
        this.closeModal();
    }

    public onCancel() {
        this.closeModal();
    }

    public showModal() {
        if (this.day) {
            document.querySelector('.wrapper').setAttribute('style', 'display: flex');
            document.querySelector('.overlay').setAttribute('style', 'display: flex');
            document.querySelector('.modal').setAttribute('style', 'display: flex');
        }
    }

    public closeModal() {
        document.querySelector('.wrapper').setAttribute('style', 'display: none');
        document.querySelector('.overlay').setAttribute('style', 'display: none');
        document.querySelector('.modal').setAttribute('style', 'display: none');
    }
}
