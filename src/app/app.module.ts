import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule, DatePipe, LocationStrategy,
  PathLocationStrategy,
  UpperCasePipe
} from '@angular/common';
import { NgModule, isDevMode } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullComponent } from './pages/layouts/full/full.component';
import { NavigationComponent } from './shared/header/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyFormatterDirective } from './utils/CurrencyFormatterDirective';
import { SpinnerComponent } from './shared/spinner.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyFormatterDirective,
    SpinnerComponent,
    LoginComponent,
    LogoutComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(Approutes, { useHash: false }),
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    FormsModule,
    FullCalendarModule,
    ToastModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    DatePipe,
    UpperCasePipe,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
