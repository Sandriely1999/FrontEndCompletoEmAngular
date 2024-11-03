import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { NewOrderItemRequest } from '../../../models/requests/orderItem.request';
import { DishResponse } from '../../../models/responses/dish.response';
import { PedidoService } from '../../../services/pedido.service';

interface OrderSummaryItem extends NewOrderItemRequest {
  dish: DishResponse;
  total: number;
}

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIconButton
  ],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnChanges {
  @Input() orderItems: NewOrderItemRequest[] = [];
  @Output() orderItemsChange = new EventEmitter<NewOrderItemRequest[]>();

  summaryItems: OrderSummaryItem[] = [];
  deliveryFee = 15.00;
  totalAmount = 0;

  constructor(private pedidoService: PedidoService) {}

  ngOnChanges() {
    this.updateSummary();
  }

  private async updateSummary() {
    this.summaryItems = [];

    for (const item of this.orderItems) {
      this.pedidoService.getDishById(item.dishId).subscribe(dish => {
        const total = dish.price * item.quantity;
        this.summaryItems.push({
          ...item,
          dish: dish,
          total: total
        });
        this.calculateTotal();
      });
    }
  }

  private calculateTotal() {
    const subtotal = this.summaryItems.reduce((sum, item) => sum + item.total, 0);
    this.totalAmount = subtotal + this.deliveryFee;
  }

  removeItem(dishId: number) {
    this.summaryItems = this.summaryItems.filter(item => item.dishId !== dishId);
    const updatedOrderItems = this.orderItems.filter(item => item.dishId !== dishId);
    this.orderItemsChange.emit(updatedOrderItems); // Emit the change event
  }
}
