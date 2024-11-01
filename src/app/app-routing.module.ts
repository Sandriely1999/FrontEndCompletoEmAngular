import {provideRouter, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {CozinhaComponent} from './components/cozinha/cozinha.component';
import {EntregadorComponent} from './components/entregador/entregador.component';
import {ClientTotalComponent} from './components/cliente/client-total.component';

const routes: Routes = [
  // {path: '', component:ClientTotalComponent},
  {path: 'cozinha', component:CozinhaComponent},
  {path: 'entregador', component:EntregadorComponent},
  {path: 'cliente', component:ClientTotalComponent},

]

export const appRoutingProviders = [
  provideRouter(routes),
];
