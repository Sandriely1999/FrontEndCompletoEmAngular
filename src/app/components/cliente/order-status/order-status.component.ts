import { Component, OnInit, Input } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { ButtonModule } from 'primeng/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { OrderResponse } from '../../../models/responses/order.response';
import { OrderStatus } from '../../../models/orderstatus.enum';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatStepperModule,
    ButtonModule
  ],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {
  @Input() orderResponse!: OrderResponse;
  currentStatus: OrderStatus = OrderStatus.PREPARANDO;
  OrderStatus = OrderStatus; // Expor o enum para o template

  ngOnInit(): void {
    if (this.orderResponse) {
      this.currentStatus = this.orderResponse.orderStatus;
    }
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PREPARANDO:
        return 'Preparando';
      case OrderStatus.PRONTO:
        return 'Pronto';
      case OrderStatus.ENVIANDO:
        return 'Enviando';
      case OrderStatus.ENTREGUE:
        return 'Entregue';
      default:
        return 'Status Desconhecido';
    }
  }

  isCompleted(status: OrderStatus): boolean {
    return this.currentStatus > status;
  }

  isCurrent(status: OrderStatus): boolean {
    return this.currentStatus === status;
  }
}
