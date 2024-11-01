import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DishResponse } from '../../models/responses/dish.response';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderStatusComponent } from './order-status/order-status.component';
import { EntregadorComponent } from '../entregador/entregador.component';
import { ProductCarouselComponent } from './product-carousel/product-carousel.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';
import { PedidoService } from '../../services/pedido.service';
import { HttpClientModule } from '@angular/common/http';
import { NewOrderRequest } from '../../models/requests/order.request';

@Component({
  selector: 'app-client-total',
  standalone: true,
  imports: [
    RouterOutlet,
    EntregadorComponent,
    CommonModule,
    ProductCarouselComponent,
    OrderSummaryComponent,
    DeliveryInfoComponent,
    FormsModule,
    OrderStatusComponent,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './client-total.component.html',
  styleUrls: ['./client-total.component.css']
})
export class ClientTotalComponent {
  title = 'VEM COMER';
  dishes$: Observable<DishResponse[]>;
  selectedProducts: DishResponse[] = [];

  constructor(private pedidoService: PedidoService) {
    this.dishes$ = this.pedidoService.getAllValidDishes();
  }

  addToOrder(dish: DishResponse) {
    this.selectedProducts.push(dish);
  }

  removeFromOrder(dish: DishResponse) {
    const index = this.selectedProducts.indexOf(dish);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
    }
  }

  get total() {
    return this.selectedProducts.reduce((sum, product) => sum + product.price, 0);
  }
}
