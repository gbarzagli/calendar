import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { PanelComponent } from './panel/panel.component';
import { FormComponent } from './form/form.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarService } from './shared/calendar.service';
import { MessageBusService } from './shared/message-bus.service';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        PanelComponent,
        FormComponent,
        CalendarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule
    ],
    providers: [CalendarService, MessageBusService],
    bootstrap: [AppComponent]
})
export class AppModule { }
