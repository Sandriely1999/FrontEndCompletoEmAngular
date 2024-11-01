import { Component, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, map } from 'rxjs';
import { DishResponse } from '../../models/responses/dish.response';
import { PedidoService } from '../../services/pedido.service';
import { NewOrderRequest } from '../../models/requests/order.request';
import { NewOrderItemRequest } from '../../models/requests/orderItem.request';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { ProductCarouselComponent } from './product-carousel/product-carousel.component';
import { AsyncPipe } from '@angular/common';
import { OrderItemsResponse } from '../../models/responses/orderItems.response';

@Component({
  selector: 'app-client-total',
  standalone: true,
  templateUrl: './client-total.component.html',
  imports: [
    DeliveryInfoComponent,
    OrderSummaryComponent,
    ProductCarouselComponent,
    AsyncPipe
  ],
  styleUrls: ['./client-total.component.css']
})
export class ClientTotalComponent implements OnDestroy {
  title = 'VEM COMER';
  dishes$: Observable<DishResponse[]>;
  private dishes: DishResponse[] = [];
  private dishesSubscription!: Subscription;
  private _selectedOrderItems$ = new BehaviorSubject<NewOrderItemRequest[]>([]);

  selectedOrderItems$ = this._selectedOrderItems$.asObservable().pipe(
    map(items => items.map(item => {
      const dish = this.getDish(item.dishId);
      if (!dish) return null;

      return new OrderItemsResponse(
        0, // id temporário
        item.quantity,
        dish,
        null as any // pedido ainda não criado
      );
    })),
    map(items => items.filter((item): item is OrderItemsResponse => item !== null)),
    map(items => items ?? [])
  );

  constructor(private pedidoService: PedidoService) {
    this.dishes$ = this.pedidoService.getAllValidDishes();
    this.dishesSubscription = this.dishes$.subscribe(dishes => {
      this.dishes = dishes;
    });
  }

  ngOnDestroy(): void {
    if (this.dishesSubscription) {
      this.dishesSubscription.unsubscribe();
    }
  }

  addToOrder(dish: DishResponse) {
    const newItem = new NewOrderItemRequest(dish.dishId, 1);
    this._selectedOrderItems$.next([...this._selectedOrderItems$.value, newItem]);
  }

  removeFromOrder(dish: DishResponse) {
    const updatedItems = this._selectedOrderItems$.value.filter(item => item.dishId !== dish.dishId);
    this._selectedOrderItems$.next(updatedItems);
  }

  get total() {
    return this._selectedOrderItems$.value.reduce((sum, item) => sum + this.getDishPrice(item.dishId), 0);
  }

  getDishPrice(dishId: number): number {
    const dish = this.dishes.find(d => d.dishId === dishId);
    return dish ? dish.price : 0;
  }

  private getDish(dishId: number): DishResponse | undefined {
    return this.dishes.find(d => d.dishId === dishId);
  }

  handleOrderStart(order: NewOrderRequest) {
    this.pedidoService.criarPedido(order).subscribe({
      next: (response) => {
        console.log('Pedido criado com sucesso:', response);
        // Limpar o carrinho
        this._selectedOrderItems$.next([]);
        // Você pode adicionar uma notificação de sucesso aqui
        // Ou redirecionar para uma página de confirmação
      },
      error: (error) => {
        console.error('Erro ao criar pedido:', error);
        // Você pode adicionar uma notificação de erro aqui
      }
    });
  }
}
