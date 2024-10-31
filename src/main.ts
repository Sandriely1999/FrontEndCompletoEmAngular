import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import {importProvidersFrom} from '@angular/core';
import {appRoutingProviders} from './app/app-routing.module';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule), // Importação do BrowserModule
    provideHttpClient(),
    ...appRoutingProviders// Configuração do HttpClient com interceptores
  ]
}).catch(err => console.error(err));


