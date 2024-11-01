import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishResponse } from '../../../models/responses/dish.response';
import { MatCardModule } from '@angular/material/card';
import { OrderItemsResponse } from '../../../models/responses/orderItems.response';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
  imports: [CommonModule, MatCardModule]
})
export class OrderSummaryComponent {
  @Input() selectedOrderItems: OrderItemsResponse[] = [];
  @Input() removeFromOrder!: (product: DishResponse) => void;
  @Input() total: number = 0;
  @Input() deliveryFee: number = 15;

  get totalOrder() {
    return this.total + this.deliveryFee;
  }
}
