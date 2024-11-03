import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardActions, MatCardContent, MatCardImage} from '@angular/material/card';
import {NewOrderItemRequest} from '../../../models/requests/orderItem.request';
import {DishResponse} from '../../../models/responses/dish.response';
import {PedidoService} from '../../../services/pedido.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatIconButton} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dish-carousel',
  standalone: true,
  imports: [
    MatIcon,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatIconButton,
    MatCardImage,
    CommonModule
  ],
  templateUrl: './dish-carousel.component.html',
  styleUrl: './dish-carousel.component.css'
})
export class DishCarouselComponent implements OnInit {
  @Output() orderItemsChange = new EventEmitter<NewOrderItemRequest[]>();

  dishes: DishResponse[] = [];
  selectedItems = new Map<number, number>(); // dishId -> quantity
  currentIndex = 0;
  itemsToShow = 3;
  visibleDishes: DishResponse[] = [];

  constructor(
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.loadDishes();
  }

  loadDishes() {
    this.pedidoService.getAllValidDishes().subscribe({
      next: (dishes) => {
        this.dishes = dishes;
        this.updateVisibleDishes();
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar os pratos', 'Fechar', {duration: 3000});
      }
    });
  }

  updateVisibleDishes() {
    this.visibleDishes = this.dishes.slice(
      this.currentIndex,
      this.currentIndex + this.itemsToShow
    );
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateVisibleDishes();
    }
  }

  nextSlide() {
    if (this.currentIndex < this.dishes.length - this.itemsToShow) {
      this.currentIndex++;
      this.updateVisibleDishes();
    }
  }

  getQuantity(dish: DishResponse): number {
    return this.selectedItems.get(dish.dishId) || 0;
  }

  increaseQuantity(dish: DishResponse) {
    const currentQty = this.selectedItems.get(dish.dishId) || 0;
    this.selectedItems.set(dish.dishId, currentQty + 1);
    this.emitOrderItems();
  }

  decreaseQuantity(dish: DishResponse) {
    const currentQty = this.selectedItems.get(dish.dishId) || 0;
    if (currentQty > 0) {
      this.selectedItems.set(dish.dishId, currentQty - 1);
      this.emitOrderItems();
    }
  }

  private emitOrderItems() {
    const orderItems: NewOrderItemRequest[] = [];
    this.selectedItems.forEach((quantity, dishId) => {
      if (quantity > 0) {
        orderItems.push(new NewOrderItemRequest(dishId, quantity));
      }
    });
    this.orderItemsChange.emit(orderItems);
  }
}
