import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderItemsResponse } from '../models/responses/orderItems.response';
import { DishResponse } from '../models/responses/dish.response';

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private selectedItems = new BehaviorSubject<OrderItemsResponse[]>([]);
  private totalValue = new BehaviorSubject<number>(0);
  private availableDishes = new BehaviorSubject<DishResponse[]>([]);

  selectedItems$ = this.selectedItems.asObservable();
  totalValue$ = this.totalValue.asObservable();
  availableDishes$ = this.availableDishes.asObservable();

  setAvailableDishes(dishes: DishResponse[]) {
    this.availableDishes.next(dishes);
  }

  addToOrder(dish: DishResponse) {
    if (!dish.availability) {
      console.error('Prato não disponível:', dish.name);
      return;
    }

    const currentItems = this.selectedItems.value;
    const existingItem = currentItems.find(item =>
      item.dishResponse.dishId === dish.dishId);

    if (existingItem) {
      existingItem.quantity += 1;
      this.selectedItems.next([...currentItems]);
    } else {
      const newItem = new OrderItemsResponse(
        0,
        1,
        dish,
        null as any
      );
      this.selectedItems.next([...currentItems, newItem]);
    }
    this.calculateTotal();
  }

  removeFromOrder(dish: DishResponse) {
    const currentItems = this.selectedItems.value;
    const existingItem = currentItems.find(item =>
      item.dishResponse.dishId === dish.dishId);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        this.selectedItems.next([...currentItems]);
      } else {
        const updatedItems = currentItems.filter(item =>
          item.dishResponse.dishId !== dish.dishId);
        this.selectedItems.next(updatedItems);
      }
      this.calculateTotal();
    }
  }

  private calculateTotal() {
    const total = this.selectedItems.value.reduce((sum, item) =>
      sum + (item.dishResponse.price * item.quantity), 0);
    this.totalValue.next(total);
  }

  getDish(dishId: number): DishResponse | undefined {
    return this.availableDishes.value.find(d => d.dishId === dishId);
  }

  clearCart() {
    this.selectedItems.next([]);
    this.totalValue.next(0);
  }
}
