import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { FormComponent } from './form/form.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarService } from './shared/calendar.service';

@NgModule({
    declarations: [
        AppComponent,
        EventsComponent,
        FormComponent,
        CalendarComponent
    ],
    imports: [BrowserModule],
    providers: [CalendarService],
    bootstrap: [AppComponent]
})
export class AppModule {}
