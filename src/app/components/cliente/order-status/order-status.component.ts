import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderStatus} from '../../../models/orderstatus.enum';
import { interval, Subscription } from 'rxjs';
import {PedidoService} from '../../../services/pedido.service';
import {OrderResponse} from '../../../models/responses/order.response';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit, OnDestroy {
  OrderStatus = OrderStatus;
  currentStatus: OrderStatus = OrderStatus.PREPARANDO;
  updateSubscription?: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number },
    private dialogRef: MatDialogRef<OrderStatusComponent>,
    private pedidoService: PedidoService
  ) {}

  ngOnInit() {
    this.updateOrderStatus();
    // Poll for status updates every 10 seconds
    this.updateSubscription = interval(10000).subscribe(() => {
      this.updateOrderStatus();
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private updateOrderStatus() {
    this.pedidoService.getPedidoById(this.data.orderId).subscribe({
      next: (order: OrderResponse) => {
        this.currentStatus = order.orderStatus;
      },
      error: (error) => {
        console.error('Error fetching order status:', error);
      }
    });
  }

  getStepCompleted(status: OrderStatus): boolean {
    return this.currentStatus > status;
  }

  getStepState(status: OrderStatus): string {
    if (this.currentStatus === status) {
      return 'current';
    }
    if (this.currentStatus > status) {
      return 'completed';
    }
    return 'pending';
  }

  confirmDelivery() {
    this.pedidoService.pedidoEntregue(this.data.orderId).subscribe({
      next: (response) => {
        this.currentStatus = OrderStatus.ENTREGUE;
        setTimeout(() => this.dialogRef.close(), 2000);
      },
      error: (error) => {
        console.error('Error confirming delivery:', error);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
