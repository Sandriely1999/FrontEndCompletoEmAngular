import { Component, OnInit, Input } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { ButtonModule } from 'primeng/button';
import { MatCardModule } from '@angular/material/card';
import {NewOrderRequest} from '../../../models/requests/order.request';
import {OrderStatus} from '../../../models/orderstatus.enum';
import {PedidoService} from '../../../services/pedido.service';


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
export class OrderStatusComponent implements OnInit {
  @Input() newOrderRequest!: NewOrderRequest;
  currentStatus: OrderStatus = OrderStatus.PREPARANDO;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.createOrder();
  }

  createOrder() {
    this.pedidoService.criarPedido(this.newOrderRequest).subscribe({
      next: (response: any) => { // Adiciona o tipo 'any' para evitar erro TS7006
        console.log('Pedido criado com sucesso:', response);
        this.currentStatus = OrderStatus.PREPARANDO;
      },
      error: (error:any) => {
        console.error('Erro ao criar o pedido:', error);
      }
    });
  }

  nextStatus() {
    switch (this.currentStatus) {
      case OrderStatus.PREPARANDO:
        this.currentStatus = OrderStatus.PRONTO;
        break;
      case OrderStatus.PRONTO:
        this.currentStatus = OrderStatus.ENVIANDO;
        break;
      case OrderStatus.ENVIANDO:
        this.currentStatus = OrderStatus.ENTREGUE;
        break;
      case OrderStatus.ENTREGUE:
        // Do nothing, order is complete
        break;
    }
  }

  prevStatus() {
    switch (this.currentStatus) {
      case OrderStatus.PRONTO:
        this.currentStatus = OrderStatus.PREPARANDO;
        break;
      case OrderStatus.ENVIANDO:
        this.currentStatus = OrderStatus.PRONTO;
        break;
      case OrderStatus.ENTREGUE:
        this.currentStatus = OrderStatus.ENVIANDO;
        break;
      case OrderStatus.PREPARANDO:
        // Do nothing, order is at the initial stage
        break;
    }
  }
}
