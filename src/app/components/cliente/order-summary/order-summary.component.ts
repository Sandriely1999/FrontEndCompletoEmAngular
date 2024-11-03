import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DishResponse } from '../../../models/responses/dish.response';
import { MatCardModule } from '@angular/material/card';
import { OrderItemsResponse } from '../../../models/responses/orderItems.response';
import { CartStateService } from '../../../services/cart-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
  imports: [CommonModule, MatCardModule]
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  selectedOrderItems: OrderItemsResponse[] = [];
  total: number = 0;
  deliveryFee: number = 15;
  private subscriptions: Subscription[] = [];

  constructor(private cartState: CartStateService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.cartState.selectedItems$.subscribe(items => {
        this.selectedOrderItems = items;
      }),
      this.cartState.totalValue$.subscribe(value => {
        this.total = value;
      })
    );
  }

  removeFromOrder(product: DishResponse) {
    this.cartState.removeFromOrder(product);
  }

  get totalOrder() {
    return this.total + this.deliveryFee;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
