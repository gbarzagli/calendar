import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PanelComponent } from './panel/panel.component';
import { FormComponent } from './form/form.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarService } from './shared/calendar.service';
import { MessageBusService } from './shared/message-bus.service';

@NgModule({
    declarations: [
        AppComponent,
        PanelComponent,
        FormComponent,
        CalendarComponent
    ],
    imports: [BrowserModule, FormsModule],
    providers: [CalendarService, MessageBusService],
    bootstrap: [AppComponent]
})
export class AppModule {}
