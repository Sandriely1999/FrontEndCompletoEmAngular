import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {OrderStatus} from '../../../models/orderstatus.enum';
import {BehaviorSubject, interval, Subscription, switchMap} from 'rxjs';
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
  private statusSubject = new BehaviorSubject<OrderStatus>(OrderStatus.PREPARANDO);
  currentStatus$ = this.statusSubject.asObservable();
  private updateSubscription?: Subscription;
  isDeliveryConfirmed = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number },
    private dialogRef: MatDialogRef<OrderStatusComponent>,
    private pedidoService: PedidoService
  ) {}

  ngOnInit() {
    // Configurar atualização periódica usando switchMap
    this.updateSubscription = interval(5000).pipe(
      switchMap(() => this.pedidoService.getPedidoById(this.data.orderId))
    ).subscribe({
      next: (order: OrderResponse) => {
        this.statusSubject.next(order.orderStatus);
        if (order.orderStatus === OrderStatus.ENVIANDO)
        console.log(order.orderStatus);
        console.log(this.currentStatus$)
      },
      error: (error) => {
        console.error('Error fetching order status:', error);
      }
    });

    // Fazer a primeira chamada imediatamente
    this.updateOrderStatus();
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    this.statusSubject.complete();
  }

  private updateOrderStatus() {
    this.pedidoService.getPedidoById(this.data.orderId).subscribe({
      next: (order: OrderResponse) => {
        this.statusSubject.next(order.orderStatus);
        if (order.orderStatus === OrderStatus.ENVIANDO)
        console.log(order.orderStatus);
        console.log(this.currentStatus$)
      },
      error: (error) => {
        console.error('Error fetching order status:', error);
      }
    });
  }


  getCurrentStepIndex(): number {
    const currentStatus = typeof this.statusSubject.value === 'string'
      ? OrderStatus[this.statusSubject.value as keyof typeof OrderStatus]
      : this.statusSubject.value;
    return currentStatus;
  }

  isStepCompleted(status: OrderStatus): boolean {
    const currentStatus = typeof this.statusSubject.value === 'string'
      ? OrderStatus[this.statusSubject.value as keyof typeof OrderStatus]
      : this.statusSubject.value;

    if (this.isDeliveryConfirmed && status === OrderStatus.ENTREGUE) {
      return true;
    }

    return currentStatus > status;
  }

  confirmDelivery() {
    if (!this.isDeliveryConfirmed && this.isEnviandoStatus()) {
      this.isDeliveryConfirmed = true;
      this.pedidoService.pedidoEntregue(this.data.orderId).subscribe({
        next: () => {
          this.statusSubject.next(OrderStatus.ENTREGUE);
        },
        error: (error) => {
          console.error('Error confirming delivery:', error);
        }
      });
    }
  }

  isEnviandoStatus(): boolean{
    const currentStatus = typeof this.statusSubject.value === 'string'
        ? OrderStatus[this.statusSubject.value as keyof typeof OrderStatus]
        : this.statusSubject.value;
    return currentStatus === OrderStatus.ENVIANDO;
  }

  isEntregueStatus(): boolean{
    const currentStatus = typeof this.statusSubject.value === 'string'
        ? OrderStatus[this.statusSubject.value as keyof typeof OrderStatus]
        : this.statusSubject.value;
    return currentStatus === OrderStatus.ENTREGUE;
  }

  close() {
    this.dialogRef.close();
  }
}
