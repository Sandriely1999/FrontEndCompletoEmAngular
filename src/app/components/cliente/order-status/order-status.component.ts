import { Component } from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {ButtonModule} from 'primeng/button';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [
    MatCardModule,
    MatStepperModule,
    ButtonModule
  ],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent {
  currentStep = 0; // Controla o status atual do pedido.
  pedidoEnviado = false; // Nova propriedade para controlar se o pedido foi enviado.

  nextStep() //Esse é um método da classe que incrementa o valor de currentStep em 1, fazendo com que o status do pedido avance para a próxima etapa
  {
    this.currentStep++;
  }

  prevStep() //Método da classe que decrementa o valor de currentStep em 1, fazendo com que o status do pedido volte para a etapa anterior.
  //Verificar nessidade desse método.
  {
    this.currentStep--;
  }

  onPedidoEnviado() {
    this.pedidoEnviado = true; // Atualiza a propriedade quando o pedido é enviado
    this.currentStep = 1; // Avança para o primeiro passo
  }
}

