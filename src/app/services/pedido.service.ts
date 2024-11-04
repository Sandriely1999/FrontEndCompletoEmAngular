import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/responses/order.response';
import { DishResponse } from '../models/responses/dish.response';
import { NewOrderRequest } from '../models/requests/order.request';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly ordersUrl = `${this.baseUrl}/orders`;
  private readonly dishesUrl = `${this.baseUrl}/dishes`;

  constructor(private http: HttpClient) {}

  // Pedidos
  listaPedidosPronto(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.ordersUrl}/listaPedidosPronto`);
  }

  listaPedidosEnviando(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.ordersUrl}/listaPedidosEnviando`);
  }

  getPedidoById(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.ordersUrl}/${orderId}`);
  }

  criarPedido(orderData: NewOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.ordersUrl}/criarPedido`, orderData);
  }

  // Status do Pedido
  trocarStatusParaEnviando(orderId: number): Observable<void> {
    return this.http.put<void>(`${this.ordersUrl}/trocarStatusParaEnviando/${orderId}`, {});
  }

  // Novo método para confirmar entrega do pedido
  pedidoEntregue(orderId: number): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.ordersUrl}/pedidoEntregue/${orderId}`, {});
  }

  // Pratos
  getAllValidDishes(): Observable<DishResponse[]> {
    return this.http.get<DishResponse[]>(`${this.dishesUrl}/getAllValidDishes`);
  }

  getDishById(dishId: number): Observable<DishResponse> {
    return this.http.get<DishResponse>(`${this.dishesUrl}/${dishId}`);
  }
}
