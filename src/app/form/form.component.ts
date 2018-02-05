import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageBusService } from '../shared/message-bus.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

    public static readonly FORM_DATE_KEY = 'FORM_DATE_KEY';

    @ViewChild('modal') modal: ElementRef;
    protected day: any;

    constructor() {
    }

    ngOnInit() {}

    public showModal() {
        this.modal.nativeElement.style.display = 'flex';
    }

    closeModal() {
        this.modal.nativeElement.style.display = 'none';
    }

    public setDate(date) {
        this.day = date;
    }

    public getDate() {
        return this.day;
    }
}
