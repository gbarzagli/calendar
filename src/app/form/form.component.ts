import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

    @ViewChild('modal') modal: ElementRef;

    constructor() {}

    ngOnInit() {}

    public showModal() {
        this.modal.nativeElement.style.display = 'flex';
    }

    closeModal() {
        this.modal.nativeElement.style.display = 'none';
    }
}
