import {provideRouter, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {CozinhaComponent} from './components/cozinha/cozinha.component';
import {EntregadorComponent} from './components/entregador/entregador.component';

const routes: Routes = [
  // {path: '', component:AppComponent},
  {path: 'cozinha', component:CozinhaComponent},
  {path: 'entregador', component:EntregadorComponent},

]

export const appRoutingProviders = [
  provideRouter(routes),
];
