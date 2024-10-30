import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import {importProvidersFrom} from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule), // Importação do BrowserModule
    provideHttpClient() // Configuração do HttpClient com interceptores
  ]
}).catch(err => console.error(err));

