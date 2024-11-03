import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CozinhaComponent } from './components/cozinha/cozinha.component';
import { EntregadorComponent } from './components/entregador/entregador.component';
import { ClientViewComponent } from './views/client-view/client-view.component';
import { StatusViewComponent } from './views/status-view/status-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'cliente', pathMatch: 'full' },
  { path: 'cozinha', component: CozinhaComponent },
  { path: 'entregador', component: EntregadorComponent },
  { path: 'cliente', component: ClientViewComponent },
  { path: 'status/:orderId', component: StatusViewComponent }
];

export const appRoutingProviders = [
  provideRouter(routes),
];
