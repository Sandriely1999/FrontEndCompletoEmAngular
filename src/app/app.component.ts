import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EntregadorComponent} from './components/entregador/entregador.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EntregadorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TelaEntregador';
}
