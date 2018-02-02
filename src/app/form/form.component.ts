import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MessageBusService } from '../shared/message-bus.service';
import { Subscription } from 'rxjs/Subscription';
import { setInterval } from 'timers';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

    public static readonly FORM_DATE_KEY = 'FORM_DATE_KEY';

    @ViewChild('modal') modal: ElementRef;
    protected day: { date: number, month: number, year: number, active: boolean };
    private subscription: Subscription;

    constructor(private messageBus: MessageBusService) {
        this.subscription = this.messageBus.subscribe(next => {
            if (next === FormComponent.FORM_DATE_KEY) {
                this.day = <any> this.messageBus.consume(next);
            }
        });
    }

    ngOnInit() {}

    public showModal() {
        this.modal.nativeElement.style.display = 'flex';
    }

    closeModal() {
        this.modal.nativeElement.style.display = 'none';
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
