import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DishResponse } from '../../models/responses/dish.response';
import { PedidoService } from '../../services/pedido.service';
import { NewOrderRequest } from '../../models/requests/order.request';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { ProductCarouselComponent } from './product-carousel/product-carousel.component';
import { AsyncPipe } from '@angular/common';
import { CartStateService } from '../../services/cart-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-total',
  standalone: true,
  imports: [
    DeliveryInfoComponent,
    OrderSummaryComponent,
    ProductCarouselComponent,
    AsyncPipe
  ],
  templateUrl: './client-total.component.html',
  styleUrls: ['./client-total.component.css']
})
export class ClientTotalComponent implements OnInit, OnDestroy {
  dishes$: Observable<DishResponse[]>;

  constructor(
    private pedidoService: PedidoService,
    private cartState: CartStateService,
    private router: Router
  ) {
    this.dishes$ = this.pedidoService.getAllValidDishes();
  }

  ngOnInit(): void {
    this.dishes$.subscribe(dishes => {
      this.cartState.setAvailableDishes(dishes);
    });
  }

  ngOnDestroy(): void {
    this.cartState.clearCart();
  }

  handleOrderStart(order: NewOrderRequest) {
    this.pedidoService.criarPedido(order).subscribe({
      next: (response) => {
        console.log('Pedido criado com sucesso:', response);
        this.cartState.clearCart();
        // Atualizado para usar a nova rota
        this.router.navigate(['/status', response.orderId]);
      },
      error: (error) => {
        console.error('Erro ao criar pedido:', error);
      }
    });
  }
}
