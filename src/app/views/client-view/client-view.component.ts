import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewOrderItemRequest } from '../../models/requests/orderItem.request';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {OrderFormComponent} from '../../components/cliente/order-form/order-form.component';
import {OrderSummaryComponent} from '../../components/cliente/order-summary/order-summary.component';
import {DishCarouselComponent} from '../../components/cliente/dish-carousel/dish-carousel.component';
import {OrderStatusComponent} from '../../components/cliente/order-status/order-status.component';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-client-view',
  standalone: true,
  imports: [
    CommonModule,
    OrderFormComponent,
    DishCarouselComponent,
    OrderSummaryComponent,
    MatButtonModule,
    MatIconModule,
    OrderFormComponent,
    OrderSummaryComponent,
    DishCarouselComponent,
    MatTooltip
  ],
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.css']
})
export class ClientViewComponent {
  selectedOrderItems: NewOrderItemRequest[] = [];
  currentOrderId?: number;
  showStatusButton = false;

  constructor(private dialog: MatDialog) {}

  updateOrderItems(items: NewOrderItemRequest[]) {
    this.selectedOrderItems = items;
  }

  onOrderCreated(orderId: number) {
    console.log('Order created with ID:', orderId);
    this.currentOrderId = orderId;
    this.showStatusButton = true;
  }

  openOrderStatus() {
    if (this.currentOrderId) {
      this.dialog.open(OrderStatusComponent, {
        data: { orderId: this.currentOrderId },
        width: '500px',
        disableClose: false
      });
    }
  }
}
