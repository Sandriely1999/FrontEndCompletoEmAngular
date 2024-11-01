import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import {importProvidersFrom} from '@angular/core';
import {appRoutingProviders} from './app/app-routing.module';
import { provideNgxMask } from 'ngx-mask';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule), // Importação do BrowserModule
    provideHttpClient(),
    provideNgxMask(),  // Adicionando o provider do ngx-mask
    ...appRoutingProviders // Configuração do HttpClient com interceptores
  ]
}).catch(err => console.error(err));
